import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const proveedoresRouter = express.Router();

const generarWhere = (id) => {
    if (id != null ) {
        return "WHERE id_proveedor=:id"
    } 
    return "";
    
};

// GET /proveedores - Obtener todos los proveedores
proveedoresRouter.get("/", 
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("SELECT * FROM proveedores");
    res.send(rows);
});

//GET /proveedores/:id - Obtener un proveedor por id
proveedoresRouter.get("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const id = req.params.id;
    const [rows,fields] = await db.execute(`SELECT * FROM proveedores ${generarWhere(id)}` , {id});
    if (rows.length > 0){
        res.send(rows[0]);
    } else {
        res.status(404).send({mensaje: "Proveedor no encontrado"});
    }
});


proveedoresRouter.post("/", 
passport.authenticate("jwt", { session: false }),
body("nombre").isString().isLength({min: 1, max: 45}),
body("direccion").isString().isLength({min: 1, max: 45}),
body("telefono").isInt().isString({min: 1, max: 255}),
body("mail").isEmail().isLength({min: 1, max: 45}),
async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const proveedor = req.body;
    const [rows] = await db.execute(
      "INSERT INTO proveedores (nombre, direccion, telefono, mail, fecha_modificacion ) VALUES (:nombre, :direccion, :telefono, :mail, NOW())",
      {
        nombre: proveedor.nombre,
        direccion: proveedor.direccion,
        telefono: proveedor.telefono,          
        mail: proveedor.mail,
      }
    );
    res.status(201).send({ ...proveedor, id_proveedor: rows.insertId });
});

// PUT /proveedores/:id - Modificar una proveedores por id
proveedoresRouter.put("/:id", 
passport.authenticate("jwt", { session: false }),
body("nombre").isString().isLength({min: 1, max: 45}),
body("direccion").isString().isLength({min: 1, max: 45}),
body("telefono").isInt().isLength({min: 1, max: 999999999999999}),
body("mail").isEmail().isLength({min: 1, max: 45}),
async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const id = req.params.id;
    const proveedor = req.body;
    await db.execute(
      `UPDATE proveedores SET nombre=:nombre, direccion=:direccion, telefono=:telefono, mail=:mail, fecha_modificacion=NOW() ${generarWhere(id)}`, 
      {id, nombre: proveedor.nombre, direccion: proveedor.direccion, telefono: proveedor.telefono,mail: proveedor.mail}
    );
    res.send("ok");
});

// DELETE /proveedoress/:id - Quitar una proveedores por id
proveedoresRouter.delete("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }    
    const id = req.params.id;
    await db.execute(`DELETE FROM proveedores ${generarWhere(id)}`, { id });
    res.send("Se ha borrado al proveedor.");
});

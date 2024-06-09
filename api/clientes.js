import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const clientesRouter = express.Router();

const generarWhere = (id) => {
    if (id != null ) {
        return "WHERE id_cliente=:id"
    } else { 
    return " "
    }
}

// GET /personass - Obtener todas las personasss 
clientesRouter.get("/",
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("SELECT * FROM clientes");
    res.send(rows);
});

//GET /personass/:id - Obtener una personass por id
clientesRouter.get("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const id = req.params.id;
    const [rows,fields] = await db.execute(`SELECT * FROM clientes ${generarWhere(id)}` , {id});
    if (rows.length > 0){
        res.send(rows[0]);
    } else {
        res.status(404).send({mensaje: "El cliente no existe"});
    }
});

// { "personass" : { }}
// POST /personass - Crear una nueva personass
clientesRouter.post("/", 
passport.authenticate("jwt", { session: false }),
body("nombre").isString().isLength({min: 1, max: 45}),
body("apellido").isString().isLength({min: 1, max: 45}),
body("email").isEmail().isLength({min: 1, max: 45}),
body("telefono").isInt().isLength({min: 1, max: 100}),
body("direccion").isString().isLength({min: 1, max: 45}),

async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const cliente = req.body;
    const [rows] = await db.execute(
      "INSERT INTO clientes (nombre, apellido, email, telefono, direccion) VALUES (:nombre, :apellido, :email, :telefono, :direccion)",
      { nombre: cliente.nombre, apellido: cliente.apellido, email: cliente.email, 
        telefono: cliente.telefono, direccion: cliente.direccion }
    );
    res.status(201).send({ ...cliente, id_cliente: rows.insertId });
});

// PUT /personass/:id - Modificar una personass por id
clientesRouter.put("/:id", 
passport.authenticate("jwt", { session: false }),
body("nombre").isString().isLength({min: 1, max: 45}),
body("apellido").isString().isLength({min: 1, max: 45}),
body("email").isEmail().isLength({min: 1, max: 45}),
body("telefono").isInt().isLength({min: 1, max: 999999999999999}),
body("direccion").isString().isLength({min: 1, max: 45}),
async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const {id} = req.params;
    const cliente = req.body;
    await db.execute(
        `UPDATE clientes SET nombre=:nombre, apellido=:apellido, email=:email, telefono=:telefono, direccion=:direccion, fecha_modificacion=NOW() ${generarWhere(id)}` ,

      { id, nombre: cliente.nombre, apellido: cliente.apellido, email: cliente.email, 
        telefono: cliente.telefono, direccion: cliente.direccion, fecha_modificacion: cliente.fecha_modificacion }
    );
    res.send("ok");
});

// DELETE /personasss/:id - Quitar una personass por id
clientesRouter.delete("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
    async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }    
    const {id} = req.params;
    await db.execute(`DELETE FROM clientes ${generarWhere(id)}` , { id });
    res.send("Se ha borrado el cliente.");
});
 


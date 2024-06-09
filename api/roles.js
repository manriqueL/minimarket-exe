import express from "express";
import { db } from "./db.js";
import {body, param, query, validationResult} from "express-validator";
import passport from "passport";

export const rolesRouter = express.Router();

const generarWhere=(id)=>{
    if (id!=null) {
        return "WHERE id_rol=:id";
        
    }
    return "";
}

// GET /personas - Obtener todas las personas 
rolesRouter.get("/", 
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("SELECT * FROM roles");
    res.send(rows);
});

//GET /roles/:id - Obtener una tabla por id
rolesRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1, max:2147483647}),
    async (req, res) => {
        const validacion= validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({errors:validacion.errors})
            return
            
        }
    const {id} = req.params;
    const [rows,fields] = await db.execute(`SELECT * FROM roles ${generarWhere(id)}`, {id});
    if (rows.length > 0){
        res.send(rows[0]);
    } else {
        res.status(404).send({mensaje: "Registro no encontrado"});
    }
});

// { "tabla" : { }}
// POST /personas - Crear una nueva tabla
rolesRouter.post("/",
passport.authenticate("jwt", { session: false }),
body("nombre").isString().isLength({min:1, max:45}),
    async (req, res) => {
        const validacion= validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({errors:validacion.errors})
            return
            
        }
    const {nombre} = req.body;
    const [rows] = await db.execute(
      "INSERT INTO roles (nombre) VALUES (:nombre)",
      { nombre}
    );
    res.status(201).send({nombre, id_rol: rows.insertId });
});

// PUT /personas/:id - Modificar una tabla por id
rolesRouter.put("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({ min: 1, max: 2147483647 }),
    body("nombre").isString().isLength({min:1, max:45}),
    async (req, res) => {
        const validacion= validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).send({errors:validacion.errors})
            return
            
        }
    const {id} = req.params;
    const {nombre} = req.body;
    await db.execute(
      `UPDATE roles SET nombre=:nombre, fecha_modificacion=NOW() ${generarWhere(id)}`,
      { id, nombre}
    );
    res.send("ok");
});

// DELETE /personas/:id - Quitar una tabla por id
rolesRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
    param("id").isInt({min:1, max:2147483647}),
    async (req, res) => {
    const id = req.params.id;
    console.log(id)
    await db.execute(`DELETE FROM roles ${generarWhere(id)}`,{id});
    res.send("Se ha borrado el registro.");
});

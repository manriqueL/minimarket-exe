import express from "express";
import { db } from "./db.js";
import {body, param, query, validationResult } from "express-validator"
import passport from "passport";

export const ventasRouter = express.Router();

const generarWhere=(id)=>{
    if (id!=null) {
        return "WHERE id_venta=:id";
        
    }
    return "";
}

// GET /ventas - Obtener todas las ventas 
ventasRouter.get("/", 
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("SELECT * FROM ventas");
  
    res.send(response);
});

//GET /ventas/:id - Obtener una tabla por id
ventasRouter.get("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1 , max:2147483647}),
async (req,res) =>{
    const validacion = validationResult(req);
    if (!validacion.isEmpty()){
        res.status(400).send({errors: validacion.errors})
        return
    }

    const id = req.params.id;
    const [rows,fields] = await db.execute("call get_ventas(:id);", {id});
    if (rows.length > 0){
        const response = rows[0].map((item)=>{
            return {
                "ventas" : {
                    "id_venta": item.id_venta,
                    "fecha_alta": item.venta_fecha_alta,
                    "anulado": item.venta_anulado,
                    "descuento": item.venta_descuento
                },
                "vendedor": {
                    "id_vendedor": item.id_vendedor,
                    "nombre": item.vendedor_nombre,
                    "apellido": item.vendedor_apellido,
                    "email": item.vendedor_email,
                    "direccion": item.vendedor_direccion,
                    "fecha_alta": item.vendedor_fecha_alta
                },
                "cliente": {
                    "id_cliente": item.id_cliente,
                    "nombre": item.cliente_nombre,
                    "apellido": item.cliente_apellido,
                    "email": item.cliente_email,
                    "direccion": item.cliente_direccion,
                    "fecha_alta": item.cliente_fecha_alta
                }
            }
        })
        res.send(response);
    } else {
        res.status(404).send({mensaje: "Registro no encontrado"});
    }
});

// { "tabla" : { }}
// POST /ventas - Crear una nueva tabla
ventasRouter.post("/",
passport.authenticate("jwt", { session: false }),
body("venta.id_vendedor").isInt({min:1 , max:2147483647}),
body("venta.id_cliente").isInt({min:1 , max:2147483647}),
body("venta.descuento").isInt({min:0 , max:2147483647}),

async (req,res) =>{
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
        
    }
    
    const venta = req.body.venta;
    const [rows] = await db.execute(
      "INSERT INTO ventas (id_vendedor,id_cliente,descuento,anulado, fecha_modificacion) VALUES (:id_vendedor,:id_cliente,:descuento, false, NOW())",
      { id_vendedor: venta.id_vendedor, id_cliente: venta.id_cliente, descuento: venta.descuento, anulado: venta.anulado }
    );
    res.status(201).send({ ...venta, id: rows.insertId });
});

// PUT /ventas/:id - Modificar una tabla por id
ventasRouter.put("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1 , max:2147483647}),
body("ventas.anulado").isBoolean(),
async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()){
        res.status(400).send({errors: validacion.errors})
        return
    }
    const {id} = req.params;
    const venta = req.body.ventas;
    await db.execute(
      `UPDATE ventas SET anulado=:anulado, fecha_modificacion=NOW() ${generarWhere(id)} `,
      { id, anulado: venta.anulado }
    );
    res.send("ok");
});

// DELETE /ventas/:id - Quitar una tabla por id
ventasRouter.delete("/:id",
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1 , max:2147483647}),

async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()){
        res.status(400).send({errors: validacion.errors})
        return
    }

    const {id} = req.params;
    await db.execute(`DELETE FROM ventas ${generarWhere(id)} `, { id });
    res.send("Se ha borrado el registro.");
});

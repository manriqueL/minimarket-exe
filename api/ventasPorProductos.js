import express from "express";
import { db } from "./db.js";
import {body, param, query, validationResult} from "express-validator";
import passport from "passport";

export const ventaProductoRouter = express.Router();
// GET /ventaProducto - Obtener todas las ventaProducto 

ventaProductoRouter.get("/", 
passport.authenticate("jwt", { session: false }),
async (req,res) =>{
    const [rows,fields] = await db.execute("call get_all_ventaProducto();");
    const response = rows[0].map((item)=>{
        return {
            "libro" : {
                "id_libro": item.id_libro,
                "nombre" : item.libro_nombre,
                "año": item.libro_año,
                "tipo": item.libro_tipo,
                "isbn": item.libro_isbn,
                "fecha_alta": item.libro_fecha_alta
            },
            "cantidad":item.cantidad,
            "precio":item.precio,
            "venta":{
                "id_venta": item.id_venta,
                "id_cliente": item.id_cliente,
                "id_vendedor": item.id_vendedor,
                "descuento": item.descuento
            }
        }
    })
    res.send(response);
});

//GET /ventaProducto/:id - Obtener una tabla por id
ventaProductoRouter.get("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min:1, max:2147483647}),
async (req,res) =>{
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
    }
    const id = req.params.id;
    const [rows,fields] = await db.execute("call get_ventaProducto(:id);", {id});
    if (rows.length > 0){
        const response = rows[0].map((item)=>{
            return {
                "libro" : {
                    "id_libro": item.id_libro,
                    "nombre" : item.libro_nombre,
                    "año": item.libro_año,
                    "tipo": item.libro_tipo,
                    "isbn": item.libro_isbn,
                    "fecha_alta": item.libro_fecha_alta
                },
                "cantidad":item.vxp_cantidad,
                "precio":item.vxp_precio,
                "venta":{
                    "id_venta": item.id_venta,
                    "id_cliente": item.id_cliente,
                    "id_vendedor": item.id_vendedor,
                    "descuento": item.descuento
                }
            }
        })
        res.send(response);
    } else {
        res.status(404).send({mensaje: "Registro no encontrado"});
    }
});

// { "tabla" : { } }
// POST /ventaProducto - Crear una nueva tabla
ventaProductoRouter.post("/",
passport.authenticate("jwt", { session: false }),

body('ventaProducto.precio').isFloat({ min: 1, max: 2147483647 }),
body('ventaProducto.id_venta').isInt({ min: 1, max: 2147483647 }),
body('ventaProducto.id_libro').isInt({ min: 1, max: 2147483647 }),
body('ventaProducto.cantidad').isInt({ min: 1, max: 2147483647 }),

 async (req,res) =>{
    const ventaProducto = req.body.ventaProducto;
    const validacion= validationResult(req);
    if (!validacion.isEmpty()) {
        res.status(400).send({errors:validacion.errors})
        return
    }
    const [rows] = await db.execute(
      "INSERT INTO ventas_x_productos (id_venta, id_libro, cantidad,precio, fecha_modificacion, fecha_alta ) VALUES (:id_venta, :id_libro, :cantidad, :precio, NOW(), NOW())",
      { id_venta: ventaProducto.id_venta, id_libro: ventaProducto.id_libro, cantidad: ventaProducto.cantidad, precio: ventaProducto.precio}
    );
    res.status(201).send({ ...ventaProducto, id: rows.insertId });
});

// PUT /ventaProducto/:id - Modificar una tabla por id
// ventaProductoRouter.put("/:id", async (req, res) => {
//     const id = req.params.id;
//     const ventaProducto = req.body.ventaProducto;
//     await db.execute(
//       "UPDATE ventaProducto SET  id_libro=: id_libro, cantidad=:cantidad, precio=:precio,fecha_modificacion=NOW() WHERE id_venta=:id",
//       { id_libro: ventaProducto.id_libro, cantidad: ventaProducto.cantidad, precio: ventaProducto.precio}
//       );
//     res.send("ok");
// });

// DELETE /ventaProducto/:id - Quitar una tabla por id
// ventaProductoRouter.delete("/:id", async (req, res) => {
//     const id = req.params.id;
//     await db.execute("DELETE FROM ventaProducto WHERE id_libro=:id", { id });
//     res.send("Se ha borrado el registro.");
// });

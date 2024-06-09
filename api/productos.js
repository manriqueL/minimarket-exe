import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const productosRouter = express.Router();

const generarWhere=(id)=>{
  if (id!=null) {
      return "WHERE id_producto=:id";
  }
  return "";
}

// GET /productos - Obtener todas las productos
productosRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const [rows, fields] = await db.execute("SELECT * FROM productos");
      res.send(rows);
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).send("Error al consultar la base de datos");
    }
  }
);

// GET - BUSCAR PRODUCTOS POR ID ---
productosRouter.get("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const id = req.params.id;
    const [rows,fields] = await db.execute(`SELECT * FROM productos ${generarWhere(id)}` , {id});
    if (rows.length > 0){
        res.send(rows[0]);
    } else {
        res.status(404).send({mensaje: "El producto no existe"});
    }
});


// { "tabla" : { }}
// POST /productos - Crear una nueva tabla
productosRouter.post("/", 
passport.authenticate("jwt", { session: false }),
  body("id_categoria").isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero mayor que 0'),
  body("id_proveedor").isInt({ min: 1 }).withMessage('El ID del proveedor debe ser un número entero mayor que 0'),
  body("nombre").isString().withMessage('El nombre solo puede contener letras, números y espacios').isLength({ min: 1, max: 45 }).withMessage('El nombre debe tener entre 1 y 45 caracteres'),
  body("fecha_vencimiento").isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO 8601'),
  body("codigo").isInt({ min: 1 }).withMessage('El código debe ser un número entero mayor que 0').isLength({ min: 1, max: 45 }).withMessage('El código debe tener entre 1 y 45 caracteres'),
  body("precio").isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo mayor o igual a 0'),

async (req,res) =>{
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }
    const producto = req.body;
    const [rows] = await db.execute(
      "INSERT INTO productos (id_categoria, id_proveedor, nombre, fecha_vencimiento, codigo, precio) VALUES (:id_categoria, :id_proveedor, :nombre, :fecha_vencimiento, :codigo, :precio)",
      {
        id_categoria: producto.id_categoria,
        id_proveedor: producto.id_proveedor,
        nombre: producto.nombre,
        fecha_vencimiento: producto.fecha_vencimiento,
        codigo: producto.codigo,          
        precio: producto.precio,
      }
    );
    res.status(201).send({ ...producto, id_producto: rows.insertId });
});
    

// PUT /productos/:id - Modificar una tabla por id
productosRouter.put("/:id", 
  passport.authenticate("jwt", { session: false }),
  body("id_categoria").isInt({ min: 1 }).withMessage('El ID de categoría debe ser un número entero mayor que 0'),
  body("id_proveedor").isInt({ min: 1 }).withMessage('El ID del proveedor debe ser un número entero mayor que 0'),
  body("nombre").isString().withMessage('El nombre solo puede contener letras, números y espacios').isLength({ min: 1, max: 45 }).withMessage('El nombre debe tener entre 1 y 45 caracteres'),
  body("fecha_vencimiento").isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO 8601'),
  body("codigo").isInt({ min: 1 }).withMessage('El código debe ser un número entero mayor que 0').isLength({ min: 1, max: 45 }).withMessage('El código debe tener entre 1 y 45 caracteres'),
  body("precio").isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo mayor o igual a 0'),

  async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }

    const idProducto = req.params.id;
    const producto = req.body;
    const [rows] = await db.execute(
      "UPDATE productos SET id_categoria = :id_categoria, id_proveedor = :id_proveedor, nombre = :nombre, fecha_vencimiento = :fecha_vencimiento, codigo = :codigo, precio = :precio WHERE id_producto = :id_producto",
      {
        id_categoria: producto.id_categoria,
        id_proveedor: producto.id_proveedor,
        nombre: producto.nombre,
        fecha_vencimiento: producto.fecha_vencimiento,
        codigo: producto.codigo,          
        precio: producto.precio,
        id_producto: idProducto
      }
    );

    if (rows.affectedRows === 0) {
      // Si no se actualiza ninguna fila, significa que el producto no existe
      res.status(404).send({ error: 'El producto no existe.' });
      return;
    }

    res.status(200).send({ message: 'Producto actualizado correctamente.' });
});




// DELETE /productos/:id - Quitar una tabla por id
productosRouter.delete("/:id", 
passport.authenticate("jwt", { session: false }),
param("id").isInt({min: 1, max: 2147483647}),
    async (req, res) => {
    const validacion = validationResult(req)
    if (!validacion.isEmpty()) {
        res.status(400).send({errors: validacion.errors})
        return;
    }    
    const {id} = req.params;
    await db.execute(`DELETE FROM productos ${generarWhere(id)}` , { id });
    res.send("Se ha borrado el producto.");
});

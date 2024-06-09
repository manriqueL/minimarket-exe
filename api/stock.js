import express from "express";
import { db } from "./db.js";
import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const stockRouter = express.Router();

const generarWhere = (id) => {
  if (id != null) {
    return "WHERE id_stock= :id";
  }
  return "";
};

stockRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const [rows, fields] = await db.execute("SELECT * FROM stock");
      res.send(rows);
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
      res.status(500).send("Error al consultar la base de datos");
    }
  }
);

stockRouter.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  param("id").isInt({ min: 1, max: 2147483647 }),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.errors });
      return;
    }
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      `SELECT * FROM stock ${generarWhere(id)}`,
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "El producto no existe" });
    }
  }
);

stockRouter.post(
  "/productos/:id",
  passport.authenticate("jwt", { session: false }),
  body("cantidad").isInt({ min: 1, max: 2147483647 }),
  body("id_producto").isInt({ min: 1, max: 2147483647 }),
  
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }

    const cantidad = req.body;
    const idProducto = req.params.id;

    const [rows] = await db.execute(
      "INSERT INTO stock (cantidad, id_producto) VALUES (:cantidad, :id_producto)",
      { cantidad, idProducto }
    );

    res.status(201).send({ cantidad, idProducto, id_stock: rows.insertId });
  }
);

stockRouter.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  param("id").isInt({ min: 1, max: 2147483647 }),
  body("cantidad").isInt({ min: 1, max: 2147483647 }),
  body("id_producto")
    .isInt({ min: 1 })
    .withMessage("El ID del producto debe ser un número entero mayor que 0"),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      return res.status(400).send({ errors: validacion.array() });
    }

    const idStock = req.params.id;
    const stock = req.body;
    const [rows] = await db.execute(
      "UPDATE stock SET id_producto = :id_producto, cantidad = :cantidad WHERE id_stock = :id_stock",
      {
        id_producto: stock.id_producto,
        cantidad: stock.cantidad,
        id_stock: idStock
      }
    );
    if (rows.affectedRows === 0) {
      // Si no se actualiza ninguna fila, significa que el stock no existe
      res.status(404).send({ error: "El producto no existe." });
      return;
    }

    res.status(200).send({ message: "Producto actualizado correctamente." });
  }
);

stockRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  param("id").isInt({ min: 1, max: 2147483647 }),
  async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.errors });
      return;
    }
    const { id } = req.params;
    await db.execute(`DELETE FROM stock ${generarWhere(id)}`, { id });
    res.send("Se ha borrado el registro.");
  }
);

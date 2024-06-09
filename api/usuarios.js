import express from "express";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { body, query, param, validationResult } from "express-validator";

export const usuariosRouter = express
  .Router()

  .post(
    "/",
    body("username").isAlphanumeric().isLength({ min: 1, max: 25 }),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    body("id_rol").isAlphanumeric().isLength({ min: 1, max: 25 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { username, password, id_rol, personaId } = req.body;

      // Verificar si ya existe un username con el mismo nombre
      const [existingUser] = await db.execute(
        "SELECT * FROM usuarios WHERE username = :username",
        { username }
      );

      if (existingUser.length > 0) {
        res.status(400).send({ mensaje: "Ya existe un usuario con ese nombre" });
        return;
      }

      const passwordHashed = await bcrypt.hash(password, 8);
      const [rows] = await db.execute(
        "INSERT INTO usuarios (username, password, id_rol) VALUES (:username, :password, :id_rol)",
        { username, password: passwordHashed, id_rol }
      );

      res.status(201).send({ id: rows.insertId, username, id_rol });
    }
  )
  .put(
    "/:id",
    param("id").isInt({ min: 1 }),
    body("username").isAlphanumeric().isLength({ min: 1, max: 25 }).optional(),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }).optional(),
    body("id_rol").isAlphanumeric().isLength({ min: 1, max: 25 }).optional(),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { id } = req.params;
      const { username, password, id_rol } = req.body;

      // Obtener el usuarios existente
      const [rows] = await db.execute(
        "SELECT * FROM usuarios WHERE id = :id",
        { id }
      );

      if (rows.length === 0) {
        res.status(404).send({ mensaje: "usuario no encontrado" });
        return;
      }

      // Modificar los valores proporcionados (si existen)
      const usuarioActualizado = username || rows[0].username;
      const passwordActualizado = password
        ? await bcrypt.hash(password, 8)
        : rows[0].password;
      const rolActualizado = id_rol || rows[0].id_rol;

      // Actualizar el usuarios en la base de datos
      await db.execute(
        "UPDATE usuarios SET username = :username, password = :password, id_rol = :id_rol WHERE id = :id",
        { id, username: usuarioActualizado, password: passwordActualizado, id_rol: rolActualizado }
      );

      res.send({ mensaje: "usuario actualizado correctamente" });
    }
  )
  .get(
    "/filtro/",
    query("username").isLength({ min: 2, max: 50 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      try {
        let query =
          "SELECT id, username FROM usuarios WHERE 1=1";
        const conditions = [];
        const params = [];

        // Ejemplo de búsqueda por username
        if (req.query.username) {
          conditions.push("username = ?");
          params.push(req.query.username);
        }

        if (conditions.length > 0) {
          query += ` AND ${conditions.join(" AND ")}`;
        }

        const [rows, fields] = await db.execute(query, params);
        res.send(rows);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).send({ mensaje: "Error interno del servidor" });
      }
    }
  )
  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute(
      "SELECT id, username, id_rol FROM usuarios"
    );
    res.send(rows);
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT id, username, id_rol FROM usuarios WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "usuarios no encontrado" });
    }
  })
  .delete("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
    const { id } = req.params;
    await db.execute("DELETE FROM usuarios WHERE id = :id", { id });
    res.send("ok");
  });

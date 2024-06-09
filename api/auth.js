import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { db } from "./db.js";

export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      const [rows, fields] = await db.execute(
        "SELECT username FROM usuarios WHERE username = :username",
        { username: payload.username }
      );
      if (rows.length > 0) {
        next(null, rows[0]);
      } else {
        next(null, false);
      }
    })
  );
}

export const authRouter = express
  .Router()

  .post(
    "/login",
    body("username").isAlphanumeric().isLength({ min: 1, max: 25 }),
    body("password").isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { username, password } = req.body;

      // Obtengo cuenta de username
      const [rows, fields] = await db.execute(
        `SELECT  r.id_rol, r.nombre, u.username, u.password FROM usuarios AS u 
         INNER JOIN roles AS r ON u.id_rol = r.id_rol
         WHERE u.username = :username`, { username }
      );
      if (rows.length === 0) {
        res.status(400).send({error:"Username o contraseña inválida"});
        return;
      }

      // Verificar contraseña
      const passwordCompared = await bcrypt.compare(password, rows[0].password);
      if (!passwordCompared) {
        res.status(400).send({error:"Username o contraseña inválida"});
        return;
      }

      // Generar token
      const payload = { username, id_persona: rows[0].id_persona, id_rol: rows[0].id_rol, rol: rows[0].nombre };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {});
      res.send({ username, token });
    }
  )

  .get(
    "/perfil",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.json(req.user);
    }
  );

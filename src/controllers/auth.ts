import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

// Asegurarse de que el secreto de JWT esté cargado
if (!process.env.JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida.');
}
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  const { nombre_usuario, email, password, rol } = req.body;

  if (!nombre_usuario || !email || !password || !rol) {
    return res.status(400).json({ error: 'nombre_usuario, email, password y rol son requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO public.usuarios (nombre_usuario, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre_usuario, email, rol',
      [nombre_usuario, email, hashedPassword, rol]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  try {
    const user = await pool.query('SELECT * FROM public.usuarios WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id_usuario: user.rows[0].id_usuario, rol: user.rows[0].rol }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error durante el login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await pool.query('SELECT id_usuario, nombre_usuario, email, rol, fecha_registro FROM public.usuarios WHERE id_usuario = $1', [req.user.id_usuario]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

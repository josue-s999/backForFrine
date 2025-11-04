import { Request, Response } from 'express';
import pool from '../db';

interface CustomRequest extends Request {
  user?: {
    id_usuario: number;
    rol: string;
  };
}

// Crear un nuevo Pin
export const createPin = async (req: CustomRequest, res: Response) => {
  const { titulo, descripcion, tipo_pin, lat, lng } = req.body;
  const id_usuario_creador = req.user?.id_usuario;

  if (!titulo || !tipo_pin || !lat || !lng) {
    return res.status(400).json({ error: 'Título, tipo de pin, latitud y longitud son requeridos' });
  }

  if (!id_usuario_creador) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    // Usar ST_SetSRID y ST_MakePoint para crear la geometría
    const query = `
      INSERT INTO public.pines_negocio (id_usuario_creador, tipo_pin, titulo, descripcion, geom)
      VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))
      RETURNING *;
    `;
    const values = [id_usuario_creador, tipo_pin, titulo, descripcion, lng, lat];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el pin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Listar todos los Pines activos
export const getPines = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT *, ST_AsGeoJSON(geom) as geojson FROM public.pines_negocio WHERE activo = true');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar los pines:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener un Pin por su ID, incluyendo el perfil
export const getPinById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        p.*, 
        ST_AsGeoJSON(p.geom) as geojson,
        pp.es_ti, 
        pp.datos_especificos_json
      FROM public.pines_negocio p
      LEFT JOIN public.perfiles_pin pp ON p.id_pin = pp.id_pin
      WHERE p.id_pin = $1 AND p.activo = true;
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pin no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el pin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un Pin
export const updatePin = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;
  const id_usuario_actual = req.user?.id_usuario;

  try {
    const pinResult = await pool.query('SELECT id_usuario_creador FROM public.pines_negocio WHERE id_pin = $1', [id]);

    if (pinResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pin no encontrado' });
    }

    if (pinResult.rows[0].id_usuario_creador !== id_usuario_actual) {
      return res.status(403).json({ error: 'No tiene permiso para actualizar este pin' });
    }

    const query = `
      UPDATE public.pines_negocio
      SET titulo = $1, descripcion = $2
      WHERE id_pin = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [titulo, descripcion, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el pin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Desactivar un Pin (Soft Delete)
export const deletePin = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const id_usuario_actual = req.user?.id_usuario;
  const rol_usuario = req.user?.rol;

  try {
    const pinResult = await pool.query('SELECT id_usuario_creador FROM public.pines_negocio WHERE id_pin = $1', [id]);

    if (pinResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pin no encontrado' });
    }

    // Permitir al creador o a un admin desactivar el pin
    if (pinResult.rows[0].id_usuario_creador !== id_usuario_actual && rol_usuario !== 'admin') {
      return res.status(403).json({ error: 'No tiene permiso para desactivar este pin' });
    }

    const query = 'UPDATE public.pines_negocio SET activo = false WHERE id_pin = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    res.json({ message: 'Pin desactivado correctamente', pin: result.rows[0] });
  } catch (error) {
    console.error('Error al desactivar el pin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

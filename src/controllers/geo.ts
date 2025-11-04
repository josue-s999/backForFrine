import { Request, Response } from 'express';
import pool from '../db';

// Obtener todas las comunas en formato GeoJSON
export const getComunas = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT gid, comuna, nombre, ST_AsGeoJSON(geom) as geojson FROM public.comunas';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las comunas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Consultar a qué barrio y comuna pertenece un punto (lat, lng)
export const queryArea = async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Latitud y longitud inválidas' });
  }

  try {
    const point = `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`;

    const comunaQuery = `
      SELECT nombre, comuna
      FROM public.comunas
      WHERE ST_Contains(geom, ${point});
    `;

    const barrioQuery = `
      SELECT barrio
      FROM public.barrios
      WHERE ST_Contains(geom, ${point});
    `;

    const [comunaResult, barrioResult] = await Promise.all([
      pool.query(comunaQuery),
      pool.query(barrioQuery)
    ]);

    const comuna = comunaResult.rows[0] || null;
    const barrio = barrioResult.rows[0] || null;

    res.json({ comuna, barrio });
  } catch (error) {
    console.error('Error en la consulta de área:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

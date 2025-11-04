import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Asegurarse de que el secreto de JWT esté cargado
if (!process.env.JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida.');
}
const JWT_SECRET = process.env.JWT_SECRET;

// Extender el tipo Request para incluir la propiedad user
interface CustomRequest extends Request {
  user?: any;
}

export const protect = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado, no hay token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token usando el secreto de las variables de entorno
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Adjuntar el payload decodificado (que incluye id_usuario y rol) al objeto de solicitud
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('La verificación del token falló:', error);
    res.status(401).json({ error: 'No autorizado, el token falló' });
  }
};

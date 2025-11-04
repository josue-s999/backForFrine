"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Asegurarse de que el secreto de JWT esté cargado
if (!process.env.JWT_SECRET) {
    throw new Error('La variable de entorno JWT_SECRET no está definida.');
}
var JWT_SECRET = process.env.JWT_SECRET;
var protect = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado, no hay token' });
    }
    var token = authHeader.split(' ')[1];
    try {
        // Verificar el token usando el secreto de las variables de entorno
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Adjuntar el payload decodificado (que incluye id_usuario y rol) al objeto de solicitud
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('La verificación del token falló:', error);
        res.status(401).json({ error: 'No autorizado, el token falló' });
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.js.map
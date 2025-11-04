"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePin = exports.updatePin = exports.getPinById = exports.getPines = exports.createPin = void 0;
var db_1 = __importDefault(require("../db"));
// Crear un nuevo Pin
var createPin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, titulo, descripcion, tipo_pin, lat, lng, id_usuario_creador, query, values, result, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, titulo = _a.titulo, descripcion = _a.descripcion, tipo_pin = _a.tipo_pin, lat = _a.lat, lng = _a.lng;
                id_usuario_creador = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id_usuario;
                if (!titulo || !tipo_pin || !lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'Título, tipo de pin, latitud y longitud son requeridos' })];
                }
                if (!id_usuario_creador) {
                    return [2 /*return*/, res.status(401).json({ error: 'No autorizado' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                query = "\n      INSERT INTO public.pines_negocio (id_usuario_creador, tipo_pin, titulo, descripcion, geom)\n      VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326))\n      RETURNING *;\n    ";
                values = [id_usuario_creador, tipo_pin, titulo, descripcion, lng, lat];
                return [4 /*yield*/, db_1.default.query(query, values)];
            case 2:
                result = _c.sent();
                res.status(201).json(result.rows[0]);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.error('Error al crear el pin:', error_1);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createPin = createPin;
// Listar todos los Pines activos
var getPines = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.default.query('SELECT *, ST_AsGeoJSON(geom) as geojson FROM public.pines_negocio WHERE activo = true')];
            case 1:
                result = _a.sent();
                res.json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error al listar los pines:', error_2);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPines = getPines;
// Obtener un Pin por su ID, incluyendo el perfil
var getPinById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, query, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "\n      SELECT \n        p.*, \n        ST_AsGeoJSON(p.geom) as geojson,\n        pp.es_ti, \n        pp.datos_especificos_json\n      FROM public.pines_negocio p\n      LEFT JOIN public.perfiles_pin pp ON p.id_pin = pp.id_pin\n      WHERE p.id_pin = $1 AND p.activo = true;\n    ";
                return [4 /*yield*/, db_1.default.query(query, [id])];
            case 2:
                result = _a.sent();
                if (result.rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pin no encontrado' })];
                }
                res.json(result.rows[0]);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error al obtener el pin:', error_3);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getPinById = getPinById;
// Actualizar un Pin
var updatePin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, titulo, descripcion, id_usuario_actual, pinResult, query, result, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                _a = req.body, titulo = _a.titulo, descripcion = _a.descripcion;
                id_usuario_actual = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id_usuario;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.default.query('SELECT id_usuario_creador FROM public.pines_negocio WHERE id_pin = $1', [id])];
            case 2:
                pinResult = _c.sent();
                if (pinResult.rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pin no encontrado' })];
                }
                if (pinResult.rows[0].id_usuario_creador !== id_usuario_actual) {
                    return [2 /*return*/, res.status(403).json({ error: 'No tiene permiso para actualizar este pin' })];
                }
                query = "\n      UPDATE public.pines_negocio\n      SET titulo = $1, descripcion = $2\n      WHERE id_pin = $3\n      RETURNING *;\n    ";
                return [4 /*yield*/, db_1.default.query(query, [titulo, descripcion, id])];
            case 3:
                result = _c.sent();
                res.json(result.rows[0]);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _c.sent();
                console.error('Error al actualizar el pin:', error_4);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updatePin = updatePin;
// Desactivar un Pin (Soft Delete)
var deletePin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, id_usuario_actual, rol_usuario, pinResult, query, result, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                id_usuario_actual = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id_usuario;
                rol_usuario = (_b = req.user) === null || _b === void 0 ? void 0 : _b.rol;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.default.query('SELECT id_usuario_creador FROM public.pines_negocio WHERE id_pin = $1', [id])];
            case 2:
                pinResult = _c.sent();
                if (pinResult.rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pin no encontrado' })];
                }
                // Permitir al creador o a un admin desactivar el pin
                if (pinResult.rows[0].id_usuario_creador !== id_usuario_actual && rol_usuario !== 'admin') {
                    return [2 /*return*/, res.status(403).json({ error: 'No tiene permiso para desactivar este pin' })];
                }
                query = 'UPDATE public.pines_negocio SET activo = false WHERE id_pin = $1 RETURNING *';
                return [4 /*yield*/, db_1.default.query(query, [id])];
            case 3:
                result = _c.sent();
                res.json({ message: 'Pin desactivado correctamente', pin: result.rows[0] });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _c.sent();
                console.error('Error al desactivar el pin:', error_5);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deletePin = deletePin;
//# sourceMappingURL=pines.js.map
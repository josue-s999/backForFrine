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
exports.queryArea = exports.getComunas = void 0;
var db_1 = __importDefault(require("../db"));
// Obtener todas las comunas en formato GeoJSON
var getComunas = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = 'SELECT gid, comuna, nombre, ST_AsGeoJSON(geom) as geojson FROM public.comunas';
                return [4 /*yield*/, db_1.default.query(query)];
            case 1:
                result = _a.sent();
                res.json(result.rows);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error al obtener las comunas:', error_1);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getComunas = getComunas;
// Consultar a qué barrio y comuna pertenece un punto (lat, lng)
var queryArea = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, latitude, longitude, point, comunaQuery, barrioQuery, _b, comunaResult, barrioResult, comuna, barrio, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, lat = _a.lat, lng = _a.lng;
                if (!lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'Latitud y longitud son requeridas' })];
                }
                latitude = parseFloat(lat);
                longitude = parseFloat(lng);
                if (isNaN(latitude) || isNaN(longitude)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Latitud y longitud inválidas' })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                point = "ST_SetSRID(ST_MakePoint(".concat(longitude, ", ").concat(latitude, "), 4326)");
                comunaQuery = "\n      SELECT nombre, comuna\n      FROM public.comunas\n      WHERE ST_Contains(geom, ".concat(point, ");\n    ");
                barrioQuery = "\n      SELECT barrio\n      FROM public.barrios\n      WHERE ST_Contains(geom, ".concat(point, ");\n    ");
                return [4 /*yield*/, Promise.all([
                        db_1.default.query(comunaQuery),
                        db_1.default.query(barrioQuery)
                    ])];
            case 2:
                _b = _c.sent(), comunaResult = _b[0], barrioResult = _b[1];
                comuna = comunaResult.rows[0] || null;
                barrio = barrioResult.rows[0] || null;
                res.json({ comuna: comuna, barrio: barrio });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _c.sent();
                console.error('Error en la consulta de área:', error_2);
                res.status(500).json({ error: 'Error interno del servidor' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.queryArea = queryArea;
//# sourceMappingURL=geo.js.map
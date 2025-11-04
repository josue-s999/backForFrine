"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var geo_1 = require("../controllers/geo");
var router = (0, express_1.Router)();
router.get('/comunas', geo_1.getComunas);
router.get('/query_area', geo_1.queryArea);
exports.default = router;
//# sourceMappingURL=geo.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var pines_1 = require("../controllers/pines");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.use(auth_1.protect);
router.route('/')
    .post(pines_1.createPin)
    .get(pines_1.getPines);
router.route('/:id')
    .get(pines_1.getPinById)
    .put(pines_1.updatePin)
    .delete(pines_1.deletePin);
exports.default = router;
//# sourceMappingURL=pines.js.map
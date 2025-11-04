"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var auth_2 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.post('/register', auth_1.register);
router.post('/login', auth_1.login);
router.get('/users/me', auth_2.protect, auth_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.js.map
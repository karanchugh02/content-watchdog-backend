"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.use('/organization', require('./organization'));
router.use('/home', require('./home'));
router.use('/analysis', require('./analysis'));
module.exports = router;
//# sourceMappingURL=routes.js.map
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../../../lib/prisma"));
const auth_1 = __importDefault(require("../../utils/auth"));
const orgRouter = express_1.default.Router();
orgRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, password } = req.body;
        let hashedPassword = yield auth_1.default.hashPassword(password);
        let newOrganization = yield prisma_1.default.organization.create({
            data: {
                email: email,
                name,
                password: hashedPassword,
            },
        });
        console.log('new organization is ', newOrganization);
        return res.send({ status: true });
    }
    catch (e) {
        console.log('error in sign up user ', e);
        if (e.code == 'P2002') {
            return res.send({ status: false, message: 'User Already Exists' });
        }
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        let verifyResult = yield auth_1.default.verifyLogin(email, password);
        return res.send(verifyResult);
    }
    catch (e) {
        console.log('error in login ', e);
        return res.send({ status: false, message: e.message });
    }
}));
module.exports = orgRouter;
//# sourceMappingURL=index.js.map
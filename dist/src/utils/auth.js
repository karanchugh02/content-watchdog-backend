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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const constants_1 = require("../../constants");
const moment_1 = __importDefault(require("moment"));
class AuthHandler {
    static hashPassword(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let saltRounds = 10;
            let salt = yield bcryptjs_1.default.genSalt(saltRounds);
            let hashedPassword = yield bcryptjs_1.default.hash(plainPassword, salt);
            return hashedPassword;
        });
    }
    static verifyLogin(email, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let orgData = yield prisma_1.default.organization.findUnique({
                where: { email: email },
            });
            if (!orgData) {
                return { status: false, message: 'Org Not Found!!' };
            }
            if (yield bcryptjs_1.default.compare(plainPassword, orgData.password)) {
                let tokenPayload = { orgId: orgData.id, email: orgData.email };
                let token = jsonwebtoken_1.default.sign(tokenPayload, constants_1.env.JWT_SECRET, {
                    expiresIn: '24h',
                });
                console.log('time', (0, moment_1.default)().utcOffset('+0530').add(4, 'hours').toDate());
                return {
                    status: true,
                    data: {
                        token,
                        email: orgData.email,
                        name: orgData.name,
                        id: orgData.id,
                        expirationTime: (0, moment_1.default)().utcOffset('+0530').add(4, 'hours').toDate(),
                    },
                };
            }
            else {
                return { status: false, message: 'Wrong Credentials!!' };
            }
        });
    }
    static verifyUserMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let authToken = req.headers.authorization;
            if (!authToken) {
                return res.send({ status: false, message: 'User Not Authenticated' });
            }
            let result = jsonwebtoken_1.default.verify(authToken, constants_1.env.JWT_SECRET);
            console.log('result is ', result);
            if (result) {
                // req.user = next();
                req.user = {
                    id: result.orgId,
                };
                next();
            }
            else {
                return res.send({ status: false, message: 'Token Invalid' });
            }
        });
    }
    static apiServiceMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('req headers ', req.headers);
            let accessKey = req.headers['access-key'];
            let accessSecret = req.headers['access-secret'];
            if (accessKey == undefined || accessSecret == undefined) {
                return res.send({
                    status: false,
                    message: 'Please pass access credentials',
                });
            }
            console.log('in request ', accessKey, accessSecret);
            let checkKey = yield prisma_1.default.apiKeys.findFirst({
                where: {
                    accessKey,
                    accessSecret,
                },
            });
            if (checkKey) {
                req.org = { id: checkKey.organizationId };
                next();
            }
            else {
                return res.send({ status: false, message: 'Not Authorized' });
            }
        });
    }
}
exports.default = AuthHandler;
//# sourceMappingURL=auth.js.map
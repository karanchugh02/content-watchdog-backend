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
const analysisRouter = express_1.default.Router();
analysisRouter.get('/get-photo-data', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let photosData = yield prisma_1.default.imageAnalysisRecord.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data: photosData });
    }
    catch (e) {
        console.log('error in getting ohoto data ', e);
        return res.send({ status: false, message: e.message });
    }
}));
analysisRouter.get('/get-video-data', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let photosData = yield prisma_1.default.videoAnalysisRecord.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data: photosData });
    }
    catch (e) {
        console.log('error in getting ohoto data ', e);
        return res.send({ status: false, message: e.message });
    }
}));
analysisRouter.get('/get-text-data', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let photosData = yield prisma_1.default.textAnalysisRecord.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data: photosData });
    }
    catch (e) {
        console.log('error in getting ohoto data ', e);
        return res.send({ status: false, message: e.message });
    }
}));
module.exports = analysisRouter;
//# sourceMappingURL=index.js.map
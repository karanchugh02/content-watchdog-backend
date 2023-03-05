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
const aws_1 = __importDefault(require("../../utils/aws"));
const uuid_1 = require("uuid");
const analysisRouter = express_1.default.Router();
analysisRouter.post('/scan-image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { imageUrl } = req.body;
        let key = (0, uuid_1.v4)();
        let s3Data = yield aws_1.default.uploadToS3(imageUrl, `${key}.jpg`);
        let imageAnalysis = yield aws_1.default.imageScanner(`${key}.jpg`);
        if (imageAnalysis.status == true) {
            return res.send({ status: true, results: imageAnalysis.data });
        }
        else {
            return res.send({ status: false, message: imageAnalysis.message });
        }
    }
    catch (e) {
        console.log('error in scanning image ', e);
        return res.send({ status: false, message: e.message });
    }
}));
module.exports = analysisRouter;
//# sourceMappingURL=index.js.map
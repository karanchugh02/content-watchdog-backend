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
const serviceRouter = express_1.default.Router();
const uuid_1 = require("uuid");
const aws_1 = __importDefault(require("../../utils/aws"));
const openai_1 = __importDefault(require("../../utils/openai"));
const utils_1 = __importDefault(require("../analysis/utils"));
serviceRouter.post('/scan-image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { imageUrl } = req.body;
        let key = (0, uuid_1.v4)();
        let s3Data = yield aws_1.default.uploadToS3(imageUrl, `images/${key}.jpg`);
        console.log('s3 data is ', s3Data);
        let imageAnalysis = yield aws_1.default.imageScanner(`images/${key}.jpg`);
        if (imageAnalysis.status == true) {
            utils_1.default.imageLogCreator({
                key: `images/${key}.jpg`,
                results: imageAnalysis.data,
                orgId: req.org.id,
                s3Url: `https://contentwatchdog.s3.ap-south-1.amazonaws.com/images/${key}.jpg`,
            });
            console.log('images are ', imageAnalysis.data);
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
serviceRouter.post('/scan-video', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { videoUrl } = req.body;
        let key = `videos/${(0, uuid_1.v4)()}`;
        let videoData = yield aws_1.default.uploadToS3(videoUrl, key);
        let videoAnalysis = yield aws_1.default.videoScanner(key);
        console.log('video analysis ', videoAnalysis);
        if (videoAnalysis.status == true) {
            utils_1.default.videoLogCreator({
                key,
                JobId: videoAnalysis.data.JobId,
                orgId: req.org.id,
                s3Url: `https://contentwatchdog.s3.ap-south-1.amazonaws.com/${key}`,
            });
            return res.send({ status: true, data: videoAnalysis.data });
        }
        else {
            return res.send({ status: false, message: videoAnalysis.message });
        }
    }
    catch (e) {
        return res.send({ status: false, message: e.message });
    }
}));
serviceRouter.get('/get-video-status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { jobId } = req.query;
        let analysisData = yield aws_1.default.videoStatusFetcher(jobId.toString());
        if (analysisData.status == true) {
            utils_1.default.videoLogUpdater(jobId.toString(), analysisData.data.JobStatus, {
                results: analysisData.data.ModerationLabels,
                videoInfo: analysisData.data.VideoMetadata,
            });
            return res.send({ status: true, data: analysisData.data });
        }
        else {
            return res.send({ status: false, message: analysisData.message });
        }
    }
    catch (e) {
        return res.send({ status: false, message: e.message });
    }
}));
serviceRouter.post('/scan-text', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req.org ', req.org);
        let { text } = req.body;
        let textData = yield openai_1.default.textScanner(text);
        utils_1.default.textLogCreater(text, textData.results, req.org.id);
        return res.send({ status: true, data: textData });
    }
    catch (e) {
        console.log('error ', e);
        return res.send({ status: false, message: e.message });
    }
}));
module.exports = serviceRouter;
//# sourceMappingURL=index.js.map
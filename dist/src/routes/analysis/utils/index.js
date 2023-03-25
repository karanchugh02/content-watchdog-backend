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
const prisma_1 = __importDefault(require("../../../../lib/prisma"));
class AnalysisUtils {
    static imageLogCreator({ key, results, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let newLogs = yield prisma_1.default.imageAnalysisRecord.create({
                data: {
                    s3Key: key,
                    results,
                    organization: {
                        connect: {
                            id: 1, //todo add org id after auth
                        },
                    },
                },
            });
            console.log('new logs are ', newLogs);
            return;
        });
    }
    static videoLogCreator({ key, JobId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let newLogs = yield prisma_1.default.videoAnalysisRecord.create({
                data: {
                    s3Key: key,
                    jobId: JobId,
                    status: 'PROCESSING',
                    organization: {
                        connect: {
                            id: 1, //todo add org id after auth
                        },
                    },
                },
            });
            console.log('new logs are ', newLogs);
            return;
        });
    }
    static videoLogUpdater(JobId, status, results) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedLog = yield prisma_1.default.videoAnalysisRecord.update({
                where: { jobId: JobId },
                data: {
                    status: status,
                    results: results,
                },
            });
            console.log('updated video log is ', updatedLog);
            return;
        });
    }
    static textLogCreater(text, results) {
        return __awaiter(this, void 0, void 0, function* () {
            let newLog = yield prisma_1.default.textAnalysisRecord.create({
                data: {
                    text,
                    results,
                    organization: {
                        connect: {
                            id: 1,
                        },
                    },
                },
            });
            console.log('new text log is ', newLog);
            return;
        });
    }
}
exports.default = AnalysisUtils;
//# sourceMappingURL=index.js.map
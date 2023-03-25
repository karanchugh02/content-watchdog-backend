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
    static logCreator({ contentType, key, status, results, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let newLogs = yield prisma_1.default.analysisRecord.create({
                data: {
                    contentType: contentType,
                    s3Key: key,
                    status,
                    results,
                    organization: {
                        connect: {
                            id: 1, //todo add org id after auth
                        },
                    },
                },
            });
            return;
        });
    }
}
exports.default = AnalysisUtils;
//# sourceMappingURL=index.js.map
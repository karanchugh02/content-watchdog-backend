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
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../constants");
class OpenAi {
    static textScanner(text) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield axios_1.default.post(`https://api.openai.com/v1/moderations`, { input: text }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${constants_1.env.OPENAI_API_KEY}`,
                },
            });
            return response.data;
        });
    }
}
exports.default = OpenAi;
//# sourceMappingURL=openai.js.map
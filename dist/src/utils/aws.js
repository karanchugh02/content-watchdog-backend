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
const client_rekognition_1 = require("@aws-sdk/client-rekognition");
const client_rekognition_2 = require("@aws-sdk/client-rekognition");
const constants_1 = require("../../constants");
const request_1 = __importDefault(require("request"));
const client_s3_1 = require("@aws-sdk/client-s3");
const REGION = 'ap-south-1'; //e.g. "us-east-1"
// Create SNS service object.
const rekogClient = new client_rekognition_2.RekognitionClient({
    region: REGION,
    credentials: {
        accessKeyId: constants_1.env.S3_UPLOAD_KEY,
        secretAccessKey: constants_1.env.S3_UPLOAD_SECRET,
    },
});
const s3 = new client_s3_1.S3({
    region: REGION,
    credentials: {
        accessKeyId: constants_1.env.S3_UPLOAD_KEY,
        secretAccessKey: constants_1.env.S3_UPLOAD_SECRET,
    },
});
class Aws {
    static imageScanner(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    Image: {
                        S3Object: {
                            Bucket: constants_1.env.BUCKET,
                            Name: key,
                        },
                    },
                };
                const response = yield rekogClient.send(new client_rekognition_1.DetectModerationLabelsCommand(params));
                return { status: true, data: response.ModerationLabels }; // For unit tests.
            }
            catch (err) {
                console.log('Error', err);
                return { status: false, message: err.message };
            }
        });
    }
    static uploadToS3(imageUrl, key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, request_1.default)({
                    url: imageUrl,
                    encoding: null,
                }, function (err, res, body) {
                    if (err) {
                        console.log('error is ', err);
                        reject(err);
                    }
                    var objectParams = {
                        ContentType: res.headers['content-type'],
                        ContentLength: res.headers['content-length'],
                        Key: key,
                        Body: body,
                        Bucket: constants_1.env.BUCKET,
                    };
                    resolve(s3.putObject(objectParams));
                });
            });
        });
    }
}
exports.default = Aws;
//# sourceMappingURL=aws.js.map
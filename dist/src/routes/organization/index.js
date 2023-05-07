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
const shortid_1 = __importDefault(require("shortid"));
const razorpay_1 = __importDefault(require("razorpay"));
const constants_1 = require("../../../constants");
const orgRouter = express_1.default.Router();
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
const crypto_2 = require("crypto");
const key_id = constants_1.env.RAZORPAY_KEY;
const key_secret = constants_1.env.RAZORPAY_PASS;
const razorpay = new razorpay_1.default({
    key_id,
    key_secret,
});
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
orgRouter.post('/add-balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            amount: parseInt(req.body.amount) * 100,
            currency: 'INR',
            receipt: shortid_1.default.generate(),
            payment_capture: 1,
        };
        razorpay.orders.create(options, function (err, order) {
            if (err) {
                console.log(err);
                res.send({ status: false, message: err.error.description });
            }
            else {
                console.log(order);
                res.send({
                    status: true,
                    data: { order, amount: parseInt(req.body.amount) },
                });
            }
        });
    }
    catch (e) {
        console.log('error in adding balance ', e);
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.post('/verify-payment', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;
        const { data } = req.body;
        console.log(req.body);
        console.log('key is ', constants_1.env.RAZORPAY_KEY);
        let expectedSignature = crypto_1.default
            .createHmac('sha256', constants_1.env.RAZORPAY_PASS)
            .update(body.toString())
            .digest('hex');
        console.log('sig' + req.body.razorpay_signature);
        console.log('sig' + expectedSignature);
        let response = { status: 'failure' };
        if (expectedSignature === req.body.razorpay_signature) {
            response = { status: 'success' };
        }
        console.log('response is ', response);
        if (response.status == 'success') {
            //emptying user cart
            let currOrg = yield prisma_1.default.organization.findUnique({
                where: {
                    id: req.user.id,
                },
            });
            let [transaction, organization] = yield prisma_1.default.$transaction([
                prisma_1.default.transaction.create({
                    data: {
                        amount: req.body.amount,
                        finalBalance: currOrg.walletBalance + req.body.amount,
                        initialBalance: currOrg.walletBalance,
                        orderId: req.body.razorpay_order_id,
                        transactionId: req.body.razorpay_payment_id,
                        organization: {
                            connect: {
                                id: req.user.id,
                            },
                        },
                    },
                }),
                prisma_1.default.organization.update({
                    where: { id: req.user.id },
                    data: { walletBalance: { increment: req.body.amount } },
                }),
            ]);
            return res.status(200).json({ status: true, data: transaction });
        }
        else {
            return res
                .status(500)
                .json({ status: false, message: 'Payment Not Verified!!!' });
        }
    }
    catch (e) {
        console.log('error in verifying payment ', e);
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.get('/transactions', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let transactionData = yield prisma_1.default.transaction.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data: transactionData });
    }
    catch (e) {
        console.log('error in getting transactions data ', e);
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.get('/create-api-key', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newApiKey = yield prisma_1.default.apiKeys.create({
            data: {
                accessKey: (0, uuid_1.v4)(),
                accessSecret: (0, crypto_2.randomBytes)(64).toString('hex'),
                organization: {
                    connect: {
                        id: req.user.id,
                    },
                },
            },
        });
        return res.send({ status: true, data: newApiKey });
    }
    catch (e) {
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.get('/get-api-key', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newApiKey = yield prisma_1.default.apiKeys.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data: newApiKey });
    }
    catch (e) {
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.get('/get-image-data', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield prisma_1.default.imageAnalysisRecord.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data });
    }
    catch (e) {
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.get('/get-text-data', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield prisma_1.default.textAnalysisRecord.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data });
    }
    catch (e) {
        return res.send({ status: false, message: e.message });
    }
}));
orgRouter.get('/get-video-data', auth_1.default.verifyUserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield prisma_1.default.videoAnalysisRecord.findMany({
            where: {
                organizationId: req.user.id,
            },
        });
        return res.send({ status: true, data });
    }
    catch (e) {
        return res.send({ status: false, message: e.message });
    }
}));
module.exports = orgRouter;
//# sourceMappingURL=index.js.map
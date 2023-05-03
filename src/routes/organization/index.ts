import express from 'express';
import prisma from '../../../lib/prisma';
import AuthHandler from '../../utils/auth';
import shortid from 'shortid';
import Razorpay from 'razorpay';
import { env } from '../../../constants';
const orgRouter = express.Router();
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';

const key_id = env.RAZORPAY_KEY;
const key_secret = env.RAZORPAY_PASS;
const razorpay = new Razorpay({
  key_id,
  key_secret,
});

orgRouter.post('/signup', async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let hashedPassword = await AuthHandler.hashPassword(password);
    let newOrganization = await prisma.organization.create({
      data: {
        email: email,
        name,
        password: hashedPassword,
      },
    });
    console.log('new organization is ', newOrganization);

    return res.send({ status: true });
  } catch (e) {
    console.log('error in sign up user ', e);
    if (e.code == 'P2002') {
      return res.send({ status: false, message: 'User Already Exists' });
    }
    return res.send({ status: false, message: e.message });
  }
});

orgRouter.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    let verifyResult = await AuthHandler.verifyLogin(email, password);
    return res.send(verifyResult);
  } catch (e) {
    console.log('error in login ', e);
    return res.send({ status: false, message: e.message });
  }
});

orgRouter.post('/add-balance', async (req, res) => {
  try {
    const options = {
      amount: parseInt(req.body.amount) * 100, //todo add fixed amount
      currency: 'INR',
      receipt: shortid.generate(),
      payment_capture: 1,
    };
    razorpay.orders.create(options, function (err, order) {
      if (err) {
        console.log(err);
        res.send({ status: false, message: err.error.description });
      } else {
        console.log(order);
        res.send({
          status: true,
          data: { order, amount: parseInt(req.body.amount) },
        });
      }
    });
  } catch (e) {
    console.log('error in adding balance ', e);
    return res.send({ status: false, message: e.message });
  }
});

orgRouter.post(
  '/verify-payment',
  AuthHandler.verifyUserMiddleware,
  async (req: any, res) => {
    try {
      const body =
        req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id;
      const { data } = req.body;
      console.log(req.body);
      console.log('key is ', env.RAZORPAY_KEY);
      let expectedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_PASS)
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
        let currOrg = await prisma.organization.findUnique({
          where: {
            id: req.user.id,
          },
        });

        let [transaction, organization] = await prisma.$transaction([
          prisma.transaction.create({
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

          prisma.organization.update({
            where: { id: req.user.id },
            data: { walletBalance: { increment: req.body.amount } },
          }),
        ]);

        return res.status(200).json({ status: true, data: transaction });
      } else {
        return res
          .status(500)
          .json({ status: false, message: 'Payment Not Verified!!!' });
      }
    } catch (e) {
      console.log('error in verifying payment ', e);
      return res.send({ status: false, message: e.message });
    }
  }
);

orgRouter.get(
  '/transactions',
  AuthHandler.verifyUserMiddleware,
  async (req: any, res) => {
    try {
      let transactionData = await prisma.transaction.findMany({
        where: {
          organizationId: req.user.id,
        },
      });

      return res.send({ status: true, data: transactionData });
    } catch (e) {
      console.log('error in getting transactions data ', e);
      return res.send({ status: false, message: e.message });
    }
  }
);

orgRouter.get(
  '/create-api-key',
  AuthHandler.verifyUserMiddleware,
  async (req: any, res) => {
    try {
      let newApiKey = await prisma.apiKeys.create({
        data: {
          accessKey: uuidv4(),
          accessSecret: randomBytes(64).toString('hex'),
          organization: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });

      return res.send({ status: true, data: newApiKey });
    } catch (e) {
      return res.send({ status: false, message: e.message });
    }
  }
);

orgRouter.get(
  '/get-api-key',
  AuthHandler.verifyUserMiddleware,
  async (req: any, res) => {
    try {
      let newApiKey = await prisma.apiKeys.findMany({
        where: {
          organizationId: req.user.id,
        },
      });

      return res.send({ status: true, data: newApiKey });
    } catch (e) {
      return res.send({ status: false, message: e.message });
    }
  }
);

module.exports = orgRouter;

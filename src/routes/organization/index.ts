import express from 'express';
import prisma from '../../../lib/prisma';
import AuthHandler from '../../utils/auth';
const orgRouter = express.Router();

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

module.exports = orgRouter;

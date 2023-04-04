import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma';
import { env } from '../../constants';
import moment from 'moment';
class AuthHandler {
  public static async hashPassword(plainPassword: string) {
    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  }

  public static async verifyLogin(email: string, plainPassword: string) {
    let orgData = await prisma.organization.findUnique({
      where: { email: email },
    });

    if (!orgData) {
      return { status: false, message: 'Org Not Found!!' };
    }

    if (await bcrypt.compare(plainPassword, orgData.password)) {
      let tokenPayload = { orgId: orgData.id, email: orgData.email };
      let token = jwt.sign(tokenPayload, env.JWT_SECRET, {
        expiresIn: '4h',
      });
      console.log('time', moment().utcOffset('+0530').add(4, 'hours').toDate());
      return {
        status: true,
        data: {
          token,
          email: orgData.email,
          name: orgData.name,
          id: orgData.id,
          expirationTime: moment().utcOffset('+0530').add(4, 'hours').toDate(),
        },
      };
    } else {
      return { status: false, message: 'Wrong Credentials!!' };
    }
  }
}

export default AuthHandler;

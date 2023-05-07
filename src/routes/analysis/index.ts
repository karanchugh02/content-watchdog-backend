import express from 'express';
import prisma from '../../../lib/prisma';
import AuthHandler from '../../utils/auth';
const analysisRouter = express.Router();

analysisRouter.get(
  '/get-photo-data',
  AuthHandler.verifyUserMiddleware,
  async (req: any, res) => {
    try {
      let photosData = await prisma.imageAnalysisRecord.findMany({
        where: {
          organizationId: req.user.id,
        },
      });

      return res.send({ status: true, data: photosData });
    } catch (e) {
      console.log('error in getting ohoto data ', e);
      return res.send({ status: false, message: e.message });
    }
  }
);

analysisRouter.get(
  '/get-video-data',
  AuthHandler.verifyUserMiddleware,
  async (req: any, res) => {
    try {
      let photosData = await prisma.videoAnalysisRecord.findMany({
        where: {
          organizationId: req.user.id,
        },
      });

      return res.send({ status: true, data: photosData });
    } catch (e) {
      console.log('error in getting ohoto data ', e);
      return res.send({ status: false, message: e.message });
    }
  }
);

analysisRouter.get(
  '/get-text-data',
  AuthHandler.verifyUserMiddleware,
  async (req: any, res) => {
    try {
      let photosData = await prisma.textAnalysisRecord.findMany({
        where: {
          organizationId: req.user.id,
        },
      });

      return res.send({ status: true, data: photosData });
    } catch (e) {
      console.log('error in getting ohoto data ', e);
      return res.send({ status: false, message: e.message });
    }
  }
);

module.exports = analysisRouter;

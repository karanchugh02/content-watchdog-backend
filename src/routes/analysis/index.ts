import express from 'express';
import Aws from '../../utils/aws';
import { v4 as uuidv4 } from 'uuid';
import AnalysisUtils from './utils';
const analysisRouter = express.Router();

analysisRouter.post('/scan-image', async (req, res) => {
  try {
    let { imageUrl } = req.body;
    let key = uuidv4();
    let s3Data = await Aws.uploadToS3(imageUrl, `/images/${key}.jpg`);
    let imageAnalysis = await Aws.imageScanner(`/images/${key}.jpg`);
    if (imageAnalysis.status == true) {
      AnalysisUtils.logCreator({
        contentType: 'IMAGE',
        key: `/images/${key}.jpg`,
        results: imageAnalysis.data,
        status: 'PROCESSED',
      });
      return res.send({ status: true, results: imageAnalysis.data });
    } else {
      return res.send({ status: false, message: imageAnalysis.message });
    }
  } catch (e) {
    console.log('error in scanning image ', e);
    return res.send({ status: false, message: e.message });
  }
});

analysisRouter.post('/scan-video', async (req, res) => {
  try {
    let { videoUrl } = req.body;
    let key = `/videos/${uuidv4()}`;
    let videoData = await Aws.uploadToS3(videoUrl, key);
    let videoAnalysis = await Aws.videoScanner(key);
    console.log('video analysis ', videoAnalysis);
    if (videoAnalysis.status == true) {
      return res.send({ status: true, data: videoAnalysis.data });
    } else {
      return res.send({ status: false, message: videoAnalysis.message });
    }
  } catch (e) {
    return res.send({ status: false, message: e.message });
  }
});

module.exports = analysisRouter;

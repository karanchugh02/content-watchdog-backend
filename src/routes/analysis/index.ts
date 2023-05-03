import express from 'express';
import Aws from '../../utils/aws';
import { v4 as uuidv4 } from 'uuid';
import AnalysisUtils from './utils';
import OpenAi from '../../utils/openai';
const analysisRouter = express.Router();

analysisRouter.post('/scan-image', async (req, res) => {
  try {
    let { imageUrl } = req.body;
    let key = uuidv4();
    let s3Data = await Aws.uploadToS3(imageUrl, `/images/${key}.jpg`);
    let imageAnalysis = await Aws.imageScanner(`/images/${key}.jpg`);
    if (imageAnalysis.status == true) {
      AnalysisUtils.imageLogCreator({
        key: `/images/${key}.jpg`,
        results: imageAnalysis.data,
      });

      console.log('images are ', imageAnalysis.data);

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
      AnalysisUtils.videoLogCreator({ key, JobId: videoAnalysis.data.JobId });
      return res.send({ status: true, data: videoAnalysis.data });
    } else {
      return res.send({ status: false, message: videoAnalysis.message });
    }
  } catch (e) {
    return res.send({ status: false, message: e.message });
  }
});

analysisRouter.get('/get-video-status', async (req, res) => {
  try {
    let { jobId } = req.query;
    let analysisData = await Aws.videoStatusFetcher(jobId.toString());
    if (analysisData.status == true) {
      AnalysisUtils.videoLogUpdater(
        jobId.toString(),
        analysisData.data.JobStatus,
        {
          results: analysisData.data.ModerationLabels,
          videoInfo: analysisData.data.VideoMetadata,
        }
      );
      return res.send({ status: true, data: analysisData.data });
    } else {
      return res.send({ status: false, message: analysisData.message });
    }
  } catch (e) {
    return res.send({ status: false, message: e.message });
  }
});

analysisRouter.post('/scan-text', async (req, res) => {
  try {
    let { text } = req.body;
    let textData = await OpenAi.textScanner(text);
    AnalysisUtils.textLogCreater(text, textData.results);
    return res.send({ status: true, data: textData });
  } catch (e) {
    console.log('error ', e);
    return res.send({ status: false, message: e.message });
  }
});

module.exports = analysisRouter;

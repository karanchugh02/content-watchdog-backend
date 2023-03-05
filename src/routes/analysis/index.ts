import express from 'express';
import Aws from '../../utils/aws';
import { v4 as uuidv4 } from 'uuid';
const analysisRouter = express.Router();

analysisRouter.post('/scan-image', async (req, res) => {
  try {
    let { imageUrl } = req.body;
    let key = uuidv4();
    let s3Data = await Aws.uploadToS3(imageUrl, `${key}.jpg`);
    let imageAnalysis = await Aws.imageScanner(`${key}.jpg`);
    if (imageAnalysis.status == true) {
      return res.send({ status: true, results: imageAnalysis.data });
    } else {
      return res.send({ status: false, message: imageAnalysis.message });
    }
  } catch (e) {
    console.log('error in scanning image ', e);
    return res.send({ status: false, message: e.message });
  }
});

module.exports = analysisRouter;

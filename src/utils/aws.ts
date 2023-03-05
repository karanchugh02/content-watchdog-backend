import {
  DetectLabelsCommand,
  DetectModerationLabelsCommand,
} from '@aws-sdk/client-rekognition';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
import { env } from '../../constants';
import request from 'request';
import { S3 } from '@aws-sdk/client-s3';

const REGION = 'ap-south-1'; //e.g. "us-east-1"
// Create SNS service object.
const rekogClient = new RekognitionClient({
  region: REGION,
  credentials: {
    accessKeyId: env.S3_UPLOAD_KEY,
    secretAccessKey: env.S3_UPLOAD_SECRET,
  },
});

const s3 = new S3({
  region: REGION,
  credentials: {
    accessKeyId: env.S3_UPLOAD_KEY,
    secretAccessKey: env.S3_UPLOAD_SECRET,
  },
});

class Aws {
  public static async imageScanner(key: string) {
    try {
      const params = {
        Image: {
          S3Object: {
            Bucket: env.BUCKET,
            Name: key,
          },
        },
      };
      const response = await rekogClient.send(
        new DetectModerationLabelsCommand(params)
      );
      return { status: true, data: response.ModerationLabels }; // For unit tests.
    } catch (err) {
      console.log('Error', err);
      return { status: false, message: err.message };
    }
  }

  public static async uploadToS3(imageUrl: string, key: string) {
    return new Promise((resolve, reject) => {
      request(
        {
          url: imageUrl,
          encoding: null,
        },
        function (err, res, body) {
          if (err) {
            console.log('error is ', err);
            reject(err);
          }
          var objectParams = {
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length'],
            Key: key,
            Body: body,
            Bucket: env.BUCKET,
          };
          resolve(s3.putObject(objectParams));
        }
      );
    });
  }
}

export default Aws;

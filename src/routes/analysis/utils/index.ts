import { price } from '../../../../constants/price';
import prisma from '../../../../lib/prisma';

class AnalysisUtils {
  public static async imageLogCreator({
    key,
    results,
    orgId,
    s3Url,
  }: {
    key: string;
    results: Array<any>;
    orgId: number;
    s3Url: string;
  }) {
    let newLogs = await prisma.imageAnalysisRecord.create({
      data: {
        s3Key: key,
        results,
        s3Url: s3Url,
        organization: {
          connect: {
            id: orgId,
          },
        },
      },
    });

    let updatedOrganization = await prisma.organization.update({
      where: {
        id: orgId,
      },
      data: {
        walletBalance: {
          decrement: price.image,
        },
      },
    });

    console.log('new logs are ', newLogs, updatedOrganization);

    return;
  }

  public static async videoLogCreator({
    key,
    JobId,
    orgId,
    s3Url,
  }: {
    key: string;
    JobId: string;
    orgId: number;
    s3Url: string;
  }) {
    console.log('in function data ', key, JobId, orgId, s3Url);
    let newLogs = await prisma.videoAnalysisRecord.create({
      data: {
        s3Key: key,
        jobId: JobId,
        s3Url,
        status: 'PROCESSING',
        organization: {
          connect: {
            id: orgId,
          },
        },
      },
    });

    let updatedOrganization = await prisma.organization.update({
      where: {
        id: orgId,
      },
      data: {
        walletBalance: {
          decrement: price.video,
        },
      },
    });

    console.log('new logs are ', newLogs);

    return;
  }

  public static async videoLogUpdater(
    JobId: string,
    status: string,
    results?: any
  ) {
    let updatedLog = await prisma.videoAnalysisRecord.update({
      where: { jobId: JobId },
      data: {
        status: status,
        results: results,
      },
    });

    console.log('updated video log is ', updatedLog);

    return;
  }

  public static async textLogCreater(
    text: string,
    results: any,
    orgId: number
  ) {
    console.log('in data ', text, results, orgId);
    let newLog = await prisma.textAnalysisRecord.create({
      data: {
        text,
        results,
        organization: {
          connect: {
            id: orgId,
          },
        },
      },
    });

    let updatedOrganization = await prisma.organization.update({
      where: {
        id: orgId,
      },
      data: {
        walletBalance: {
          decrement: price.text,
        },
      },
    });

    console.log('new text log is ', newLog);

    return;
  }
}

export default AnalysisUtils;

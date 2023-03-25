import prisma from '../../../../lib/prisma';

class AnalysisUtils {
  public static async imageLogCreator({
    key,
    results,
  }: {
    key: string;
    results: Array<any>;
  }) {
    let newLogs = await prisma.imageAnalysisRecord.create({
      data: {
        s3Key: key,
        results,
        organization: {
          connect: {
            id: 1, //todo add org id after auth
          },
        },
      },
    });

    console.log('new logs are ', newLogs);

    return;
  }

  public static async videoLogCreator({
    key,
    JobId,
  }: {
    key: string;
    JobId: string;
  }) {
    let newLogs = await prisma.videoAnalysisRecord.create({
      data: {
        s3Key: key,
        jobId: JobId,
        status: 'PROCESSING',
        organization: {
          connect: {
            id: 1, //todo add org id after auth
          },
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

  public static async textLogCreater(text: string, results: any) {
    let newLog = await prisma.textAnalysisRecord.create({
      data: {
        text,
        results,
        organization: {
          connect: {
            id: 1,
          },
        },
      },
    });

    console.log('new text log is ', newLog);

    return;
  }
}

export default AnalysisUtils;

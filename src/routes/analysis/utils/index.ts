import prisma from '../../../../lib/prisma';

class AnalysisUtils {
  public static async logCreator({
    contentType,
    key,
    status,
    results,
  }: {
    contentType: any;
    key: string;
    status: any;
    results: Array<any>;
  }) {
    let newLogs = await prisma.analysisRecord.create({
      data: {
        contentType: contentType,
        s3Key: key,
        status,
        results,
        organization: {
          connect: {
            id: 1, //todo add org id after auth
          },
        },
      },
    });

    return;
  }
}

export default AnalysisUtils;

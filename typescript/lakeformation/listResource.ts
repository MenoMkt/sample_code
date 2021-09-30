import * as AWS from 'aws-sdk'
import fs from 'fs'
import util from 'util'

/**
 * データロケーション取得関数
 * @param lf 
 * @param param 
 * @param out 
 * @returns 
 */
export const getAllDataLakeLocation = async (
    lf: AWS.LakeFormation,
    param: AWS.LakeFormation.ListResourcesRequest,
    out: AWS.LakeFormation.ResourceInfo[] = []
): Promise<AWS.LakeFormation.ResourceInfo[]> => {
    const {
        NextToken,
        ResourceInfoList
    } = await lf.listResources(param).promise();

    if (ResourceInfoList) {
        out.push(...ResourceInfoList)
    }

    return !NextToken ? out : getAllDataLakeLocation(
        lf,
        Object.assign(param, {
            NextToken: NextToken
        }),
        out
    )

};

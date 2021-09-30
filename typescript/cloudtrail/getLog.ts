import * as aws from 'aws-sdk';
import moment from 'moment'
import util from 'util'
import fs from 'fs'
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

/**
 * CloudTrailのログをすべて取得する再帰関数
 * @param cloudTrail 
 * @param params 
 * @param out 
 * @returns 
 */
export const getAllEventLog = (
    cloudTrail: aws.CloudTrail,
    params: aws.CloudTrail.LookupEventsRequest,
    out: aws.CloudTrail.EventsList = []
):
    Promise<aws.CloudTrail.EventsList> => {
    return new Promise((resolve, reject) => {
        cloudTrail.lookupEvents(params)
            .promise()
            .then(({
                Events,
                NextToken,
            }) => {
                if (Events) {
                    out.push(...Events);
                }
                !NextToken
                    ? resolve(out)
                    // APIレートが毎秒2回までなので待機時間を設ける
                    : sleep(1000)
                        .then(() => {
                            resolve(getAllEventLog(
                                cloudTrail,
                                Object.assign(params, {
                                    NextToken: NextToken
                                }),
                                out
                            ));
                        })
            })
            .catch(reject);
    })
}

const main = async () => {
    const ct = new aws.CloudTrail({
        region: 'ap-southeast-1'
    })

    console.time('1日分のログ取得')
    const res = await getAllEventLog(ct, {
        LookupAttributes: [
            {
                AttributeKey: 'EventName',
                AttributeValue: 'StartQueryExecution'
            }
        ],
        EndTime: moment().toDate(),
        StartTime: moment().add("-1", 'day').toDate(),
    })

    console.log(util.inspect(JSON.parse(res[0].CloudTrailEvent!), false, null))

    fs.writeFileSync('./trailLog', JSON.stringify(res, null, '\t'))
    fs.writeFileSync('./trailEventLog', JSON.stringify(res.map(item => JSON.parse(item.CloudTrailEvent || "{}")), null, '\t'))
    console.timeEnd('1日分のログ取得')
}

main();

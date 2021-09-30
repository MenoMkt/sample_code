import * as AWS from 'aws-sdk'
import util from 'util'
const athena = new AWS.Athena({
    region: 'ap-northeast-1'
}
)

/** クエリ状態取得 */
const main = async () => {
    try {
        const { QueryExecution } = await athena.getQueryExecution({
            QueryExecutionId: '72e280d9-bef4-4686-8a58-49037c1ff8c1'
        }).promise()
        console.log(util.inspect(QueryExecution, false, null))
    } catch (error) {
        console.error(error)
    }
}
main();

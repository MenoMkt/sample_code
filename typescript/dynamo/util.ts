import * as AWS from 'aws-sdk'

type DynamoItem = AWS.DynamoDB.DocumentClient.AttributeMap;

/**
 * scanの再起関数
 * すべてのレコードを取得する
 * @param dynamo 
 * @param params 
 * @param out 
 * @returns 
 */
export const getAllDynamoDBRecords = (
    dynamo: AWS.DynamoDB.DocumentClient,
    params: AWS.DynamoDB.DocumentClient.ScanInput,
    out: DynamoItem[] = []
): Promise<DynamoItem[]> => {
    return new Promise((resolve, reject) => {
        dynamo.scan(params).promise().then(({
            Items,
            LastEvaluatedKey
        }) => {
            out.push(...Items!);
            !LastEvaluatedKey ? resolve(out) : resolve(getAllDynamoDBRecords(
                dynamo,
                Object.assign(params, {
                    ExclusiveStartKey: LastEvaluatedKey,
                } as AWS.DynamoDB.DocumentClient.ScanInput),
                out
            ));
        }).catch(reject);
    })
}

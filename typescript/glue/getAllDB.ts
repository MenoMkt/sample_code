import * as AWS from 'aws-sdk'

/**
 * 全DB取得関数
 * @param Glue 
 * @param params 
 * @param out 
 * @returns 
 */
export const getAllDatabases = (
    Glue: AWS.Glue,
    params: AWS.Glue.GetDatabasesRequest,
    out: AWS.Glue.DatabaseList = []
): Promise<AWS.Glue.DatabaseList> => {
    return new Promise((resolve, reject) => {
        Glue.getDatabases(params).promise().then(({
            DatabaseList,
            NextToken
        }) => {
            out.push(...DatabaseList!);
            !NextToken ? resolve(out) : resolve(getAllDatabases(
                Glue,
                Object.assign(params, {
                    NextToken: NextToken
                }),
                out
            ));
        })
            .catch(reject);
    })
}


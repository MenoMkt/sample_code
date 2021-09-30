
import * as aws from 'aws-sdk'

/**
 * 全テーブル取得関数
 * @param Glue 
 * @param params 
 * @param out 
 * @returns 
 */
export const getAllTable = (
    Glue: AWS.Glue,
    params: AWS.Glue.GetTablesRequest,
    out: AWS.Glue.Table[] = []
): Promise<AWS.Glue.Table[]> => {
    return new Promise((resolve, reject) => {
        Glue.getTables(params).promise().then(({
            TableList,
            NextToken
        }) => {
            out.push(...TableList!);
            !NextToken ? resolve(out) : resolve(getAllTable(
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


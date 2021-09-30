import * as AWS from 'aws-sdk'
import util from 'util';
const athena = new AWS.Athena({
    region: 'ap-northeast-1'
}
)

/**
 * クエリ結果をすべて取得する再帰関数
 * @param athena 
 * @param params 
 * @param out 
 * @returns 
 */
export const getQueryResult = async (
    athena: AWS.Athena,
    params: AWS.Athena.GetQueryResultsInput,
    out: string[][] = []
): Promise<string[][]> => {
    return new Promise(async (resolve, reject) => {
        const {
            ResultSet,
            NextToken,

        } = await athena.getQueryResults(params).promise();
        if (ResultSet?.Rows && ResultSet.ResultSetMetadata?.ColumnInfo) {
            const rows = ResultSet.Rows.map(row => row.Data!.map(data => data.VarCharValue || ""));

            if (!params.NextToken) rows.shift();

            out.push(...rows);
        }
        !NextToken ? resolve(out) : resolve(getQueryResult(
            athena,
            Object.assign(params, {
                NextToken: NextToken
            }),
            out
        ));
    })
}


export const convertQueryResult = async <RecordType>(
    rows: string[][],
    mapping: {
        [colName: string]: {
            index: number,
            type: 'string' | 'number'
        }
    }
): Promise<RecordType[]> => {
    const convertRows: RecordType[] = []
    rows.forEach(row => {
        const convertRow: { [key: string]: string | number } = {}
        Object.keys(mapping).forEach(colName => {
            const colValue = row[mapping[colName].index];
            convertRow[colName] = mapping[colName].type === 'number' ? parseInt(colValue) : colValue;
        })
        convertRows.push(convertRow as unknown as RecordType);
    })

    return convertRows;

}
const main = async () => {
    try {
        const res = await athena.getQueryResults({
            QueryExecutionId: '00000000-0000-0000-0000-000000000000',
        }).promise()

        console.log(util.inspect(res, false, null))

    } catch (error) {
        console.error(error)
    }
}
main();

import * as aws from 'aws-sdk'
import fs from 'fs'
import util from 'util'

/**
 * 既存DBにパーティション追加する処理
 */
const main = async () => {

    const glue = new aws.Glue({
        region: 'ap-northeast-1'
    })
    const { Table } = await glue.getTable({
        DatabaseName: 'FIXME:',
        Name: 'FIXME:'
    }).promise();
    const res = await glue.createPartition({
        DatabaseName: Table.DatabaseName,
        TableName: Table.Name,
        PartitionInput: {
            StorageDescriptor: {
                Location: `s3://bucket/table/year=2020/month=07/day=20/`,
                Columns: Table?.StorageDescriptor?.Columns!,
                NumberOfBuckets: Table?.StorageDescriptor?.NumberOfBuckets,
                StoredAsSubDirectories: Table?.StorageDescriptor?.StoredAsSubDirectories,
                Compressed: Table?.StorageDescriptor?.Compressed,
                OutputFormat: Table?.StorageDescriptor?.OutputFormat,
                SerdeInfo: Table?.StorageDescriptor?.SerdeInfo,
                InputFormat: Table?.StorageDescriptor?.InputFormat,
                BucketColumns: Table?.StorageDescriptor?.BucketColumns,
                Parameters: Table?.StorageDescriptor?.Parameters,
                SkewedInfo: Table?.StorageDescriptor?.SkewedInfo,
                SortColumns: Table?.StorageDescriptor?.SortColumns,
            },
            Values: ["2020", "07", "20"],
            Parameters: Table?.Parameters,
        },
    }).promise();
    console.log(res);
}

main();

import aws from 'aws-sdk'
import * as util from 'util'

const cognito = new aws.CognitoIdentityServiceProvider(
    {
        region: 'ap-northeast-1'
    }
)

/**
 * ユーザ一覧取得
 */
const main = async () => {

    const poolId = 'FIXME'

    const res = await cognito.listUsers({
        UserPoolId: poolId,
        Filter: `sub = "b83e37a8-ea52-4240-9067-734c58143d1d"`
    }).promise();

    console.log(util.inspect(res, false, null))
}


main()

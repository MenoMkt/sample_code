
import * as aws from 'aws-sdk'
import fs from 'fs'

export module LakeFormation {
    /**
     * 権限一覧取得関数
     * @param lf 
     * @param params 
     * @param out 
     * @returns 
     */
    export const getAllPermitList = async (
        lf: AWS.LakeFormation,
        params: AWS.LakeFormation.ListPermissionsRequest,
        out: AWS.LakeFormation.PrincipalResourcePermissionsList = []): Promise<AWS.LakeFormation.PrincipalResourcePermissionsList> => {
        return new Promise((resolve, reject) => {
            lf.listPermissions(params).promise().then(({
                PrincipalResourcePermissions,
                NextToken
            }) => {
                out.push(...PrincipalResourcePermissions!);
                !NextToken ? resolve(out) : resolve(getAllPermitList(
                    lf,
                    Object.assign(params, {
                        NextToken: NextToken
                    }),
                    out
                ));
            })
                .catch(reject);
        })
    }
}

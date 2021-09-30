import aws from 'aws-sdk'
import * as  Cognito from 'amazon-cognito-identity-js';
import moment from 'moment';


/**
 * Cognitoにログインする
 * @param params 
 * @returns 
 */
export const login = (params: {
    username: string,
    password: string,
}) => {
    const authenticationData = {
        Username: params.username,
        Password: params.password,
    };

    const authenticationDetails = new Cognito.AuthenticationDetails(authenticationData);
    const userPool = new Cognito.CognitoUserPool({
        UserPoolId: 'FIXME:',
        ClientId: 'FIXME:'
    })
    const cognitoUser = new Cognito.CognitoUser({
        Username: params.username,
        Pool: userPool
    });

    return new Promise((resolve, reject) => {
        const authConfig: Cognito.IAuthenticationCallback = {
            onSuccess(result) {
                const user = userPool.getCurrentUser();

                resolve({
                    code: 200,
                    message: 'ログインに成功しました。',
                    user: user,
                    session: result
                });
            },
            onFailure(err) {
                reject({
                    code: 400,
                    message: err
                });
            },
            newPasswordRequired(userAttributes, requiredAttributes) {
                console.log("newPasswordRequired()");
                console.log(userAttributes, requiredAttributes);
                // NOTE:パスワード変更要求の場合も入力したパスワードを使用する
                cognitoUser.completeNewPasswordChallenge(params.password, {}, authConfig);
            },
            mfaRequired(challengeName, challengeParameters) {
                console.log("mfaRequired()");
                console.log(challengeName, challengeParameters);
            },
            customChallenge(challengeParameters) {
                console.log("customChallenge()");
                console.log(challengeParameters);
            }
        };

        cognitoUser.authenticateUser(authenticationDetails, authConfig);
    });
};
const main = async () => {

    login({
        username: 'FIXME:',
        password: 'FIXME:'
    }).then((res: any) => {
        console.log(res);

        const user: Cognito.CognitoUser = res.user;
        const session: Cognito.CognitoUserSession = res.session;

        console.log(session.getIdToken().payload);
        console.log(moment(session.getIdToken().payload.exp * 1000));
    })

}


main()

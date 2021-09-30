import moment from 'moment';
import * as request from 'request-promise';
export interface KeycloakRequestOption {
    uri: string,
    headers: {},
    json: boolean,
    form?: {}
}
export interface keycloakUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
    createdTimestamp: number;
}

export interface QueryParameter {
    first: string,
    max: string
}
/**
 * KeycloakAPI利用サンプル
 */
export class KeycloakApi {

    host = 'FIXME:';
    realm = 'FIXME:'
    admin = {
        user: 'admin',
        pw: 'FIXME:'
    }
    constructor() {

    }

    async fetchAccessToken(): Promise<string> {
        try {
            // オプションを定義
            const postOptions: KeycloakRequestOption = {
                uri: `${this.host}/auth/realms/master/protocol/openid-connect/token`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                json: true,
                form: {
                    "client_id": "admin-cli",
                    "username": this.admin.user,
                    "password": this.admin.pw,
                    "grant_type": "password"
                }
            }
            //リクエスト送信
            const res = await request.post(postOptions);
            return res.access_token;
        } catch (err) {
            throw err;
        }
    }

    async fetchKeycloakUsers(accessToken: string, param: QueryParameter) {
        // getパラメーター定義
        const getOption: KeycloakRequestOption = {
            uri: `${this.host}/auth/admin/realms/${this.realm}/users?max=${parseInt(param.max)}&first=${parseInt(param.first)}&briefRepresentation=true`,
            json: true,
            headers: {
                authorization: `bearer ${accessToken}`
            }
        };
        const users: keycloakUser[] = await request.get(getOption);
        return users

    }
    async fetchKeycloakUser(accessToken: string, id: string) {
        // getパラメーター定義
        const getOption: KeycloakRequestOption = {
            uri: `${this.host}/auth/admin/realms/${this.realm}/users/${id}`,
            json: true,
            headers: {
                authorization: `bearer ${accessToken}`
            }
        };
        const user: keycloakUser = await request.get(getOption);
        return user

    }
}


const main = async () => {

    const keycloakApi = new KeycloakApi();

    const token = await keycloakApi.fetchAccessToken();
    const users = await keycloakApi.fetchKeycloakUsers(token, {
        first: '0',
        max: '2'
    })

    console.log(users)

    const user = await keycloakApi.fetchKeycloakUser(token, users[1].id);
    console.log(user);

    console.log(moment(user.createdTimestamp))
}

main();

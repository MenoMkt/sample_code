
import io from 'socket.io-client';
import { Observable, Subject } from 'rxjs'

export type Listener = {
    emitter: SocketIOClient.Emitter,
    subject: Subject<any>
}

export type WebSocketData = {
    task_status: {
        task_status: 'ERROR' | 'WAITING' | 'RUNNING' | 'SUCCESS'
    }
}

/**
 * WebSocket利用するための関数群
 */
export class Socket {

    private socket: SocketIOClient.Socket
    listenerMap: Map<string, Listener> = new Map<string, Listener>()
    constructor(
        url: string,
        userId: string
    ) {
        this.socket = io(url);
        this.socket.on('connect', () => {
            console.log('connect socket');
            this.joinRoom(userId);
        });
    }

    joinRoom(userId: string) {
        console.log('join socketio room:', userId);
        this.socket.emit('join_user', {
            user_id: userId
        });
    }
    eventObservable<T>(eventName: string): Observable<T> {
        const subject = new Subject<T>();
        const emitter = this.socket.on(eventName, (data: T) => {
            subject.next(data)
        })
        this.listenerMap.set(eventName, {
            emitter: emitter,
            subject: subject
        })
        return subject.asObservable();
    }

    /**
     * ステータスが成功、またはエラーになるまでのWebSocketから送られてきたデータを取得する
     * ステータスが成功またはエラーにならない場合タイムアウト（デフォルト30s)する
     */
    fetchAllEventData<T extends WebSocketData>(
        eventName: string,
        timeout = 30000): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const dataList: T[] = [];
            const eventObservable = this.eventObservable<T>(eventName);


            eventObservable.subscribe((data: T) => {
                dataList.push(data);

                if (data.task_status.task_status === 'ERROR' || data.task_status.task_status === 'SUCCESS') {
                    this.removeListener(eventName)
                    return resolve(dataList);
                }
            });

            setTimeout(() => {
                this.removeListener(eventName)
                return reject(Error('timeout'))
            }, timeout)
        })
    }
    removeListener(eventName: string) {
        const listener = this.listenerMap.get(eventName);
        listener.emitter.removeAllListeners();
        listener.subject.unsubscribe();
        this.listenerMap.delete(eventName);
    }
    removeAllListener() {
        this.socket.removeAllListeners();
        this.listenerMap.forEach(listener => {
            listener.emitter.removeAllListeners();
            listener.subject.unsubscribe();
        })
        this.listenerMap.clear()
    }
    close() {
        this.socket.close()
    }
}

const socketInstance = new Socket(
    'FIXME:', 'FIXME')


socketInstance.eventObservable<any>('hogehoge').subscribe(data => {
    console.log(data);
})


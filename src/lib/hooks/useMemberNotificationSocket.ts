import useSWRSubscription from 'swr/subscription';
import { WebSocketMessage } from './types';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

interface MemberNotificationSocketOptions {
    onRoomJoined?: () => void;
    onRoomDeleted?: () => void;
    isLoggedIn: boolean;
}

export const useMemberNotificationSocket = (options: MemberNotificationSocketOptions) => {
    const { isLoggedIn, onRoomJoined, onRoomDeleted  } = options;

    const { error } = useSWRSubscription(
        isLoggedIn ? `${WEBSOCKET_URL}/ws/member` : null,
        (key, { next }) => {
            if (!key) {
                return () => {};
            }

            const socket = new WebSocket(key);

            socket.onopen = () => {
                console.log('Member WebSocket 연결 성공');
            };

            socket.onmessage = (event: MessageEvent) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log('받은 메시지:', message);

                    if (message.type === 'room_joined' && onRoomJoined) {
                        onRoomJoined();
                    }

                    if (message.type === 'room_deleted' && onRoomDeleted) {
                        onRoomDeleted();
                    }

                } catch (e) {
                    console.error('연결에 실패 하였습니다.:', e);
                }
            };

            socket.onerror = (event: Event) => {
                console.error('유저 웹 소켓 에러:', event);
                next(new Error('Member WebSocket error'));
            };

            socket.onclose = (event) => {
                console.log('유저 웹 소켓 연결끊기:', event);
            };

            return () => {
                socket.close();
            };
        }
    );

    return { error };
};

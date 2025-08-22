import useSWRSubscription from 'swr/subscription';
import { selectedRoom } from '@/app/room/RoomTypes';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export const useRoomSocket = (roomId: string | null) => {
    const { data, error } = useSWRSubscription(
        // roomId가 있을 때만 구독을 시작
        roomId ? `${WEBSOCKET_URL}/ws/rooms/${roomId}` : null,
        (key, { next }) => {
            if (!key) {
                return () => {};
            }

            const socket = new WebSocket(key);

            socket.onopen = () => {
                console.log("WebSocket 연결 성공",key);
            }

            socket.onmessage = (event: MessageEvent) => {
                try {
                    const receivedData: selectedRoom = JSON.parse(event.data);
                    console.log("업데이트할 selectedRoom:",receivedData);
                    next(null, receivedData);
                } catch (e) {
                    console.error("메세지 오류:", e);
                }
            };

            socket.onerror = (err) => {
                console.error("연결 중 오류 발생:", err);
                next(err);
            };

            socket.onclose = (event) => {
                console.log("웹 소켓 연결 끊음:", event);
            };

            return () => {
                socket.close();
            };
        }
    );

    return {
        roomData: data,
        error,
        isLoading: !data && !error && !!roomId,
    };
};

import { Applicant, selectedRoom, ChatMessage } from '@/app/room/RoomTypes';
import { RoomSocketData, WebSocketMessage } from '@/lib/hooks/types';
import useSWRSubscription from "swr/subscription";

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
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log("받은 메시지:", message);

                    if (message.type === 'initialData') {
                        const { roomData, applicants } = message.payload;
                        next(null, { roomData, applicants, chatMessages: [] }); // chatMessages를 빈 배열로 초기화

                    } else if (message.type === 'roomUpdate') {
                        const updatedRoomData = message.payload as selectedRoom;
                        next((currentData: RoomSocketData | undefined) => ({
                            ...currentData!,
                            roomData: updatedRoomData,
                        }));

                    } else if (message.type === 'newChat') {
                        const newMessage = message.payload as ChatMessage;
                        next((currentData: RoomSocketData | undefined) => ({
                            ...currentData!,
                            chatMessages: [...currentData!.chatMessages, newMessage],
                        }));

                    } else if (message.type === 'newApplicant') {
                        const newApplicant = message.payload as Applicant;
                        next((currentData: RoomSocketData | undefined) => ({
                            ...currentData!,
                            applicants: [...currentData!.applicants, newApplicant],
                        }));

                    } else if (message.type === 'error') {
                        console.error("서버 에러 메시지:", message.payload);
                        next(new Error(message.payload.message));
                    }
                } catch (e) {
                    console.error("메세지 구문분석 오류:", e);
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

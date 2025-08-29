import { Applicant, selectedRoom, ChatMessage } from '@/app/room/RoomTypes';
import { RoomSocketData, WebSocketMessage } from '@/lib/hooks/types';
import useSWRSubscription from "swr/subscription";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export const useRoomSocket = (roomId: string | null) => {
    const { data, error } = useSWRSubscription(
        roomId ? `${WEBSOCKET_URL}/ws/rooms/${roomId}` : null,
        (key, { next }) => {
            if (!key) {
                return () => {};
            }

            const socket = new WebSocket(key);

            socket.onopen = () => {
                console.log("WebSocket 연결 성공", key);
            }

            socket.onmessage = (event: MessageEvent) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log("받은 메시지:", message);

                    switch (message.type) {
                        case 'initialData':
                            const { roomData, applicants } = message.payload;
                            next(null, { roomData, applicants, chatMessages: [] });
                            break;

                        case 'roomUpdate':
                            next(null, (currentData: RoomSocketData | undefined) => {
                                if (!currentData) {
                                    console.error("'roomUpdate' 수신했지만, 초기 데이터가 없습니다.");
                                    return currentData;
                                }
                                return {
                                    ...currentData,
                                    roomData: message.payload as selectedRoom,
                                };
                            });
                            break;

                        case 'newChat':
                            next(null, (currentData: RoomSocketData | undefined) => {
                                if (!currentData) {
                                    console.error("'newChat' 수신했지만, 초기 데이터가 없습니다.");
                                    return currentData;
                                }
                                const newMessage = message.payload as ChatMessage;
                                return {
                                    ...currentData,
                                    chatMessages: [...(currentData.chatMessages || []), newMessage],
                                };
                            });
                            break;

                        case 'newApplicant':
                            const newApplicant = message.payload as Applicant;
                            console.log("새로운 신청자 : ", newApplicant);
                            next(null, (currentData: RoomSocketData | undefined) => {
                                if (!currentData) {
                                    console.error("'newApplicant' 수신했지만, 초기 데이터가 없습니다.");
                                    return currentData;
                                }
                                return {
                                    ...currentData,
                                    applicants: [...(currentData.applicants || []), newApplicant],
                                };
                            });
                            break;

                        case 'error':
                            console.error("서버 에러 메시지:", message.payload);
                            next(new Error(message.payload.message));
                            break;
                    }
                } catch (e) {
                    console.error("메세지 구문분석 오류:", e);
                }
            };

            socket.onerror = (event: Event) => {
                console.error("연결 중 오류 발생:", event);
                next(new Error('WebSocket error occurred.'));
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




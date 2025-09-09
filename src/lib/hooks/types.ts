import {Applicant, selectedRoom, ChatMessage} from "@/app/room/RoomTypes";

export interface WebSocketMessage {
    type: 'initialData' | 'leaveRoom' | 'error' | 'newChat' | 'newApplicant' | 'applicant_accepted' | 'applicant_canceled' | 'room_joined' | 'room_deleted';
    payload: any;
}

export interface RoomSocketData {
    roomData: selectedRoom;
    applicants: Applicant[];
    chatMessages: ChatMessage[];
}
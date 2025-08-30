import {Applicant, selectedRoom, ChatMessage} from "@/app/room/RoomTypes";

export interface WebSocketMessage {
    type: 'initialData' | 'roomUpdate' | 'error' | 'newChat' | 'newApplicant' | 'applicant_accepted' | 'applicant_canceled';
    payload: any;
}

export interface RoomSocketData {
    roomData: selectedRoom;
    applicants: Applicant[];
    chatMessages: ChatMessage[];
}
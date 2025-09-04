import apiInstance from '@/lib/api/apiInstance';
import {ChatMessageReq} from "@/app/room/RoomTypes";

export const sendMessage= async(data:ChatMessageReq) => {
    const url = process.env.NEXT_PUBLIC_MESSAGE_SEND!;
    console.log("메세지 보내기")
    const res = await apiInstance.post(url,data);
    return res.data;
}
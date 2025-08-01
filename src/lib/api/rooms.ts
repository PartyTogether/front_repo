import apiInstance  from './apiInstance';
import {Continent, createRoomReq} from '@/app/room/RoomTypes';

export async function createRoom (data:createRoomReq) {
    const res = await apiInstance.post('/room/create',data);
    return res.data;
}

export async function fetchRoomPageData(): Promise<Continent[]> {
    const res = await apiInstance.get('/room/meta');
    return res.data;
}
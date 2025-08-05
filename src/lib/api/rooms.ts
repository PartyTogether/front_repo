import apiInstance from './apiInstance';
import {Continent, createRoomReq, Room} from '@/app/room/RoomTypes';
import useSWR from "swr";

/**
 * 방 생성 api
 * @param data
 */
export async function createRoom(data: createRoomReq) {
    const res = await apiInstance.post('/room/create', data);
    return res.data;
}


/**
 *  /room 경로의 초기 메타 데이터 api
 */
export async function fetchRoomPageData(): Promise<Continent[]> {
    const res = await apiInstance.get('/room/meta');
    return res.data;
}

/**
 * SWR을 위한 fetcher 함수
 * @param url SWR 키 (API 경로)
 */
const fetcher = (url: string) => apiInstance.get(url).then(res => res.data);

/**
 * 방 상세정보 가져오기
 * 선택된 방의 ID. null일 경우 요청 안보냄
 * @param roomId
 */
export function useRoom(roomId: number | null) {
    // 상세 조회 API의 URL을 동적으로 생성합니다.
    // roomId가 유효한 경우에만 URL이 생성됩니다.
    const url = roomId ? `/room/${roomId}` : null;

    // useSWR 훅을 사용하여 데이터를 가져옵니다.
    // url이 null이면 SWR은 요청을 보내지 않습니다.
    const {data, error, isLoading} = useSWR<Room>(url, fetcher);

    return {
        room: data,
        isLoading,
        isError: error,
    };
}

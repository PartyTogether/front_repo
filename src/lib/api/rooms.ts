import apiInstance from './apiInstance';
import {Continent, createRoomReq, Room} from '@/app/room/RoomTypes';
import useSWR from "swr";

/**
 * 방 생성 api
 * @param data
 */
export async function createRoom(data: createRoomReq) {
    console.log("방만들기 요청 실행 data:",data);
    const res = await apiInstance.post(process.env.NEXT_PUBLIC_ROOM_CREATE!, data);
    return res.data;
}


/**
 *  /room 경로의 초기 메타 데이터 api
 */
export async function fetchRoomPageData(): Promise<Continent[]> {
    console.log("방 메타데이터 가져오기 실행");
    const res = await apiInstance.get(process.env.NEXT_PUBLIC_ROOM_META!);
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

/**
 * 방 목록 가져오기
 * @param continent 선택된 대륙 (필수)
 * @param huntingGround 선택된 사냥터 (선택)
 */
export function useGetRooms(continent: string, huntingGround: string | null) {
    let url = process.env.NEXT_PUBLIC_ROOMS!;
    if (continent) {
        url += `?continent=${encodeURIComponent(continent)}`;
        if (huntingGround) {
            url += `&huntingGround=${encodeURIComponent(huntingGround)}`;
        }
    }

    const { data, error, isLoading } = useSWR<Room[]>(url, fetcher);

    return {
        rooms: data,
        isLoading,
        isError: error,
    };
}

"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TiStar } from "react-icons/ti";
import Image from "next/image";
import { tw } from "@/styles/common";

interface users {
    id: number;
    name: string;
    level: number;
    class: string;
}

interface selectedRoom {
    id: number;
    title: string;
    desc: string;
    users: users[];
    host: string;
    currentHead: number;
    maximumHead: number;
    isFull: boolean;
}

type RoomType = {
    id: number;
    title: string;
    desc: string;
    continent: string;
    huntingGround: string;
    host: string;
    isFull: boolean;
    currentHead: number;
    maximumHead: number;
    channel: string;
    minimumLv: number;
    minimumPlayTime: number;
};

interface RoomsProps {
    roomList: RoomType[];
    handleRoomSelect: (id: number) => void;
    selectedRoom: selectedRoom | null;
}

export default function Rooms({ roomList, handleRoomSelect, selectedRoom }: RoomsProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState<RoomType[]>(roomList);
    const [page, setPage] = useState(0);
    const loaderRef = useRef(null);

    const style = {
        // 검색 박스
        searchDiv:"relative items-center mb-6",
        searchBar:
            "w-full px-5 py-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition",
        searchBtn:
            "absolute right-1 top-1 bottom-1 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition",
        // 검색 박스

        // 방 리스트 박스
        roomListDiv: "divide-y divide-gray-200 border-t border-gray-300",
        roomDiv: "flex justify-between items-start px-4 py-3 bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer",
            // 방 왼쪽 스타일
            roomDivLeft: "flex flex-col space-y-2 py-4",
            roomDivLeftTitle: "text-base font-bold text-gray-800",
            roomDivLeftHost: "text-base font-medium text-gray-500",
            continentTag: "flex gap-1 w-[80px] bg-yellow-100 text-gray-500",
            hashTag1: "flex bg-[#98c1f8] text-white",
            hashTag2: "flex bg-[#8f7389] text-white",
            hashTag3: "flex bg-[#319864] text-white",
            // 방 오른쪽 스타일
            roomDivRight: "text-right items-center ",
            roomDivRightDesc: "mt-1 text-xs font-normal text-gray-400",
            roomDivRightInfo: "flex items-center gap-2 text-gray-700 text-xl font-semibold px-3 py-1 rounded-full",
            acceptBtn: "mt-13",
        // 방 리스트 박스
    };

    // 무한 스크롤 감지기
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.disconnect();
        };
    }, []);

    // 필터링된 방 리스트
    const filteredRooms = rooms.filter((room) => {
        if (!searchTerm) return true;
        return (
            room.title.includes(searchTerm) ||
            room.host.includes(searchTerm)
        );
    });

    return (
        <section>
            {/* 검색 바 */}
            <div className={style.searchDiv}>
                <input
                    type="text"
                    placeholder="방제 또는 방장 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={style.searchBar}
                />
                <button type="submit" className={style.searchBtn}>
                    검색
                </button>
            </div>

            {/* 방 리스트 */}
            <div className={style.roomListDiv}>
                {filteredRooms.map((room) => (
                    <div
                        key={room.id}
                        onClick={() => handleRoomSelect(room.id)}
                        className={cn(
                            style.roomDiv,
                            selectedRoom?.id === room.id && "translate-x-2 shadow-md"
                        )}
                    >
                        {/* 왼쪽 */}
                        <div className={style.roomDivLeft}>
                            <div className={cn(tw.hashTagStyle, style.continentTag)}>
                                <TiStar className="text-yellow-600" />
                                {room.continent}
                            </div>
                            <h3 className={style.roomDivLeftTitle}>
                                {room.title}
                            </h3>
                            <p className={style.roomDivLeftHost}>방장: {room.host}</p>
                            <div className="flex gap-2">
                                <div className={cn(tw.hashTagStyle, style.hashTag1)}>
                                    {room.minimumLv}Lv 이상
                                </div>
                                <div className={cn(tw.hashTagStyle, style.hashTag2)}>
                                    {room.minimumPlayTime}시간 이상
                                </div>
                                <div className={cn(tw.hashTagStyle, style.hashTag3)}>
                                    채널 {room.channel}
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽 */}
                        <div className={style.roomDivRight}>
                            <div className={style.roomDivRightInfo}>
                                <Image
                                    src="/orange_mushroom.png"
                                    alt="주황버섯"
                                    width={30}
                                    height={20}
                                />
                                {room.currentHead} / {room.maximumHead}
                            </div>
                            <p className={style.roomDivRightDesc}>{room.desc}</p>
                            <div className={cn(tw.acceptBtn, style.acceptBtn)}>가입신청</div>
                        </div>
                    </div>
                ))}
                <div ref={loaderRef} className="h-12" />
            </div>
        </section>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { tw } from "@/styles/common";
import { cn } from "@/lib/utils";
import { TiStar } from "react-icons/ti";
import Image from "next/image";
import { FaCrown } from "react-icons/fa";

interface Room {
    id: number;
    title: string;
    continent: string;
    huntingGround: string;
    host: string;
    isFull: boolean;
    currentHead: number;
    maximumHead: number;
    channel: string;
    minimumLv: number;
    minimumPlayTime: number;
}

interface selectedRoom {
    id: number;
    title: string;
    users: users[];
    host: string;
    currentHead: number;
    maximumHead: number;
    isFull: boolean;
}

interface users {
    id: number;
    name: string;
    level: number;
    class: string;
}

interface RoomsProps {
    selectedContinent: string;
    selectedHuntingGround: string;
}

export default function Rooms({
                                  selectedContinent,
                                  selectedHuntingGround,
                              }: RoomsProps) {
    const style = {
        section: "p-4 max-w-6xl mx-auto",
        searchBar:
            "w-full px-5 py-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition",
        searchBtn:
            "absolute right-1 top-1 bottom-1 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition",
        continentTag: "flex gap-1 w-[80px] bg-yellow-100 text-gray-500",
        hashTag1: "flex bg-[#98c1f8] text-white",
        hashTag2: "flex bg-[#8f7389] text-white",
        hashTag3: "flex bg-[#319864] text-white",
        acceptBtn: "inline-block text-white font-semibold mt-8",

       // 선택된 방 정보 스타일
        selectedRoomTitle: "text-xl font-bold mb-4 pb-4 border-b-1 border-gray-300",
        selectedRoomUsers: "grid grid-cols-2",
        selectedRoomUser: "border border-gray-200 rounded-lg text-left py-2 px-2 text-gray-500 font-medium",
        selectedRoomHost: "flex items-center text-center text-gray-500 justify-center mb-5 pb-5 px-2 gap-2 font-semibold border-b-1 border-gray-200",

    };



    const testUsers: users[] = [
        {
            id:1,
            name: "불의를못참음",
            level: 152,
            class: "나이트로드"
        },
        {
            id:2,
            name: "심줄까",
            level: 110,
            class: "비숍"
        },
        {
            id:3,
            name: "대머리도적",
            level: 162,
            class: "나이트로드"
        },
        {
            id:4,
            name: "황족나이트",
            level: 172,
            class: "나이트"
        }
    ]

    const testSelectedRoom: selectedRoom =
        {
            id: 2,
            title: "불어둠 좌1 우1 구합니다11111111111",
            users: testUsers,
            host: "불의를못참음",
            currentHead: 4,
            maximumHead: 6,
            isFull: false
        }


    const testRooms: Room[] = [
        {
            id: 1,
            title: "망용둥 좌1 우1 구합니다",
            continent: "리프레",
            huntingGround: "망가진 용의 둥지",
            host: "풍선",
            isFull: true,
            currentHead: 6,
            maximumHead: 6,
            channel: "L-12",
            minimumLv: 144,
            minimumPlayTime: 2,
        },
        {
            id: 2,
            title: "불어둠 좌1 우1 구합니다11111111111",
            continent: "리프레",
            huntingGround: "블과 어둠의 영역",
            host: "불의를못참음",
            isFull: false,
            currentHead: 4,
            maximumHead: 6,
            channel: "L-113",
            minimumLv: 90,
            minimumPlayTime: 2,
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [hideFull, setHideFull] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [page, setPage] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState<selectedRoom | null>(null);
    const roomInfoRef = useRef<HTMLDivElement | null>(null);
    const roomListRef = useRef<HTMLDivElement | null>(null);
    const loaderRef = useRef(null);
    const hostUser = selectedRoom?.users.find((user) => user.name === selectedRoom?.host);
    const otherUsers = selectedRoom?.users.filter((user => user.name !== selectedRoom?.host)) ?? [];

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

    // 방 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent)=> {
            if(roomInfoRef.current && !roomInfoRef.current.contains(e.target as Node)
            && roomListRef.current && !roomListRef.current.contains(e.target as Node)){
                setSelectedRoom(null);
            }
        };
        if(selectedRoom){
            document.addEventListener("mousedown",handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown",handleClickOutside);
        }
    }, [selectedRoom]);

    // 방 선택함수
    const selectRoom = async (room:Room) => {
        setSelectedRoom(testSelectedRoom);
    }

    const filteredRooms = testRooms.filter((room) => {
        if (hideFull && room.isFull) return false;
        return (
            room.title.includes(searchTerm) || room.host.includes(searchTerm)
        );
    });

    return (
        <section className={style.section}>
            {/* 전체 컨테이너 */}
            <div
                className={cn(
                    "transition-all duration-500 gap-6",
                    selectedRoom
                        ? "flex flex-col lg:flex-row items-start"
                        : "flex flex-col items-center"
                )}
            >
                {/* 왼쪽 방 상세정보 */}
                {selectedRoom && (
                    <div
                        ref={roomInfoRef}
                        className="lg:w-3/6 w-full bg-white p-5 rounded-lg shadow h-fit sticky top-20 animate-slide-in-left">
                        <h2 className={style.selectedRoomTitle}>{selectedRoom.title}</h2>
                        {hostUser && (
                            <div className={style.selectedRoomHost}>
                                <FaCrown className="text-yellow-400"/>
                                {hostUser.level}Lv {hostUser.class} {hostUser.name}
                            </div>
                        )}
                        <div className={style.selectedRoomUsers}>
                            {otherUsers.map((user) => (
                                <div className={style.selectedRoomUser}
                                     key={user.id}>
                                    {user.level}Lv {user.class} {user.name}
                                </div>
                                ))}
                        </div>

                        {/* 채팅 박스 */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">파티 채팅</h3>
                            <div className="border rounded-lg border-gray-200 h-48 overflow-y-auto p-3 space-y-2 bg-gray-50">
                                {/* 메시지 예시 */}
                                <div className="text-sm text-gray-700">
                                    <span className="font-semibold text-gray-900">불의를못참음:</span> 준비 다 되셨으면 말씀주세요~
                                </div>
                                <div className="text-sm text-gray-700">
                                    <span className="font-semibold text-gray-900">심줄까:</span> 포션 좀 사올게요
                                </div>
                            </div>

                            {/* 입력창 */}
                            <form className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white rounded-full px-4 py-2 text-sm hover:bg-blue-600"
                                >
                                    보내기
                                </button>
                            </form>
                        </div>
                        {/* 채팅 박스  */}
                    </div>
                )}

                {/* 오른쪽 검색바 + 방 리스트 */}
                <div
                    className={cn(
                        "transition-all duration-500",
                        selectedRoom ? "lg:w-3/6" : "w-full max-w-2xl"
                    )}
                >
                    {/* 검색 바 */}
                    <div className="relative items-center mb-6">
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
                    <div
                        ref={roomListRef}
                        className="divide-y divide-gray-200 border-t border-gray-300">
                        {filteredRooms.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => selectRoom(room)}
                                className={cn(
                                    "flex justify-between items-start px-4 py-3 bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer",
                                    selectedRoom?.id === room.id && "translate-x-2 shadow-md"
                                )}
                            >
                                {/* 왼쪽 정보 */}
                                <div className="flex flex-col space-y-2 py-4">
                                    <div className={cn(tw.hashTagStyle, style.continentTag)}>
                                        <TiStar className="text-yellow-600" />
                                        {room.continent}
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-800">
                                        {room.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">방장: {room.host}</p>
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

                                {/* 오른쪽 정보 */}
                                <div className="text-right min-w-[100px]">
                                    <div className="flex items-center gap-2 text-gray-500 text-xl font-semibold px-3 py-1 rounded-full">
                                        <Image
                                            src="/orange_mushroom.png"
                                            alt="주황버섯"
                                            width={30}
                                            height={20}
                                        />
                                        {room.currentHead} / {room.maximumHead}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-400">2025.07.05 마감</p>
                                    <div className={cn(tw.acceptBtn, style.acceptBtn)}>가입신청</div>
                                </div>
                            </div>
                        ))}
                        <div ref={loaderRef} className="h-12" />
                    </div>
                </div>
            </div>
        </section>
    );
}

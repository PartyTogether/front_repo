"use client";

import {useEffect, useState} from "react";
import Header from "@/components/Header";
import RoomHero from "@/app/room/components/RoomHero";
import Rooms from "@/app/room/components/Rooms";
import RoomInfo from "@/app/room/components/RoomInfo";
import { cn } from "@/lib/utils";
import ViewMode from "@/app/room/components/ViewMode";
import MyRoom from "@/app/room/components/MyRoom";
import { fetchRoomPageData } from '@/lib/api/rooms';
import RoomCreate from "@/app/room/components/RoomCreate";
import {Continent, members, selectedRoom, Room} from "@/app/room/RoomTypes";



export default function RoomPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState("");
    const [selectedHuntingGround, setSelectedHuntingGround] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<selectedRoom | null>(null);
    const [roomList, setRoomList] = useState<Room[] | null>(null);
    const [continents, setContinents] = useState<Continent[]>([]);

    const [viewMode, setViewMode] = useState("OTHER_PARTY");

    const isLoggedIn = true;
    const hasRoom = false;

    const style = {
        roomPageDiv: "min-h-screen bg-white",
        roomSection: "max-w-6xl mx-auto transition-all duration-500 mt-10 gap-6 px-6",
        isRoomSectionSelectedRoomTrue: "flex flex-col lg:flex-row items-start ",
        isRoomSectionSelectedRoomFalse: "flex flex-col items-center",
        roomInfoDiv: "lg:w-3/6 animate-slide-in-left ",
        isRoomsSelectedRoomTrue: "lg:w-3/6 animate-slide-in-left",
        isRoomsSelectedRoomFalse: "w-full max-w-3xl",
        items_center:"flex flex-col items-center"
    }

    const testUsers: members[] = [
        {
            memberId:1,
            memberName: "불의를못참음",
            memberLevel: 152,
            memberClass: "나이트로드"
        },
        {
            memberId:2,
            memberName: "심줄까",
            memberLevel: 110,
            memberClass: "비숍"
        },
        {
            memberId:3,
            memberName: "대머리도적",
            memberLevel: 162,
            memberClass: "나이트로드"
        },
        {
            memberId:4,
            memberName: "황족나이트",
            memberLevel: 172,
            memberClass: "나이트"
        }
    ]

    const testUsers2: members[] = [
        {
            memberId:5,
            memberName: "메롱도적",
            memberLevel: 166,
            memberClass: "나이트로드"
        },
        {
            memberId:6,
            memberName: "최강비숍",
            memberLevel: 105,
            memberClass: "클레릭"
        },
        {
            memberId:7,
            memberName: "풍선",
            memberLevel: 156,
            memberClass: "나이트로드"
        },
        {
            memberId:8,
            memberName: "S2닼나",
            memberLevel: 172,
            memberClass: "다크나이트"
        },
        {
            memberId:9,
            memberName: "샾싸게",
            memberLevel: 140,
            memberClass: "사수"
        },
        {
            memberId:10,
            memberName: "띱자리히어로",
            memberLevel: 110,
            memberClass: "크루세이더"
        }
    ]

    const testSelectedRoom: selectedRoom[] = [
        {
            roomId: 1,
            roomTitle: "망용둥 좌1 우1 구합니다다다다다다다다다다다다다다다다다다다다다다다다다다다다다다다다",
            roomDesc: "끈기있게 하실분만만만만만만만만만만만만만만만만만만만 ",
            roomMembers: testUsers2,
            roomHost: "풍선",
            roomCurrentMembers: 6,
            roomMaxMembers: 6,
            roomIsFull: true
        },
        {
            roomId: 2,
            roomTitle: "불어둠 좌1 우1 구합니다11111111111",
            roomDesc: "최강 격수보유중",
            roomMembers: testUsers,
            roomHost: "불의를못참음",
            roomCurrentMembers: 4,
            roomMaxMembers: 6,
            roomIsFull: false
        },

    ]

    const testRooms = [
        {
            roomId: 1,
            roomTitle: "망용둥 좌1 우1 구합니다다다다다다다다다다다다다다다다다다다다다다다다다",
            roomDesc: "끈기있게 하실분만만만만만만만만만만만만만만만만만만만 !!!",
            roomContinent: "리프레",
            roomHuntingGround: "망가진 용의 둥지",
            roomHost: "풍선",
            roomIsFull: true,
            roomCurrentMembers: 6,
            roomMaxMembers: 6,
            roomChannel: "L-12",
            roomMinLevel: 144,
            roomMinTime: 2,
        },
        {
            roomId: 2,
            roomTitle: "불어둠 좌1 우1 구합니다11111111111",
            roomDesc: "최강 격수보유중",
            roomContinent: "리프레",
            roomHuntingGround: "불과 어둠의 전장",
            roomHost: "불의를못참음",
            roomIsFull: false,
            roomCurrentMembers: 4,
            roomMaxMembers: 6,
            roomChannel: "L-113",
            roomMinLevel: 90,
            roomMinTime: 2,
        },
    ];

    /**
     *  초기 요청 (대륙, 사냥터, 포지션 정보)
     */
    useEffect(() => {
        const loadRoomPageData = async () => {
            try {
                const data = await fetchRoomPageData();
                setContinents(data);
            } catch (error) {
                console.error("Error fetching room page data:", error);
            }
        };
        void loadRoomPageData();
    }, []);


    useEffect(() => {
        console.log("선택된 대륙: ",selectedContinent);
        console.log("선택된 사냥터: ",selectedHuntingGround);
        if(selectedContinent){
            if(selectedHuntingGround){
                const roomList = testRooms.filter((room) => room.roomHuntingGround === selectedHuntingGround);
                setRoomList(roomList);
            }else{
                const roomList = testRooms.filter((room) => room.roomContinent === selectedContinent);
                setRoomList(roomList);
            }
        }
    }, [selectedContinent,selectedHuntingGround]);

    useEffect(() => {
        if(selectedRoomId !== null){
            const room = testSelectedRoom.find((room) => room.roomId === selectedRoomId);
            if(room){
                setSelectedRoom(room);
            }
        }else{
            setSelectedRoom(null);
        }
    }, [selectedRoomId]);

    const handleRoomSelect = (id:number) => {
        setSelectedRoomId(id);
    }

    const handleRoomInfoClose = () => {
        setSelectedRoomId(null);
    }

    return (
        <div className={style.roomPageDiv}>
            <Header onMenuClick={() => setMenuOpen(true)} />

            <RoomHero
                continents={continents}
                selectedContinent={selectedContinent}
                setSelectedContinent={setSelectedContinent}
                selectedHuntingGround={selectedHuntingGround}
                setSelectedHuntingGround={setSelectedHuntingGround}
            />

            <div
                className={cn(
                    style.roomSection,
                    selectedRoom
                        ? style.isRoomSectionSelectedRoomTrue
                        : style.isRoomSectionSelectedRoomFalse
                )}
            >
                {selectedRoom && (
                    <div className={style.roomInfoDiv}>
                        <RoomInfo room={selectedRoom}
                                  onClose={handleRoomInfoClose}
                        />
                    </div>
                )}

                <div className={cn(selectedRoom ? style.isRoomsSelectedRoomTrue : style.isRoomsSelectedRoomFalse,
                    viewMode === "MAKE_PARTY" && style.items_center)}>
                    <ViewMode
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />
                    {viewMode === "OTHER_PARTY" ? (
                        <Rooms
                            roomList={roomList}
                            handleRoomSelect={handleRoomSelect}
                            selectedRoom={selectedRoom}
                        />
                    ) : viewMode === "MAKE_PARTY" ? (
                        isLoggedIn && !hasRoom ? (
                            <RoomCreate continents={continents} />
                        ) : (
                            <div className="text-center py-10">
                                <p>{!isLoggedIn ? "로그인이 필요합니다." : "이미 참여중인 방이 있습니다."}</p>
                            </div>
                        )
                    ) : (
                        <MyRoom />
                    )}
                </div>
            </div>
        </div>
    );
}

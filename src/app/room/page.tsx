"use client";

import {useEffect, useState} from "react";
import Header from "@/components/Header";
import RoomHero from "@/app/room/components/RoomHero";
import Rooms from "@/app/room/components/Rooms";
import RoomInfo from "@/app/room/components/RoomInfo";
import { cn } from "@/lib/utils";

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


export default function RoomPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState("리프레");
    const [selectedHuntingGround, setSelectedHuntingGround] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<selectedRoom | null>(null);
    const [roomList, setRoomList] = useState();


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

    const testUsers2: users[] = [
        {
            id:5,
            name: "메롱도적",
            level: 166,
            class: "나이트로드"
        },
        {
            id:6,
            name: "최강비숍",
            level: 105,
            class: "클레릭"
        },
        {
            id:7,
            name: "풍선",
            level: 156,
            class: "나이트로드"
        },
        {
            id:8,
            name: "S2닼나",
            level: 172,
            class: "다크나이트"
        },
        {
            id:9,
            name: "샾싸게",
            level: 140,
            class: "사수"
        },
        {
            id:10,
            name: "띱자리히어로",
            level: 110,
            class: "크루세이더"
        }
    ]

    const testSelectedRoom: selectedRoom[] = [
        {
            id: 1,
            title: "망용둥 좌1 우1 구합니다",
            desc: "끈기있게 하실분만 !!!",
            users: testUsers2,
            host: "풍선",
            currentHead: 6,
            maximumHead: 6,
            isFull: true
        },
        {
            id: 2,
            title: "불어둠 좌1 우1 구합니다11111111111",
            desc: "최강 격수보유중",
            users: testUsers,
            host: "불의를못참음",
            currentHead: 4,
            maximumHead: 6,
            isFull: false
        },

    ]

    const testRooms = [
        {
            id: 1,
            title: "망용둥 좌1 우1 구합니다",
            desc: "끈기있게 하실분만 !!!",
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
            desc: "최강 격수보유중",
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

    const continents = [
        {
            name: "리프레",
            grounds: ["망가진 용의 둥지", "위험한 용의 둥지", "남겨진 용의 둥지", "붉은 켄타우르스의 영역", "검은 켄타우르스의 영역", "불과 어둠의 전장"
            , "블루 와이번의 둥지", "다크 와이번의 둥지"],
        },
        {
            name: "엘나스",
            grounds: ["차가운 벌판2",],
        },
        {
            name: "아쿠아리움",
            grounds: ["위험한 바다 협곡", "깊은 바다 협곡"],
        },
        {
            name: "루디브리엄",
            grounds: ["시간의길4", "시간의길1","마스터 데스 테니"],
        }
    ];

    useEffect(() => {
        if(selectedRoomId !== null){
            const room = testSelectedRoom.find((room) => room.id === selectedRoomId);
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
        <div className="min-h-screen bg-white ">
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
                    "max-w-6xl mx-auto transition-all duration-500 mt-6 gap-6 px-6",
                    selectedRoom
                        ? "flex flex-col lg:flex-row items-start "
                        : "flex flex-col items-center"
                )}
            >
                {selectedRoom && (
                    <div className="lg:w-3/6 animate-slide-in-left ">
                        <RoomInfo room={selectedRoom}
                                  onClose={handleRoomInfoClose}
                        />
                    </div>
                )}

                <div className={cn(selectedRoom ? "lg:w-3/6 animate-slide-in-left" : "w-full max-w-3xl ")}>
                    <Rooms
                        roomList={testRooms}
                        handleRoomSelect={handleRoomSelect}
                        selectedRoom={selectedRoom}
                    />
                </div>
            </div>
        </div>
    );
}

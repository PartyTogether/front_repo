"use client";

import { useState } from "react";
import Header from "@/components/Header";
import RoomHero from "@/components/RoomHero";
import Rooms from "@/components/Rooms";

export default function RoomPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState("리프레");
    const [selectedHuntingGround, setSelectedHuntingGround] = useState("");

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

    return (
        <div className="min-h-screen bg-gradient-to-b ">
            <Header onMenuClick={() => setMenuOpen(true)} />

            <RoomHero
                continents={continents}
                selectedContinent={selectedContinent}
                setSelectedContinent={setSelectedContinent}
                selectedHuntingGround={selectedHuntingGround}
                setSelectedHuntingGround={setSelectedHuntingGround}
            />

            <Rooms
                selectedContinent={selectedContinent}
                selectedHuntingGround={selectedHuntingGround}
            />
        </div>
    );
}

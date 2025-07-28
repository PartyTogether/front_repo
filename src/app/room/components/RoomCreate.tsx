"use client";

import { createRoomReq } from '../RoomTypes';
import { useState } from "react";
import { createRoom } from "@/lib/api/rooms";
import { cn } from "@/lib/utils";
import { tw } from "@/styles/common";
import { Continent } from '@/app/room/RoomTypes';



interface RoomMakeProps {
    continents: Continent[];
}

export default function RoomCreate({ continents }: RoomMakeProps) {
    const [roomTitle, setRoomTitle] = useState("");
    const [roomDesc, setRoomDesc] = useState("");
    const [roomMinLevel, setRoomMinLevel] = useState(1);
    const [roomMaxMembers, setRoomMaxMembers] = useState(2);
    const [roomMinTime, setRoomMinTime] = useState<string>('1');
    const [roomChannel, setRoomChannel] = useState("");
    const [roomContinent, setRoomContinent] = useState("리프레")
    const [roomHuntingGround, setRoomHuntingGround] = useState("");

    const style = {
        flex_col:"flex flex-col",
        flex_row:"flex flex-row",
        topOptions:"space-x-4",
        container: " p-6 bg-white rounded-lg shadow-md border border-gray-200",
        title: "text-center text-2xl font-bold mb-6 text-gray-800",
        formContainer: "items-center space-y-6",
        input: "w-120 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition",
        inputGroup: "space-x-4",
        halfInput: "w-30 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition",
        label: "block ml-1 mb-2 font-medium text-gray-700",
        timeButtonContainer: "flex space-x-2",
        timeButton: "px-4 py-2 rounded-lg font-medium transition",
        activeTimeButton: "bg-indigo-500 text-white shadow-sm",
        inactiveTimeButton: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        createButton: "w-full p-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition shadow-sm",
        select: "w-50 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition",
        groundsGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mt-4",
        groundButton: "p-3 border border-gray-200 rounded-lg text-center font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 transition cursor-pointer",
        selectedGroundButton: "bg-indigo-500 text-white border-indigo-500 hover:text-indigo-500",
        charCount: "text-sm text-gray-500 ml-110",
    }

    const handleCreateRoom = async () => {
        const roomData: createRoomReq = {
            roomTitle,
            roomDesc,
            roomMinLevel,
            roomMaxMembers,
            roomMinTime,
            roomChannel,
            roomHuntingGround,
        };
        console.log(roomData);
        try{
            const data = await createRoom(roomData);
        } catch (err){
            console.error(err);
        }

    };

    return (
        <div className={style.container}>
            <h2 className={style.title}>방 만들기</h2>
            <div className={style.formContainer}>

                <div className={cn(style.flex_row, style.topOptions)}>
                    <div>
                        <label className={style.label}>대륙 선택</label>
                        <select
                            value={roomContinent}
                            onChange={(e) => {
                                setRoomContinent(e.target.value);
                                setRoomHuntingGround("");
                            }}
                            className={style.select}
                        >
                            {continents.map((cont) => (
                                <option key={cont.continentName} value={cont.continentName}>
                                    {cont.continentName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={style.label}>최소 레벨</label>
                        <input
                            type="number"
                            placeholder="최소 레벨"
                            value={roomMinLevel}
                            onChange={(e) => setRoomMinLevel(parseInt(e.target.value))}
                            className={style.halfInput}
                        />
                    </div>

                    <div>
                        <label className={style.label}>최대 인원수</label>
                        <select
                            value={roomMaxMembers}
                            onChange={(e) => setRoomMaxMembers(parseInt(e.target.value))}
                            className={style.halfInput}
                        >
                            {[2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                    {num}명
                                </option>
                            ))}
                        </select>
                    </div>

                </div>


                {roomContinent && (
                    <div>
                        <label className={style.label}>사냥터</label>
                        <div className={style.groundsGrid}>
                            {continents
                                .find((c) => c.continentName === roomContinent)
                                ?.huntingGrounds.map((ground) => (
                                    <div
                                        key={ground.huntingGroundName}
                                        onClick={() => setRoomHuntingGround(ground.huntingGroundName)}
                                        className={cn(style.groundButton,
                                            roomHuntingGround === ground.huntingGroundName ? style.selectedGroundButton : '')
                                        }
                                    >
                                        {ground.huntingGroundName}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                <div>
                    <label className={style.label}>방 제목</label>
                    <input
                        type="text"
                        placeholder="방 제목"
                        value={roomTitle}
                        onChange={(e) => setRoomTitle(e.target.value.slice(0, 40))}
                        className={style.input}
                    />
                    <p className={style.charCount}>{roomTitle.length} / 40</p>
                </div>
                <div>
                    <input
                        placeholder="설명"
                        value={roomDesc}
                        onChange={(e) => setRoomDesc(e.target.value.slice(0, 40))}
                        className={style.input}
                    />
                    <p className={style.charCount}>{roomDesc.length} / 40</p>
                </div>

                <div>
                    <label className={style.label}>최소 사냥 시간</label>
                    <div className={style.timeButtonContainer}>
                        {['1', '2', '3', "상관없음"].map((time) => (
                            <button
                                key={time}
                                onClick={() => setRoomMinTime(time)}
                                className={`${style.timeButton} ${
                                    roomMinTime === time ? style.activeTimeButton : style.inactiveTimeButton
                                }`}
                            >
                                {typeof time === 'number' ? `${time}시간` : time}
                            </button>
                        ))}
                    </div>
                </div>
                <label className={style.label}>채널</label>
                <input
                    type="text"
                    placeholder="채널"
                    value={roomChannel}
                    onChange={(e) => setRoomChannel(e.target.value)}
                    className={style.halfInput}
                />
                <button
                    onClick={handleCreateRoom}
                    className={style.createButton}
                >
                    방 만들기
                </button>
            </div>
        </div>
    );
}

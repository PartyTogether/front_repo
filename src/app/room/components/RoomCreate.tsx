"use client";

import { createRoomReq, Continent } from '../RoomTypes';
import { useState, useMemo } from "react";
import { createRoom } from "@/lib/api/rooms";
import { cn } from "@/lib/utils";

interface PositionOption {
    comment: string;
    isRecruiting: boolean;
}

interface RoomMakeProps {
    continents: Continent[];
}

interface ParsedPositions {
    floors: Record<string, Record<string, string[]>>;
    support: string[];
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
    const [positionOptions, setPositionOptions] = useState<Record<string, PositionOption>>({});

    const formatPosition = (position: string) => {
        if (position === "서폿") return "서포터";
        const floor = position.charAt(0);
        const direction = position.charAt(1);
        if (direction === "좌") return `${floor}층 좌측`;
        if (direction === "우") return `${floor}층 우측`;
        if (direction === "중") return `${floor}층 중앙`;
        if (direction === "층") return `${floor}층 전체`;
        return position;
    };

    const parsedPositions = useMemo(() => {
        const ground = continents
            .find(c => c.continentName === roomContinent)
            ?.huntingGrounds.find(g => g.huntingGroundName === roomHuntingGround);

        if (!ground) return { floors: {}, support: [] };

        const parsed = ground.positions.reduce<ParsedPositions>((acc, pos) => {
            if (pos === "서폿") {
                acc.support.push(pos);
                return acc;
            }

            const floor = pos.match(/^(\d+)/)?.[1];
            const location = pos.match(/[가-힣]+$/)?.[0];

            if (floor && location) {
                if (!acc.floors[floor]) {
                    acc.floors[floor] = { left: [], center: [], right: [], full: [] };
                }
                if (location === '좌') acc.floors[floor].left.push(pos);
                else if (location === '우') acc.floors[floor].right.push(pos);
                else if (location === '중') acc.floors[floor].center.push(pos);
                else if (location === '층') acc.floors[floor].full.push(pos);
            }
            return acc;
        }, { floors: {}, support: [] });

        const sortedFloors = Object.keys(parsed.floors).sort((a, b) => parseInt(a) - parseInt(b));
        const orderedFloors: Record<string, any> = {};
        for (const floor of sortedFloors) {
            orderedFloors[floor] = parsed.floors[floor];
        }
        parsed.floors = orderedFloors;

        return parsed;
    }, [roomContinent, roomHuntingGround, continents]);

    const handleHuntingGroundClick = (groundName: string) => {
        setRoomHuntingGround(groundName);
        setPositionOptions({});
    };

    const handlePositionOptionChange = (position: string, field: keyof PositionOption, value: string | boolean) => {
        setPositionOptions(prev => ({
            ...prev,
            [position]: {
                ...(prev[position] || { comment: '', isRecruiting: true }),
                [field]: value,
            }
        }));
    };

    const style = {
        flex_col: "flex flex-col",
        flex_row: "flex flex-row",
        topOptions: "space-x-4",
        container: "p-6 bg-white rounded-2xl shadow-lg border border-gray-200",
        title: "text-center text-3xl font-bold mb-8 text-gray-800",
        formContainer: "items-center space-y-8",
        input: "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
        halfInput: "w-30 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
        label: "block ml-1 mb-2 font-semibold text-gray-600",
        timeButtonContainer: "flex space-x-2",
        timeButton: "px-5 py-2 rounded-lg font-medium transition-all duration-200",
        activeTimeButton: "bg-indigo-600 text-white shadow-md",
        inactiveTimeButton: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        createButton: "w-full p-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl",
        select: "w-50 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
        groundsGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4",
        groundButton: "p-3 border border-gray-200 rounded-lg text-center font-medium text-gray-700 hover:bg-indigo-100 hover:border-indigo-500 transition-all duration-200 cursor-pointer",
        selectedGroundButton: "bg-indigo-600 text-white border-indigo-500 shadow-md",
        charCount: "text-sm text-gray-500 text-right mt-1",
        positionSectionContainer: "col-span-full space-y-8 mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200",
        floorContainer: "p-5 rounded-lg bg-white shadow-sm border border-gray-200",
        floorTitle: "text-2xl font-bold mb-5 text-gray-700 border-b-2 border-gray-200 pb-3",
        positionGrid: "grid gap-5",
        positionCard: "p-5 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        positionCardRecruiting: "bg-white border-indigo-300",
        positionCardNotRecruiting: "bg-gray-100 border-gray-200 text-gray-400 opacity-70",
        positionTitle: "font-bold text-xl mb-3 text-gray-800",
        positionTitleNotRecruiting: "line-through text-gray-500",
        positionCommentInput: "w-full p-2 mt-2 border-gray-500 rounded-md bg-gray-100 focus:bg-white transition-all duration-200",
        positionRecruitToggle: "mt-3 flex items-center text-sm text-gray-600",
        fullFloorCard: "col-span-1 sm:col-span-2 md:col-span-3",
        supportContainer: "p-5 rounded-lg bg-gray-100 border border-gray-200 shadow-sm",
    }

    const handleCreateRoom = async () => {
        const selectedPositions = Object.entries(positionOptions)
            .filter(([_, option]) => option.isRecruiting)
            .map(([position, _]) => position);

        const roomPositionComments = Object.entries(positionOptions)
            .filter(([_, option]) => option.isRecruiting && option.comment)
            .reduce((acc, [position, option]) => {
                acc[position] = option.comment;
                return acc;
            }, {} as Record<string, string>);

        const roomData: createRoomReq = {
            roomTitle,
            roomDesc,
            roomMinLevel,
            roomMaxMembers,
            roomMinTime,
            roomChannel,
            roomHuntingGround,
            roomPositions: selectedPositions,
            roomPositionComments,
        };
        console.log(roomData);
        try{
            const data = await createRoom(roomData);
        } catch (err){
            console.error(err);
        }
    };

    const renderPositionCard = (pos: string) => {
        const options = positionOptions[pos] || { comment: '', isRecruiting: true };
        const isRecruiting = options.isRecruiting;

        return (
            <div key={pos} className={cn(style.positionCard, isRecruiting ? style.positionCardRecruiting : style.positionCardNotRecruiting)}>
                <h4 className={cn(style.positionTitle, !isRecruiting && style.positionTitleNotRecruiting)}>{formatPosition(pos)}</h4>
                <input
                    type="text"
                    placeholder="코멘트"
                    value={options.comment}
                    onChange={(e) => handlePositionOptionChange(pos, 'comment', e.target.value)}
                    className={style.positionCommentInput}
                    disabled={!isRecruiting}
                />
                <div className={style.positionRecruitToggle}>
                    <input
                        type="checkbox"
                        id={`recruit-${pos}`}
                        checked={!isRecruiting}
                        onChange={(e) => handlePositionOptionChange(pos, 'isRecruiting', !e.target.checked)}
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded-sm transition duration-150 ease-in-out focus:ring-indigo-500"
                    />
                    <label htmlFor={`recruit-${pos}`} className="ml-2">모집 안 함</label>
                </div>
            </div>
        );
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
                                        onClick={() => handleHuntingGroundClick(ground.huntingGroundName)}
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

                {roomHuntingGround && (
                    <div className={style.positionSectionContainer}>
                        {Object.entries(parsedPositions.floors).map(([floor, positions]) => {
                            const floorPositions = [ ...positions.full, ...positions.left, ...positions.center, ...positions.right];
                            const gridCols = positions.full.length > 0 ? 1 : (positions.left.length > 0 ? 1 : 0) + (positions.center.length > 0 ? 1 : 0) + (positions.right.length > 0 ? 1 : 0);
                            return (
                                <div key={floor} className={style.floorContainer}>
                                    <h3 className={style.floorTitle}>{floor}층</h3>
                                    <div className={cn(style.positionGrid, `grid-cols-${gridCols}`)}>
                                        {positions.full.map(pos => (
                                            <div key={pos} className={style.fullFloorCard}>
                                                {renderPositionCard(pos)}
                                            </div>
                                        ))}
                                        {positions.left.length > 0 && <div className="space-y-4">{positions.left.map(renderPositionCard)}</div>}
                                        {positions.center.length > 0 && <div className="space-y-4">{positions.center.map(renderPositionCard)}</div>}
                                        {positions.right.length > 0 && <div className="space-y-4">{positions.right.map(renderPositionCard)}</div>}
                                    </div>
                                </div>
                            );
                        })}
                        {parsedPositions.support.length > 0 && (
                            <div className={cn(style.supportContainer, "max-w-md mx-auto")}>
                                <h3 className={style.floorTitle}>심</h3>
                                <div className="flex flex-wrap gap-5 justify-center">
                                    {parsedPositions.support.map(renderPositionCard)}
                                </div>
                            </div>
                        )}
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
    )
}
;

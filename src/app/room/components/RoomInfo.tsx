import { FaCrown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { memberSkill, selectedRoom, applyToRoomReq } from '@/app/room/RoomTypes';
import { applyToRoom, leaveToRoom } from "@/lib/api/rooms";
import Swal from 'sweetalert2';

interface RoomInfoProps {
    room: selectedRoom;
    isLoggedIn: boolean;
    onClose: () => void;
    viewMode: string;
    onLeaveSuccess: () => void;
}

export default function RoomInfo({ room, isLoggedIn, onClose, viewMode, onLeaveSuccess }: RoomInfoProps) {
    const hostMember = room.roomMembers.find((member) => member.memberId === room.roomHost);
    const [isClosing, setIsClosing] = useState(false);

    const groupedPositions: { [key: string]: typeof room.roomPositions } = {
        '1층': [],
        '2층': [],
        '3층': [],
        '서폿': [],
    };

    room.roomPositions.forEach(position => {
        if (position.positionName.startsWith('1')) {
            groupedPositions['1층'].push(position);
        } else if (position.positionName.startsWith('2')) {
            groupedPositions['2층'].push(position);
        } else if (position.positionName === '3층') {
            groupedPositions['3층'].push(position);
        } else if (position.positionName.includes('서폿')) {
            groupedPositions['서폿'].push(position);
        }
    });

    const style = {
        roomInfoDiv: "bg-white p-4 rounded-lg shadow h-fit sticky transition-transform transition-opacity duration-300",
        isClosingTrueAnimate: "animate-slide-out-right",
        isClosingFalseAnimate: "animate-slide-in-left",
        closeBtn: "absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none",
        titleDiv: "flex border-b items-center justify-between border-gray-300 mb-5",
        title: "text-xl font-bold w-100",
        headCount: "flex p-4 mr-1 font-semibold gap-2 text-gray-500 whitespace-nowrap",
        hostDiv: "flex items-center justify-center mb-5 pb-5 px-2 gap-2 text-gray-500 font-semibold border-b border-gray-300",
        floorSection: "mb-4 last:mb-0",
        floorTitle: "text-lg font-bold text-gray-800 mb-2",
        positionGrid: "grid gap-2",
        positionCard: "border rounded-lg p-2 text-center",
        positionCardRecruiting: "border-blue-400 bg-blue-50",
        positionCardFilled: "border-gray-300 bg-gray-50",
        positionNameText: "font-semibold text-gray-700",
        positionStatusText: "text-sm",
        positionStatusRecruiting: "text-blue-600",
        positionStatusFilled: "text-gray-500",
        positionMemberText: "text-xs text-gray-600 mt-1 flex items-center justify-center gap-1",
        positionCommentText: "text-xs text-gray-500 mt-1",
        applyBtn: "mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm",
    }

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipContent, setTooltipContent] = useState<memberSkill[]>([]);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, skills: memberSkill[]) => {
        setTooltipContent(skills);
        setShowTooltip(true);
        setTooltipPosition({ x: e.currentTarget.offsetLeft, y: e.currentTarget.offsetTop + e.currentTarget.offsetHeight });
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        setTooltipContent([]);
    };

    const handleCloseClick = () => {
        setIsClosing(true);
    };

    const handleApply = async (positionName: string) => {
        if(!isLoggedIn){
            await Swal.fire({icon:'error', title: '신청 실패', text: '로그인이 필요한 기능입니다.', confirmButtonColor: '#3085d6', confirmButtonText: '확인'});
            return;
        }
        const applyToRoomReqData: applyToRoomReq = {
            roomId: room.roomId,
            roomPositionName: positionName,
        }
        try {
            await applyToRoom(applyToRoomReqData);
            await Swal.fire({ icon: 'success', title: '신청 완료', text: '파티 가입 신청이 완료되었습니다.', confirmButtonColor: '#3085d6', confirmButtonText: '확인' });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
            await Swal.fire({ icon: 'error', title: '신청 실패', text: errorMessage, confirmButtonColor: '#3085d6', confirmButtonText: '확인' });
        }
    };

    const handleLeave = async () => {
        const result = await Swal.fire({ icon: 'warning', title: '파티 떠나기', text: '정말로 파티를 떠나시겠습니까?', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: '떠나기', cancelButtonText: '취소' });

        if (result.isConfirmed) {
            try {
                await leaveToRoom();
                await Swal.fire('완료', '파티를 떠났습니다.', 'success');
                onLeaveSuccess();
                onClose();
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
                await Swal.fire('실패', errorMessage, 'error');
            }
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isClosing) {
            timer = setTimeout(() => {
                onClose();
            }, 300);
        }
        return () => clearTimeout(timer);
    }, [isClosing, onClose]);

    return (
        <div className={cn(
            style.roomInfoDiv,
            isClosing ? style.isClosingTrueAnimate : style.isClosingFalseAnimate
        )}
        >
            <button
                onClick={handleCloseClick}
                className={style.closeBtn}
                aria-label="Close"
            >
                <IoMdClose size={24} />
            </button>
            <div className={style.titleDiv}>
                <h2 className={style.title}>
                    {room.roomTitle}
                </h2>
                <div className={style.headCount}>
                    <Image
                        src="/orange_mushroom.png"
                        alt="주황버섯"
                        width={30}
                        height={20}
                    />
                    {room.roomCurrentMembers} / {room.roomMaxMembers}
                </div>
            </div>

            {hostMember && (
                <div className={style.hostDiv}>
                    <FaCrown className="text-yellow-400" />
                    {hostMember.memberLevel}Lv {hostMember.memberClass} {hostMember.memberName}
                </div>
            )}

            <div className="mt-5">
                {Object.entries(groupedPositions).map(([floor, positions]) => {
                    if (positions.length === 0) return null;

                    const getGridColsClass = (count: number) => {
                        switch (count) {
                            case 1:
                                return "grid-cols-1";
                            case 2:
                                return "grid-cols-2";
                            case 3:
                                return "grid-cols-3";
                            default:
                                return "grid-cols-3";
                        }
                    };

                    const gridColsClass = getGridColsClass(positions.length);
                    const isSinglePosition = positions.length === 1;

                    return (
                        <div key={floor} className={style.floorSection}>
                            <h3 className={style.floorTitle}>{floor}</h3>
                            <div className={cn(style.positionGrid, gridColsClass)}>
                                {positions.map((position) => (
                                    <div
                                        key={position.positionName}
                                        className={cn(
                                            style.positionCard,
                                            position.positionStatus === "모집중" ? style.positionCardRecruiting : style.positionCardFilled,
                                            position.positionName === "3층" && "col-span-3",
                                            isSinglePosition && "col-span-3"
                                        )}
                                    >
                                        <div className={style.positionNameText}>{position.positionName}</div>
                                        <div className={cn(
                                            style.positionStatusText,
                                            position.positionStatus === "모집중" ? style.positionStatusRecruiting : style.positionStatusFilled
                                        )}>
                                            {position.positionStatus}
                                        </div>
                                        {position.member ? (
                                            <div
                                                className={style.positionMemberText}
                                                onMouseEnter={(e) => position.member && handleMouseEnter(e, position.member.memberSkills)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {position.member.memberLevel}Lv {position.member.memberClass} {position.member.memberName}
                                                {hostMember && position.member.memberId === hostMember.memberId && (
                                                    <FaCrown className="text-yellow-400" />
                                                )}
                                            </div>
                                        ) : (
                                            position.positionStatus === "모집중" && viewMode === 'OTHER_PARTY' ? (
                                                <button
                                                    onClick={() => handleApply(position.positionName)}
                                                    className={style.applyBtn}
                                                >
                                                    가입 신청
                                                </button>
                                            ) : (
                                                <div className={style.positionCommentText}>{position.positionComment || "-"}</div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {viewMode === 'MY_PARTY' && (
                <div className="mt-4">
                    <button
                        onClick={handleLeave}
                        className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        파티 떠나기
                    </button>
                </div>
            )}

            {showTooltip && (
                <div
                    className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-50"
                    style={{ top: tooltipPosition.y, left: tooltipPosition.x }}
                >
                    {tooltipContent.length > 0 ? (
                        tooltipContent.map((skill, index) => (
                            <div key={index} className="flex items-center gap-1">
                                {skill.skillImage && <Image src={skill.skillImage} alt={skill.skillName} width={16} height={16} />}
                                <span>{skill.skillName} ({skill.memberSkillLevel})</span>
                            </div>
                        ))
                    ) : (
                        <span>스킬 정보 없음</span>
                    )}
                </div>
            )}
        </div>
    );
}


import { FaCrown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { tw } from "@/styles/common";
import Image from "next/image";
import { member, selectedRoom } from '@/app/room/RoomTypes';


interface RoomInfoProps {
    room: selectedRoom;
    onClose: () => void;
}

export default function RoomInfo({ room, onClose }: RoomInfoProps) {
    const hostMember = room.roomMembers.find((member) => member.memberName === room.roomHost);
    const otherMembers = room.roomMembers.filter((member) => member.memberName !== room.roomHost);
    const [isClosing, setIsClosing] = useState(false);


    const style = {
        roomInfoDiv: "bg-white p-4 rounded-lg shadow h-fit sticky transition-transform transition-opacity duration-300",
        isClosingTrueAnimate: "animate-slide-out-right",
        isClosingFalseAnimate: "animate-slide-in-left",
        closeBtn: "absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none",
        titleDiv: "flex border-b items-center justify-between border-gray-300 mb-5",
        title: "text-xl font-bold w-100",
        headCount: "flex p-4 mr-1 font-semibold gap-2 text-gray-500",
        hostDiv: "flex items-center justify-center mb-5 pb-5 px-2 gap-2 text-gray-500 font-semibold border-b border-gray-300",
        partnerListDiv: "grid grid-cols-1 gap-2",
        partnerDiv: "border border-gray-300 rounded-lg text-left py-2 px-2 text-gray-500 font-medium",
    }

    const handleCloseClick = () => {
        setIsClosing(true);

    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isClosing) {
            timer = setTimeout(() => {
                onClose();
            }, 300);
        }
        return () => clearTimeout(timer);
    }, [isClosing]);


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
                <div
                    className={style.hostDiv}>
                    <FaCrown className="text-yellow-400" />
                    {hostMember.memberLevel}Lv {hostMember.memberClass} {hostMember.memberName}
                </div>
            )}

            <div className={style.partnerListDiv}>
                {otherMembers.map((member) => (
                    <div
                        key={member.memberId}
                        className={style.partnerDiv}
                    >
                        {member.memberLevel}Lv {member.memberClass} {member.memberName}
                    </div>
                ))}
            </div>
            <div className={cn(tw.acceptBtn,"mt-5")}>
                가입 신청
            </div>
        </div>
    );
}

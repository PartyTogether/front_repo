import { FaCrown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { tw } from "@/styles/common";
import Image from "next/image";

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

interface RoomInfoProps {
    room: selectedRoom;
    onClose: () => void;
}

export default function RoomInfo({ room, onClose }: RoomInfoProps) {
    const hostUser = room.users.find((user) => user.name === room.host);
    const otherUsers = room.users.filter((user) => user.name !== room.host);
    const [isClosing, setIsClosing] = useState(false);

    const style = {
        roomInfoDiv: "bg-white p-5 rounded-lg shadow h-fit sticky transition-transform transition-opacity duration-300",
        isClosingTrueAnimate: "animate-slide-out-right",
        isClosingFalseAnimate: "animate-slide-in-left",
        closeBtn: "absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none",
        titleDiv: "flex border-b items-center justify-between border-gray-300 mb-5",
        title: "text-xl font-bold",
        headCount: "flex p-4 mr-1 font-semibold gap-2 text-gray-500",
        hostDiv: "flex items-center justify-center mb-5 pb-5 px-2 gap-2 text-gray-500 font-semibold border-b border-gray-200",
        partnerListDiv: "grid grid-cols-2 gap-2",
        partnerDiv: "border border-gray-200 rounded-lg text-left py-2 px-2 text-gray-500 font-medium",
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
                    {room.title}
                </h2>
                <div className={style.headCount}>
                    <Image
                        src="/orange_mushroom.png"
                        alt="주황버섯"
                        width={30}
                        height={20}
                    />
                    {room.currentHead} / {room.maximumHead}
                </div>

            </div>


            {hostUser && (
                <div
                    className={style.hostDiv}>
                    <FaCrown className="text-yellow-400" />
                    {hostUser.level}Lv {hostUser.class} {hostUser.name}
                </div>
            )}

            <div className={style.partnerListDiv}>
                {otherUsers.map((user) => (
                    <div
                        key={user.id}
                        className={style.partnerDiv}
                    >
                        {user.level}Lv {user.class} {user.name}
                    </div>
                ))}
            </div>
            <div className={cn(tw.acceptBtn,"mt-5")}>
                가입 신청
            </div>
        </div>
    );
}

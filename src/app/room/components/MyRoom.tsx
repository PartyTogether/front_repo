'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";
import Chat from "./my_room/Chat";
import Applicants from "./my_room/Applicants";
import Settings from "./my_room/Settings";
import { selectedRoom, Applicant } from "../RoomTypes";

interface MyRoomProps{
    room: selectedRoom;
    applicants: Applicant[];
    newApplicantIds: Set<string>;
    onViewApplicants: () => void;
}

export default function MyRoom({ room, applicants, newApplicantIds, onViewApplicants }:MyRoomProps) {
    const [activeTab, setActiveTab] = useState("chat");

    const handleTabClick = (tab: string) => {
        if (tab === 'applicants') {
            onViewApplicants();
        }
        setActiveTab(tab);
    };

    const style = {
        container: "p-4 bg-white rounded-lg shadow-md",
        tabContainer: "flex border-b border-gray-200 mb-4",
        tabButton: "relative py-2 px-4 text-lg font-medium text-gray-500 hover:text-gray-700 focus:outline-none",
        activeTabButton: "border-b-2 border-indigo-500 text-indigo-600",
        contentContainer: "mt-4",
        newIndicator: "absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full",
    };

    const renderContent = () => {
        switch (activeTab) {
            case "chat":
                return <Chat />;
            case "applicants":
                return <Applicants room={room} applicants={applicants} newApplicantIds={newApplicantIds} />;
            case "settings":
                return <Settings />;
            default:
                return null;
        }
    };

    return (
        <section className={style.container}>
            <div className={style.tabContainer}>
                <button
                    className={cn(style.tabButton, activeTab === "chat" && style.activeTabButton)}
                    onClick={() => handleTabClick("chat")}
                >
                    채팅방
                </button>
                <button
                    className={cn(style.tabButton, activeTab === "applicants" && style.activeTabButton)}
                    onClick={() => handleTabClick("applicants")}
                >
                    신청자
                    {newApplicantIds.size > 0 && <span className={style.newIndicator}></span>}
                </button>
                <button
                    className={cn(style.tabButton, activeTab === "settings" && style.activeTabButton)}
                    onClick={() => handleTabClick("settings")}
                >
                    방 옵션 설정
                </button>
            </div>
            <div className={style.contentContainer}>
                {renderContent()}
            </div>
        </section>
    );
}
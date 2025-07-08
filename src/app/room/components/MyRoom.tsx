"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Chat from "./my_room/Chat";
import Applicants from "./my_room/Applicants";
import Settings from "./my_room/Settings";

export default function MyRoom() {
    const [activeTab, setActiveTab] = useState("chat");

    const style = {
        container: "p-4 bg-white rounded-lg shadow-md",
        tabContainer: "flex border-b border-gray-200 mb-4",
        tabButton: "py-2 px-4 text-lg font-medium text-gray-500 hover:text-gray-700 focus:outline-none",
        activeTabButton: "border-b-2 border-indigo-500 text-indigo-600",
        contentContainer: "mt-4",
    };

    const renderContent = () => {
        switch (activeTab) {
            case "chat":
                return <Chat />;
            case "applicants":
                return <Applicants />;
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
                    onClick={() => setActiveTab("chat")}
                >
                    채팅방
                </button>
                <button
                    className={cn(style.tabButton, activeTab === "applicants" && style.activeTabButton)}
                    onClick={() => setActiveTab("applicants")}
                >
                    신청자
                </button>
                <button
                    className={cn(style.tabButton, activeTab === "settings" && style.activeTabButton)}
                    onClick={() => setActiveTab("settings")}
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

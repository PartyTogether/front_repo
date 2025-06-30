"use client";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { Menu } from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 z-50">
            <div className="flex items-center gap-4">
                {/* 모바일용 햄버거 버튼 */}
                <button className="md:hidden" onClick={onMenuClick}>
                    <Menu className="w-6 h-6 text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">메이플랜드 투게더</h1>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold transition">
                <FaDiscord className="w-5 h-5" />
                로그인
            </button>
        </header>
    );
}

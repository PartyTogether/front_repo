"use client";
import {FaDiscord, FaHome, FaSearch} from "react-icons/fa";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname();
    return (
        <header
            className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 z-50">
            <div className="flex items-center gap-4">
                {/* 모바일용 햄버거 버튼 */}
                <button className="md:hidden" onClick={onMenuClick}>
                    <Menu className="w-6 h-6 text-gray-800"/>
                </button>
                <h1 className="text-xl font-bold text-gray-800">메이플랜드 투게더</h1>
            </div>

            <div className="flex items-center gap-10">
                <nav className="md:flex gap-4 text-gray-800 font-semibold ">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 transform text-base transition duration-200 hover:scale-110
                                    px-4 py-2 rounded-full ${pathname === "/"
                                ? "bg-[#5865F2] text-white shadow-lg"
                                : "text-gray-800 hover:bg-gray-100"}
                                `}
                    >
                        <FaHome className={`${pathname === "/" ? "text-white" : "text-gray-800"} w-5 h-5`} />
                        <span>홈</span>
                    </Link>

                    <Link
                        href="/room"
                        className={`flex items-center gap-2 transform text-base transition duration-200 hover:scale-110
                                    px-4 py-2 rounded-full ${pathname === "/room"
                            ? "bg-[#5865F2] text-white shadow-lg"
                            : "text-gray-800 hover:bg-gray-100"}
                                `}
                    >
                        <FaSearch className={`${pathname === "/room" ? "text-white" : "text-gray-800"} w-5 h-5`} />
                        <span>방 찾기</span>
                    </Link>
                </nav>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold transition">
                    <FaDiscord className="w-5 h-5"/>
                    로그인
                </button>
            </div>


        </header>
    );
}

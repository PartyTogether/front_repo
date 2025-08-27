"use client";
import { useEffect, useState, useRef } from "react";
import {FaBaby, FaDiscord, FaHome, FaPaperclip, FaSearch} from "react-icons/fa";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authMe, logout } from "@/lib/api/auth";
import {getMemberInfo} from "@/lib/api/member";
import {FaCircleCheck} from "react-icons/fa6";

interface Member {
    id: string;
    globalName: string;
    memberName: string;
    avatar: string | null;
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname();
    const [member, setMember] = useState<Member | null>(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태 추가
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getMember = async () => {
            try {
                const res = await authMe();
                console.log("res : ", res);
                setMember(
                    { id: res.id,
                      globalName: res.globalname,
                      memberName: res.username,
                      avatar: res.avatar
                    });
                setIsLogin(true);
            } catch (error) {
                setMember(null);
                setIsLogin(false);
            }
        };

        const checkTokenAndGetMember = () => {
            const cookies = document.cookie;
            const hasToken = cookies.length > 0 && cookies.includes('auth_status');
            if (hasToken) {
                getMember();
            } else {
                setMember(null);
                setIsLogin(false);
            }
        };

        checkTokenAndGetMember();
    }, []);


    const loginHandler = async () => {
        window.location.href = "http://localhost:5000/auth/discord";
    };

    const logoutHandler = async () => {
        try {
            const res = await logout();
            console.log("logout res : ", res);
            if(res.status === 200)  {
                setMember(null);
                setIsLogin(false);
                window.location.href = process.env.NEXT_PUBLIC_REFRESH_URL!;
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            setMember(null);
            setIsLogin(false);
            alert("로그아웃 중 오류 발생");
        }
    };

    // ... 위에 import 및 useState 부분 동일

    const renderAuthButton = () => {
        if (isLogin && member) {
            return (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2] hover:bg-[#4752c4] transition"
                    >
                        {/* 프로필 이미지 */}
                        <img
                            src={process.env.NEXT_PUBLIC_AVATAR_IMAGE_BASE! + member.id + "/" + member.avatar + ".png" || ""}
                            alt="프로필"
                            className="w-7 h-7 rounded-full border border-gray-300 object-cover"
                        />
                        {/* 닉네임 */}
                        <span className="font-semibold text-white">{member.globalName}</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute left-0.5 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            <Link
                                href="/member"
                                className={`block w-auto mx-auto text-center px-4 py-2 text-m hover:bg-gray-100`}
                            >
                                <span>프로필</span>
                            </Link>
                            <button
                                onClick={logoutHandler}
                                className="block w-auto mx-auto text-center px-4 py-2 text-m hover:bg-gray-100"
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold transition"
                onClick={loginHandler}
            >
                <FaDiscord className="w-5 h-5" />
                로그인
            </button>
        );
    };

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 z-50">
            <div className="flex items-center gap-4">
                <button
                    className={`${pathname === "/" ? "md:hidden" : "hidden"} `}
                    onClick={onMenuClick}
                >
                    <Menu className="w-6 h-6 text-gray-800" />
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
                            : "text-gray-800 hover:bg-gray-100"}`}
                    >
                        <FaHome
                            className={`${pathname === "/" ? "text-white" : "text-gray-800"} w-5 h-5`}
                        />
                        <span>홈</span>
                    </Link>

                    <Link
                        href="/room"
                        className={`flex items-center gap-2 transform text-base transition duration-200 hover:scale-110
                      px-4 py-2 rounded-full ${pathname === "/room"
                            ? "bg-[#5865F2] text-white shadow-lg"
                            : "text-gray-800 hover:bg-gray-100"}`}
                    >
                        <FaSearch
                            className={`${pathname === "/room" ? "text-white" : "text-gray-800"} w-5 h-5`}
                        />
                        <span>방 찾기</span>
                    </Link>
                </nav>

                {renderAuthButton()}
            </div>
        </header>
    );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { FaDiscord, FaHome, FaSearch } from "react-icons/fa";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import authInstance from "@/lib/api/authInstance";

interface Member {
    id: string;
    memberName: string;
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname();
    const [member, setMember] = useState<Member | null>(null);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const getMember = async () => {
            try {
                const res = await authInstance.get('/auth/me');
                setMember({ id: res.data.id, memberName: res.data.username });
                setIsLogin(true);
            } catch (error) {
                // 토큰이 없거나 만료된 경우
                setMember(null);
                setIsLogin(false);
            }
        };

        // 토큰 존재 여부를 먼저 확인
        const checkTokenAndGetMember = () => {
            // 쿠키에서 토큰 확인
            const cookies = document.cookie;
            const hasToken = cookies.length > 0 && cookies.includes('auth_status');
            if (hasToken) {
                // 토큰이 있을 때만 서버에 사용자 정보 요청
                getMember();
            } else {
                // 토큰이 없으면 로그아웃 상태로 설정
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
            // 서버에서 쿠키를 제거하고 응답을 반환
            await authInstance.get("/auth/logout");
            setMember(null);
            setIsLogin(false);

            alert("로그아웃 하였습니다.");
        } catch (error) {
            console.error("로그아웃 중 오류 발생:", error);
            // 에러가 발생해도 클라이언트 상태는 초기화
            setMember(null);
            setIsLogin(false);
            alert("로그아웃 중 오류 발생");
        }
    };

    // 로딩 중일 때는 로그인 버튼을 비활성화하거나 로딩 표시
    const renderAuthButton = () => {
        if (isLogin && member) {
            return (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-800">
                        {member.memberName} 님
                    </span>
                    <button
                        className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                        onClick={logoutHandler}
                    >
                        로그아웃
                    </button>
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
                            : "text-gray-800 hover:bg-gray-100"}
                      `}
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
                            : "text-gray-800 hover:bg-gray-100"}
                      `}
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
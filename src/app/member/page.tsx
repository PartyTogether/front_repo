// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getMemberInfo } from "@/lib/api/member"; // API 호출 함수
import Header from "@/components/Header"; // 헤더 import
import MemberInfo from "@/app/member/components/MemberInfo";
import MemberUpdate from "@/app/member/components/MemberUpdate";
import { useRouter } from "next/navigation";  // ✅ next/navigation에서 가져오기

export interface Skill {
    name: string;
    masterLevel: number;
    image: string;
    level: number;
}

export interface Member {
    job: string;
    level: number;
    nickName: string;
    offerComment: string;
    skill: Skill[];
}

export default function MemberPage() {
    const [memberInfo, setMemberInfo] = useState<Member | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [update, setUpdate] = useState(false);
    const router = useRouter();  // ✅ 라우터 선언

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const res = await getMemberInfo();

                if (!res || !res.member) {
                    // 로그인 정보가 없으면
                    alert("로그인이 필요합니다. 메인 페이지로 이동합니다.");
                    router.push("/");  // 메인 페이지로 리다이렉트
                    return;
                }

                setMemberInfo(res.member);
            } catch (err) {
                console.error("멤버 정보 가져오기 실패", err);
                alert("오류가 발생하였습니다.");
                router.push("/"); // 메인으로 이동
            }
        };

        fetchMemberInfo();
    }, []);

    if (!memberInfo) {
        return null; // ✅ 아직 memberInfo 없을 때는 아무것도 안 보여줌
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header 렌더링 */}
            <Header onMenuClick={() => setMenuOpen(true)} />

            {update
                ? <MemberUpdate member={memberInfo} />
                : <MemberInfo member={memberInfo} mode={setUpdate} />
            }
        </div>
    );
}

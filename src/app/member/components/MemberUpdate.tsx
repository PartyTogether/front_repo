"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Member } from "@/app/member/page";
import { updateMember } from "@/lib/api/member";
import { useRouter } from "next/navigation";
import { getAllJobs } from "@/lib/api/job";
import { getSkillsByJob } from "@/lib/api/skill";

interface MemberInfoProps {
    member: Member;
}

interface Job {
    name: string;
}

interface Skill {
    name: string;
    image: string;
    masterLevel: number;
    level: number; // 현재 레벨
}

export default function MemberUpdate({ member }: MemberInfoProps) {
    const [changeMember, setChangeMember] = useState<Member>(member);
    const [selectedJob, setSelectedJob] = useState<string>(member.job ?? "");
    const [jobs, setJobs] = useState<Job[]>([]);
    const router = useRouter();

    // 전체 직업 불러오기
    useEffect(() => {
        const getJobs = async () => {
            const jobList = await getAllJobs();
            setJobs(jobList);
        };
        getJobs();
    }, []);

    // 직업 선택 시 스킬 정보 가져오기
    useEffect(() => {
        if (!selectedJob) return;

        const getSkills = async () => {
            try {
                const skills: Skill[] = await getSkillsByJob(selectedJob);

                // changeMember.skill 업데이트
                setChangeMember(prev => ({
                    ...prev,
                    skill: skills.map(s => ({
                        name: s.name,
                        image: s.image,
                        masterLevel: s.masterLevel,
                        level: 0, // 현재 레벨 초기화
                    })),
                }));
            } catch (err) {
                console.error(err);
            }
        };

        getSkills();
    }, [selectedJob]);

    // 입력값 변경 핸들러
    const handleChange = (key: keyof Member, value: any) => {
        setChangeMember(prev => ({ ...prev, [key]: value }));
    };

    // 업데이트 핸들러
    const updateHandler = async () => {
        try {
            await updateMember(changeMember);
            alert("저장 완료!");
            router.push("/");
        } catch (err) {
            console.error(err);
            alert("업데이트 실패");
        }
    };

    return (
        <div className="flex-grow flex justify-center items-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">프로필</h2>

                {/* 닉네임, 직업, 레벨 */}
                <div className="flex flex-wrap items-center justify-center gap-15 text-xl font-semibold text-gray-800 mb-10">
                    <span className="text-blue-600">
                        Lv :
                        <input
                            className="border-1 rounded-lg text-center w-30"
                            type="number"
                            value={changeMember.level ?? 1}
                            onChange={(e) => handleChange("level", Number(e.target.value))}
                        />
                    </span>
                    <span>
                        닉네임 :
                        <input
                            className="border-1 rounded-lg text-center w-50"
                            type="text"
                            value={changeMember.nickName ?? ""}
                            onChange={(e) => handleChange("nickName", e.target.value)}
                        />
                    </span>
                    <span className="text-gray-600">
                        직업 :
                        <select
                            id="job-select"
                            value={selectedJob}
                            className="border rounded-md px-2 py-1 text-m text-center"
                            onChange={(e) => {
                                setSelectedJob(e.target.value);
                                handleChange("job", e.target.value);
                            }}
                        >
                            <option value="">-- 선택하세요 --</option>
                            {jobs.map((j, index) => (
                                <option key={index} value={j.name}>
                                    {j.name}
                                </option>
                            ))}
                        </select>
                    </span>
                </div>

                {/* 직업 스킬 */}
                <div>
                    {changeMember.skill?.length ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {changeMember.skill.map((s, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <Image
                                        src={s.image}
                                        alt={s.name}
                                        width={50}
                                        height={50}
                                        className="rounded-lg"
                                    />
                                    <div className="flex flex-col flex-1">
                                        <p className="text-lg font-medium text-gray-900">{s.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-600">현재 레벨:</span>
                                            <select
                                                value={s.level}
                                                onChange={(e) => {
                                                    const newLevel = Number(e.target.value);
                                                    setChangeMember(prev => ({
                                                        ...prev,
                                                        skill: prev.skill!.map((skill, i) =>
                                                            i === idx ? { ...skill, level: newLevel } : skill
                                                        ),
                                                    }));
                                                }}
                                                className="border rounded-md px-2 py-1 text-sm"
                                            >
                                                {Array.from({ length: s.masterLevel + 1 }, (_, i) => (
                                                    <option key={i} value={i}>
                                                        Lv.{i}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-sm text-gray-500">
                                                (Master {s.masterLevel})
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">스킬 없음</p>
                    )}
                </div>

                {/* 소개 */}
                <p className="text-xl text-gray-700 mb-10 text-center mt-12">
                    파티 신청글 :
                    <input
                        className="border-1 rounded-lg text-center"
                        type="text"
                        value={changeMember.offerComment ?? ""}
                        onChange={(e) => handleChange("offerComment", e.target.value)}
                    />
                </p>

                {/* 버튼 */}
                <div className="flex justify-center gap-10 mt-12">
                    <button
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
                        onClick={updateHandler}
                    >
                        저장하기
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
}

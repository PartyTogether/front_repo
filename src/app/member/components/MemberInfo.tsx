import Image from "next/image";
import React from "react";
import {Member} from "@/app/member/page";


interface MemberInfoProps {
    member: Member; // props 안에 member를 넣음
    mode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MemberInfo({member, mode} :MemberInfoProps)    {
    return (
        <div className="flex-grow flex justify-center items-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">프로필</h2>

                {/* 닉네임, 직업, 레벨 한 줄 */}
                <div
                    className="flex flex-wrap items-center justify-center gap-36 text-xl font-semibold text-gray-800 mb-10">
                    <span className="text-blue-600">Lv.{member.level}</span>
                    <span>{member.nickName}</span>
                    <span className="text-gray-600">{member.job}</span>
                </div>

                {/* 보유 스킬 */}
                <div>
                    {member.skill?.length ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {member.skill.map((s, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    {/* 스킬 이미지 */}
                                    <Image
                                        src={s.image}
                                        alt={s.name}
                                        width={50}
                                        height={50}
                                        className="rounded-lg"
                                    />
                                    {/* 스킬 정보 + 선택 */}
                                    <div className="flex flex-col flex-1">
                                        <p className="text-lg font-medium text-gray-900">{s.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-600">
                                                현재 레벨:{s.level}
                                            </span>
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
                <p className="text-xl text-gray-700 mb-10 text-center mt-12">파티 신청글 : {member.offerComment}</p>

                {/* 뒤로가기 버튼 */}
                <div className="flex justify-center gap-10 mt-12">
                    <button
                        onClick={() => mode(true)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
                    >
                        수정하기
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
}
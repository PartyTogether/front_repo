import Image from "next/image";
import React from "react";
import {Member} from "@/app/member/page";

interface MemberInfoProps {
    member: Member; // props 안에 member를 넣음
}

export default function MemberUpdate({member} :MemberInfoProps)    {
    //TODO 메이플랜드 모든 직업군 불러오기 (useEffect)
    //TODO 특정 직업군 선택시 해당 직업에 대한 스킬 정보 불러오기!
    //TODO 설정한 값들을 바탕으로 member 정보 Update하기
    
    return (
        <div className="flex-grow flex justify-center items-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">프로필</h2>

                {/* 닉네임, 직업, 레벨 한 줄 */}
                <div
                    className="flex flex-wrap items-center justify-center gap-15 text-xl font-semibold text-gray-800 mb-10">
                    <span className="text-blue-600">Lv : <input className="border-1 rounded-lg text-center w-30" type="text" defaultValue={member.level ?? 1}/></span>
                    <span>닉네임 : <input className="border-1 rounded-lg text-center w-50" type="text" defaultValue={member.nickName ?? "미등록"}/></span>
                    <span className="text-gray-600">직업 : {member.job ?? "초보자"}</span>
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
                                                            현재 레벨:
                                                        </span>
                                            <select
                                                defaultValue={s.level}
                                                className="border rounded-md px-2 py-1 text-sm"
                                            >
                                                {Array.from({length: s.masterLevel + 1}, (_, i) => (
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
                    파티 신청글 : <input className="border-1 rounded-lg text-center" type="text" defaultValue={member.offerComment}/>
                </p>

                {/* 뒤로가기 버튼 */}
                <div className="flex justify-center gap-10 mt-12">
                    <button
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
                    >
                        저장하기
                    </button>
                    <button
                        onClick={() => window.location.href="member"}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out font-semibold"
                    >
                        뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect } from "react";
import { selectedRoom, Applicant } from "@/app/room/RoomTypes";
import { cn } from "@/lib/utils";

interface ApplicantsProps {
    room:selectedRoom;
    applicants: Applicant[];
}

export default function Applicants({ room, applicants } :ApplicantsProps) {
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

    const style = {
        title: "text-xl font-bold mb-4",
        emptyMessage: "text-center py-4 text-gray-500",
        list: "space-y-3",
        listItem: "p-4 border rounded-lg flex justify-between items-center transition-colors hover:bg-gray-50",
        applicantInfo: "flex-grow",
        applicantName: "font-semibold",
        applicantMeta: "text-sm text-gray-500",
        buttonGroup: "flex gap-2 flex-shrink-0 ml-4",
        acceptButton: "px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors",
        rejectButton: "px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors",
        tabContainer: "flex border-b mb-4",
        tabButton: "px-4 py-2 -mb-px border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
        tabButtonActive: "text-indigo-600 border-indigo-600",
    };

    const sortPositions = (positions: string[]) => {
        const koreanOrder: Record<string, number> = { '좌': 1, '중': 2, '우': 3, '층': 4 };
        positions.sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.match(/\d+/)?.[0] || '0');

            if (numA !== numB) {
                return numA - numB;
            }

            const charA = a.replace(/\d+/g, '');
            const charB = b.replace(/\d+/g, '');

            const orderA = koreanOrder[charA] || 99;
            const orderB = koreanOrder[charB] || 99;

            return orderA - orderB;
        });
        return positions;
    }

    const positions = sortPositions(room.roomPositions.length > 0 
        ? room.roomPositions.map(p => p.positionName) 
        : [...new Set(applicants.map(a => a.positionName))]);

    useEffect(() => {
        if (positions.length > 0 && !selectedPosition) {
            setSelectedPosition(positions[0]);
        }
    }, [positions, selectedPosition]);


    const filteredApplicants = applicants.filter(
        (applicant) => applicant.positionName === selectedPosition
    );

    return (
        <div>
            <h3 className={style.title}>신청자 목록 ({applicants.length}명)</h3>
            
            <div className={style.tabContainer}>
                {positions.map((position) => (
                    <button
                        key={position}
                        onClick={() => setSelectedPosition(position)}
                        className={cn(style.tabButton, {
                            [style.tabButtonActive]: selectedPosition === position,
                        })}
                    >
                        {position}
                    </button>
                ))}
            </div>

            {applicants.length === 0 ? (
                <p className={style.emptyMessage}>아직 신청자가 없습니다.</p>
            ) : filteredApplicants.length === 0 ? (
                <p className={style.emptyMessage}>선택된 포지션에 대한 신청이 없습니다.</p>
            ) : (
                <ul className={style.list}>
                    {filteredApplicants.map((applicant) => (
                        <li key={applicant.applicantId} className={style.listItem}>
                            <div className={style.applicantInfo}>
                                <p className={style.applicantName}>
                                    {applicant.memberName} <span className={style.applicantMeta}>Lv.{applicant.memberLevel} {applicant.memberClass}</span>
                                </p>
                            </div>
                            <div className={style.buttonGroup}>
                                <button className={style.acceptButton}>수락</button>
                                <button className={style.rejectButton}>거절</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

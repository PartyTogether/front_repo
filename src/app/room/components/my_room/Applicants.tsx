'use client';

import { useState, useEffect } from "react";
import { selectedRoom, Applicant, AcceptToApply } from "@/app/room/RoomTypes";
import Swal from 'sweetalert2';
import { acceptToApply } from '@/lib/api/rooms';
import { cn } from "@/lib/utils";

interface ApplicantsProps {
    room:selectedRoom;
    applicants: Applicant[];
    newApplicantIds: Set<string>;
}

export default function Applicants({ room, applicants, newApplicantIds }: ApplicantsProps) {
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

    const style = {
        title: "text-xl font-bold mb-4 text-gray-800",
        emptyMessage: "text-center py-8 text-gray-500",
        list: "space-y-4",
        listItem: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md flex justify-between items-center",
        newListItem: "border-red-500",
        applicantInfo: "flex-grow flex items-center gap-4",
        applicantName: "font-semibold text-lg text-gray-900",
        applicantMeta: "text-sm text-gray-600",
        newBadge: "ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full",
        buttonGroup: "flex gap-2 flex-shrink-0 ml-4",
        acceptButton: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-300",
        rejectButton: "px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors shadow-sm",
        tabContainer: "flex border-b mb-4",
        tabButton: "px-4 py-2 -mb-px border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
        tabButtonActive: "text-indigo-600 border-indigo-600 font-semibold",
    };

    const handleAccept = async (applicantId: string, memberName: string) => {
        try {
            await acceptToApply({applicantId});
            Swal.fire(
                '수락 완료!',
                `${memberName}님의 신청을 수락했습니다.`,
                'success'
            );
        } catch (error) {
            console.error('Failed to accept applicant:', error);
            Swal.fire(
                '오류',
                '신청 수락 중 오류가 발생했습니다.',
                'error'
            );
        }
    };

    const handleReject = async (applicantId: string, memberName: string) => {
        try {
            console.log('Rejecting applicant:', applicantId);
            Swal.fire(
                '거절 완료',
                `${memberName}님의 신청을 거절했습니다.`,
                'info'
            );
        } catch (error) {
            console.error('Failed to reject applicant:', error);
            Swal.fire(
                '오류',
                '신청 거절 중 오류가 발생했습니다.',
                'error'
            );
        }
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
        <div className="bg-gray-50 p-4 rounded-lg">
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
                        <li key={applicant.applicantId} className={cn(style.listItem, {[style.newListItem]: newApplicantIds.has(applicant.applicantId)})}>
                            <div className={style.applicantInfo}>
                                <div>
                                    <p className={style.applicantName}>
                                        {applicant.memberName}
                                        {newApplicantIds.has(applicant.applicantId) && <span className={style.newBadge}>New</span>}
                                    </p>
                                    <p className={style.applicantMeta}>Lv.{applicant.memberLevel} {applicant.memberClass}</p>
                                </div>
                            </div>
                            <div className={style.buttonGroup}>
                                <button 
                                    onClick={() => handleAccept(applicant.applicantId,applicant.memberName)}
                                    className={style.acceptButton}
                                >
                                    수락
                                </button>
                                <button 
                                    onClick={() => handleReject(applicant.applicantId, applicant.memberName)}
                                    className={style.rejectButton}
                                >
                                    거절
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
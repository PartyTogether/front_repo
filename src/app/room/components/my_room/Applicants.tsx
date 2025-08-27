'use client';

import { useState, useEffect } from "react";
import { selectedRoom, Applicant } from "@/app/room/RoomTypes";
import { cn } from "@/lib/utils";

interface TestApplicant {
    id: number;
    name: string;
    level: number;
    class: string;
    position: string;
}
interface ApplicantsProps {
    room:selectedRoom;
    applicants: Applicant[];
}

export default function Applicants({ room, applicants } :ApplicantsProps) {
    const [testApplicants, setTestApplicants] = useState<TestApplicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

    const style = {
        loading: "text-center p-4 text-gray-500",
        error: "text-center p-4 text-red-500",
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

    useEffect(() => {
        const fetchApplicants = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // --- 임시 테스트 데이터 ---
                const testData: TestApplicant[] = [
                    { id: 1, name: "헤응전사", level: 120, class: "히어로", position: "1좌" },
                    { id: 2, name: "헤응궁수", level: 115, class: "보우마스터", position: "1우" },
                    { id: 3, name: "헤응법사", level: 130, class: "아크메이지(썬,콜)", position: "2좌" },
                    { id: 4, name: "헤응도적", level: 125, class: "나이트로드", position: "2중" },
                    { id: 5, name: "헤응해적", level: 122, class: "바이퍼", position: "2우" },
                    { id: 6, name: "헤응무사", level: 128, class: "소울마스터", position: "3층" },
                    { id: 7, name: "헤응기사", level: 128, class: "팔라딘", position: "1좌" },
                ];
                await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
                setTestApplicants(testData);
                if (testData.length > 0) {
                    let initialPositions = room.roomPositions.length > 0 
                        ? room.roomPositions.map(p => p.positionName) 
                        : [...new Set(testData.map(a => a.position))];
                    
                    initialPositions = sortPositions(initialPositions);
                    setSelectedPosition(initialPositions[0]);
                }
                // --- 테스트 데이터 끝 ---

            } catch (err) {
                setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplicants();
    }, [room.roomPositions]);

    if (isLoading) {
        return <div className={style.loading}>로딩 중...</div>;
    }

    if (error) {
        return <div className={style.error}>오류: {error}</div>;
    }

    const positions = sortPositions(room.roomPositions.length > 0 
        ? room.roomPositions.map(p => p.positionName) 
        : [...new Set(testApplicants.map(a => a.position))]);

    const filteredApplicants = testApplicants.filter(
        (testApplicant) => testApplicant.position === selectedPosition
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

            {filteredApplicants.length === 0 ? (
                <p className={style.emptyMessage}>선택된 포지션에 대한 신청이 없습니다.</p>
            ) : (
                <ul className={style.list}>
                    {filteredApplicants.map((applicant) => (
                        <li key={applicant.id} className={style.listItem}>
                            <div className={style.applicantInfo}>
                                <p className={style.applicantName}>
                                    {applicant.name} <span className={style.applicantMeta}>Lv.{applicant.level} {applicant.class}</span>
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

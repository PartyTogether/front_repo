"use client";

import { useState, useEffect } from "react";

// API로부터 받아올 신청자 데이터의 타입을 정의합니다.
// 실제 데이터 구조에 맞게 수정해야 합니다.
interface Applicant {
    id: number;
    name: string;
    level: number;
    class: string;
}

export default function Applicants() {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const style = {
        loading: "text-center p-4 text-gray-500",
        error: "text-center p-4 text-red-500",
        container: "divide-y divide-gray-200",
        title: "text-xl font-bold mb-4",
        emptyMessage: "text-center py-4 text-gray-500",
        list: "space-y-3",
        listItem: "p-4 border rounded-lg flex justify-between items-center transition-colors hover:bg-gray-50",
        applicantInfo: "flex-grow",
        applicantName: "font-semibold",
        applicantMeta: "text-sm text-gray-500",
        applicantMessage: "text-gray-600 mt-1",
        buttonGroup: "flex gap-2 flex-shrink-0 ml-4",
        acceptButton: "px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors",
        rejectButton: "px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors",
    };

    useEffect(() => {
        const fetchApplicants = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // --- 임시 테스트 데이터 ---
                const testData: Applicant[] = [
                    { id: 1, name: "헤응전사", level: 120, class: "히어로" },
                    { id: 2, name: "헤응궁수", level: 115, class: "보우마스터" },
                    { id: 3, name: "헤응법사", level: 130, class: "아크메이지(썬,콜)" },
                ];
                await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
                setApplicants(testData);
                // --- 테스트 데이터 끝 ---

            } catch (err) {
                setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplicants();
    }, []);

    if (isLoading) {
        return <div className={style.loading}>로딩 중...</div>;
    }

    if (error) {
        return <div className={style.error}>오류: {error}</div>;
    }

    return (
        <div>
            <h3 className={style.title}>신청자 목록 ({applicants.length}명)</h3>
            {applicants.length === 0 ? (
                <p className={style.emptyMessage}>받은 신청이 없습니다.</p>
            ) : (
                <ul className={style.list}>
                    {applicants.map((applicant) => (
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

'use client';

import { deleteRoom } from "@/lib/api/rooms";
import Swal from "sweetalert2";

interface SettingsProps {
    roomId: string;
}

export default function Settings({ roomId }: SettingsProps) {

    const style = {
        title: "text-lg font-semibold mb-4",
        container: "p-4 border rounded-lg",
        deleteTitle: "font-semibold",
        deleteDescription: "text-sm text-gray-500 mb-2",
        deleteButton: "w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600",
    };

    const handleDeleteRoom = async () => {
        const result = await Swal.fire({
            title: '정말로 파티를 삭제하시겠습니까?',
            text: "이 작업은 되돌릴 수 없습니다!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        });

        if (result.isConfirmed) {
            try {
                await deleteRoom(roomId);
                await Swal.fire(
                    '삭제 완료!',
                    '파티가 성공적으로 삭제되었습니다.',
                    'success'
                );
                window.location.href = '/room';
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
                await Swal.fire(
                    '오류',
                    errorMessage,
                    'error'
                );
            }
        }
    };

    return (
        <div>
            <h2 className={style.title}>방 설정</h2>
            <div className={style.container}>
                <h3 className={style.deleteTitle}>파티 삭제</h3>
                <p className={style.deleteDescription}>파티를 삭제하면 모든 정보가 영구적으로 사라집니다.</p>
                <button
                    onClick={handleDeleteRoom}
                    className={style.deleteButton}
                >
                    파티 삭제하기
                </button>
            </div>
        </div>
    );
}

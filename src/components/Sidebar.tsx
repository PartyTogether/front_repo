export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-gray-200 fixed left-0 top-0 px-4 py-6">
            <h2 className="text-xl font-bold mb-4">메이플랜드</h2>
            <ul className="space-y-2">
                <li>홈</li>
                <li>채팅방</li>
                <li>파티찾기</li>
            </ul>
        </aside>
    );
}

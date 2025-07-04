import { Home, MessageSquare, Users } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* PC용 고정 사이드바 */}
            <aside className="hidden md:block w-55 fixed top-16 left-0 h-[calc(100vh-4rem)] border border-gray-200 rounded-2xl bg-[#5865F2] text-white px-10 py-8 shadow-lg">
                <h2 className="text-2xl font-extrabold mb-8 tracking-tight">메투</h2>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-300 transition"
                            >
                                <span className="text-sm font-medium">리프레</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-300 transition"
                            >
                                <span className="text-sm font-medium">엘나스</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-300 transition"
                            >
                                <span className="text-sm font-medium">오르비스</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* 모바일용 슬라이드 사이드바 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent  z-40 md:hidden"
                    onClick={onClose}
                >
                    <aside
                        className="absolute top-0 left-0 w-64 h-full bg-gradient-to-b from-indigo-400 to-indigo-100 text-white px-6 py-8 shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-extrabold mb-8 tracking-tight">🌟 메투</h2>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-300 transition"
                                >
                                    <span className="text-sm font-medium">리프레</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-300 transition"
                                >
                                    <span className="text-sm font-medium">엘나스</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-indigo-300 transition"
                                >
                                    <span className="text-sm font-medium">오르비스</span>
                                </a>
                            </li>
                        </ul>
                    </aside>
                </div>
            )}
        </>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";

interface Room {
    id: number;
    title: string;
    host: string;
    isFull: boolean;
}

interface RoomsProps {
    selectedContinent: string;
    selectedHuntingGround: string;
}

export default function Rooms({
                                  selectedContinent,
                                  selectedHuntingGround,
                              }: RoomsProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [hideFull, setHideFull] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [page, setPage] = useState(0);
    const loaderRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.disconnect();
        };
    }, []);

    useEffect(() => {
        // 예시 데이터
        setRooms((prev) => [
            ...prev,
            ...Array.from({ length: 10 }).map((_, i) => ({
                id: prev.length + i,
                title: `${selectedContinent} ${selectedHuntingGround} - 방 ${prev.length + i}`,
                host: `방장 ${prev.length + i}`,
                isFull: (prev.length + i) % 3 === 0,
            })),
        ]);
    }, [page, selectedContinent, selectedHuntingGround]);

    const filteredRooms = rooms.filter((room) => {
        if (hideFull && room.isFull) return false;
        return (
            room.title.includes(searchTerm) || room.host.includes(searchTerm)
        );
    });

    return (
        <section className="p-4 max-w-4xl mx-auto">
            {/* 검색 + 필터 */}
            <div className="relative items-center w-full ">
                <input
                    type="text"
                    placeholder="방제 또는 방장 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    검색
                </button>
            </div>




            {/* 방 리스트 */}
            <div className="space-y-4">
                {filteredRooms.map((room) => (
                    <div
                        key={room.id}
                        className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                {room.title}
                            </h3>
                            <p className="text-sm text-gray-500">방장: {room.host}</p>
                        </div>
                        <span
                            className={`text-sm px-3 py-1 rounded-full font-semibold ${
                                room.isFull
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                            }`}
                        >
              {room.isFull ? "꽉 참" : "모집 중"}
            </span>
                    </div>
                ))}
                <div ref={loaderRef} className="h-12"/>
            </div>
        </section>
    );
}

"use client";

import { useState } from "react";

export default function Hero() {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`검색어: ${query}`);
        // 여기에 검색 로직 추가 가능
    };

    return (
        <section className="text-center mt-12">
            <h1 className="text-5xl font-bold mb-4">메이플랜드 투게더</h1>
            <p className="text-lg text-gray-600 mb-8">
                메이플랜드 유저들의 파티구인 최적 사이트
            </p>

            <form onSubmit={handleSearch} className="flex justify-center">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="사냥터명으로 검색"
                        className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    />
                    <button
                        type="submit"
                        className="absolute right-1 top-1 bottom-1 px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        검색
                    </button>
                </div>
            </form>
        </section>
    );
}

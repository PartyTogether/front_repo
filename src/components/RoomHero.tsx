"use client";

import { tw } from '@/styles/common';
import { cn } from "@/lib/utils";
import { FaImage } from 'react-icons/fa';

interface Continent {
    name: string;
    grounds: string[];
}

interface RoomHeroProps {
    continents: Continent[];
    selectedContinent: string;
    setSelectedContinent: (value: string) => void;
    selectedHuntingGround: string;
    setSelectedHuntingGround: (value: string) => void;
}

export default function RoomHero({
                                     continents,
                                     selectedContinent,
                                     setSelectedContinent,
                                     selectedHuntingGround,
                                     setSelectedHuntingGround,
                                 }: RoomHeroProps) {
    const style = {
        title: "text-2xl text-gray-700 font-bold mb-4 text-center",
        section: "mt-16 bg-gradient-to-r pb-1 pt-6 px-4 border-b border-gray-300",
        contBtn: "gap-1 px-4 py-3 rounded-xl text-base font-semibold text-gray-500 hover:text-#5865F2 hover:bg-gray-100 transition-all duration-150",
        selectedContBtn:"text-[#5865F2] hover:text-[#5865F2] hover:bg-gray-100 transition-all duration-150",
        groundBtn: "px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-[#5865F2] hover:bg-gray-100 transition-all duration-150",
        selectedGroundBtn: "text-[#5865F2] hover:text-[#5865F2] hover:bg-gray-100 transition-all duration-150"

    }

    return (
        <section className={style.section}>
            <h2 className={style.title}>사냥터 선택</h2>

            <div className="flex flex-wrap justify-center gap-3 mb-3">
                {continents.map((cont) => (
                    <button
                        key={cont.name}
                        onClick={() => {
                            setSelectedContinent(cont.name);
                            setSelectedHuntingGround("");
                        }}
                        className={cn(
                            tw.buttonStyle,style.contBtn, selectedContinent === cont.name
                            && style.selectedContBtn
                        )}
                    >
                        <FaImage/>
                        {cont.name}
                    </button>
                ))}
            </div>

            <div className="flex justify-center gap-2">
                {continents
                    .find((c) => c.name === selectedContinent)
                    ?.grounds.map((ground) => (
                        <button
                            key={ground}
                            onClick={() => setSelectedHuntingGround(ground)}
                            className={cn(
                                tw.buttonStyle, style.groundBtn, selectedHuntingGround === ground
                                && style.selectedGroundBtn
                            )}
                        >
                            {ground}
                        </button>
                    ))}
            </div>
        </section>
    );
}

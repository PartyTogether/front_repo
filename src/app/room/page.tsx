'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import RoomHero from '@/app/room/components/RoomHero';
import Rooms from '@/app/room/components/Rooms';
import RoomInfo from '@/app/room/components/RoomInfo';
import { cn } from '@/lib/utils';
import ViewMode from '@/app/room/components/ViewMode';
import MyRoom from '@/app/room/components/MyRoom';
import { fetchRoomPageData, useGetRooms } from '@/lib/api/rooms';
import RoomCreate from '@/app/room/components/RoomCreate';
import { Continent, member, selectedRoom, Room } from '@/app/room/RoomTypes';

export default function RoomPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState('');
    const [selectedHuntingGround, setSelectedHuntingGround] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<selectedRoom | null>(null);
    const [continents, setContinents] = useState<Continent[]>([]);
    const [viewMode, setViewMode] = useState('OTHER_PARTY');
    const [roomList, setRoomList] = useState<Room[] | null>(null);

    const isLoggedIn = true;
    const hasRoom = false;

    const { rooms: fetchedRooms, isLoading, isError } = useGetRooms(selectedContinent, selectedHuntingGround);

    const style = {
        roomPageDiv: 'min-h-screen bg-white',
        roomSection: 'max-w-6xl mx-auto transition-all duration-500 mt-10 gap-6 px-6',
        isRoomSectionSelectedRoomTrue: 'flex flex-col lg:flex-row items-start ',
        isRoomSectionSelectedRoomFalse: 'flex flex-col items-center',
        roomInfoDiv: 'lg:w-3/6 animate-slide-in-left ',
        isRoomsSelectedRoomTrue: 'lg:w-3/6 animate-slide-in-left',
        isRoomsSelectedRoomFalse: 'w-full max-w-3xl',
        items_center: 'flex flex-col items-center',
    };




    useEffect(() => {
        const loadRoomPageData = async () => {
            try {
                const data = await fetchRoomPageData();
                setContinents(data);
            } catch (error) {
                console.error("Error fetching room page data:", error);
            }
        };
        void loadRoomPageData();
    }, []);

    useEffect(() => {
        if (selectedContinent && !isLoading) {
            if (fetchedRooms) {
                setRoomList(fetchedRooms);
            }
        }
    }, [selectedContinent, selectedHuntingGround, fetchedRooms, isLoading]);



    useEffect(() => {
        if (selectedRoomId !== null) {
        } else {
            setSelectedRoom(null);
        }
    }, [selectedRoomId]);

    const handleRoomSelect = (id: string) => {
        setSelectedRoomId(id);
    };

    const handleRoomInfoClose = () => {
        setSelectedRoomId(null);
    };

    return (
        <div className={style.roomPageDiv}>
            <Header onMenuClick={() => setMenuOpen(true)} />

            <RoomHero
                continents={continents}
                selectedContinent={selectedContinent}
                setSelectedContinent={setSelectedContinent}
                selectedHuntingGround={selectedHuntingGround}
                setSelectedHuntingGround={setSelectedHuntingGround}
            />

            <div
                className={cn(
                    style.roomSection,
                    selectedRoom ? style.isRoomSectionSelectedRoomTrue : style.isRoomSectionSelectedRoomFalse
                )}
            >
                {selectedRoom && (
                    <div className={style.roomInfoDiv}>
                        <RoomInfo room={selectedRoom} onClose={handleRoomInfoClose} />
                    </div>
                )}

                <div
                    className={cn(
                        selectedRoom ? style.isRoomsSelectedRoomTrue : style.isRoomsSelectedRoomFalse,
                        viewMode === 'MAKE_PARTY' && style.items_center
                    )}
                >
                    <ViewMode viewMode={viewMode} setViewMode={setViewMode} />
                    {viewMode === 'OTHER_PARTY' ? (
                        <>
                            {isLoading && <p>Loading...</p>}
                            {isError && <p>Error fetching data.</p>}
                            {!isLoading && !isError && (
                                <Rooms roomList={roomList} handleRoomSelect={handleRoomSelect} selectedRoom={selectedRoom} />
                            )}
                        </>
                    ) : viewMode === 'MAKE_PARTY' ? (
                        isLoggedIn && !hasRoom ? (
                            <RoomCreate continents={continents} />
                        ) : (
                            <div className="text-center py-10">
                                <p>{!isLoggedIn ? '로그인이 필요합니다.' : '이미 참여중인 방이 있습니다.'}</p>
                            </div>
                        )
                    ) : (
                        <MyRoom />
                    )}
                </div>
            </div>
        </div>
    );
}

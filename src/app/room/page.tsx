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
import Swal from 'sweetalert2';

export default function RoomPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState('');
    const [selectedHuntingGround, setSelectedHuntingGround] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<selectedRoom | null>(null);
    const [continents, setContinents] = useState<Continent[]>([]);
    const [viewMode, setViewMode] = useState('OTHER_PARTY');
    const [roomList, setRoomList] = useState<Room[] | null>(null);

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [hasRoom, setHasRoom] = useState(true);

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

    const handleViewModeChange = (mode: string) => {
        if (mode === 'MAKE_PARTY') {
            if (!isLoggedIn) {
                Swal.fire({
                    icon: 'error',
                    title: '로그인 필요',
                    text: '방을 만들려면 먼저 로그인해야 합니다.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '확인'
                });
                return;
            }
            if (hasRoom) {
                Swal.fire({
                    icon: 'warning',
                    title: '참여 중인 방 있음',
                    text: '이미 참여중인 방이 있습니다. 새로운 방을 만들 수 없습니다.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '확인'
                });
                return;
            }
        }
        setViewMode(mode);
    };

    useEffect(() => {
        const loadRoomPageData = async () => {
            try {
                const data = await fetchRoomPageData();
                setContinents(data.continents);
                setIsLoggedIn(data.isLoggedIn);
                setHasRoom(data.hasRoom);
            } catch (error) {
                console.error("방 메타 데이터 가져오는중 오류 발생", error);
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
                    <ViewMode viewMode={viewMode} setViewMode={handleViewModeChange} />
                    {viewMode === 'OTHER_PARTY' ? (
                        <>
                            {isLoading && <p>Loading...</p>}
                            {isError && <p>Error fetching data.</p>}
                            {!isLoading && !isError && (
                                <Rooms roomList={roomList} handleRoomSelect={handleRoomSelect} selectedRoom={selectedRoom} />
                            )}
                        </>
                    ) : viewMode === 'MAKE_PARTY' ? (
                        <RoomCreate continents={continents} setHasRoom={setHasRoom} />
                    ) : (
                        <MyRoom />
                    )}
                </div>
            </div>
        </div>
    );
}
'use client';

import {useEffect, useState, useRef, useMemo} from 'react';
import Header from '@/components/Header';
import RoomHero from '@/app/room/components/RoomHero';
import Rooms from '@/app/room/components/Rooms';
import RoomInfo from '@/app/room/components/RoomInfo';
import { cn } from '@/lib/utils';
import ViewMode from '@/app/room/components/ViewMode';
import MyRoom from '@/app/room/components/MyRoom';
import { fetchRoomPageData, useGetRooms, getMyRoom } from '@/lib/api/rooms';
import { getMyMemberId } from '@/lib/api/member';
import RoomCreate from '@/app/room/components/RoomCreate';
import { Continent, Room, Applicant, ChatMessage } from '@/app/room/RoomTypes';
import Swal from 'sweetalert2';
import { useRoomSocket } from '@/lib/hooks/useRoomSocket';
import { useMemberNotificationSocket } from '@/lib/hooks/useMemberNotificationSocket';

export default function RoomPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedContinent, setSelectedContinent] = useState('');
    const [selectedHuntingGround, setSelectedHuntingGround] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [continents, setContinents] = useState<Continent[]>([]);
    const [viewMode, setViewMode] = useState('OTHER_PARTY');
    const [roomList, setRoomList] = useState<Room[] | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasRoom, setHasRoom] = useState(false);
    const [newApplicantIds, setNewApplicantIds] = useState<Set<string>>(new Set());
    const prevApplicantsRef = useRef<Applicant[]>([]);
    const [myMemberId, setMyMemberId] = useState<string | null>(null);

    const { rooms: fetchedRooms, isLoading: isRoomsLoading, isError: isRoomsError } = useGetRooms(selectedContinent, selectedHuntingGround);
    const { roomData: roomSocketData, error: roomError, isLoading: isRoomLoading } = useRoomSocket(selectedRoomId);
    const selectedRoom = roomSocketData?.roomData;
    const applicants = roomSocketData?.applicants;
    const chatMessages = roomSocketData?.chatMessages;

    const processedChatMessages = useMemo(() => {
        if (!chatMessages || !myMemberId) {
            return [];
        }
        return chatMessages
            .filter((msg: ChatMessage) => typeof msg === 'object' && msg !== null && msg.memberId)
            .map((msg: ChatMessage) => ({
                ...msg,
                isMine: String(msg.memberId) === String(myMemberId)

            }));
    }, [chatMessages, myMemberId]);



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

    const handleRoomJoined = async () => {
        const result = await Swal.fire({
            icon: 'success',
            title: '파티 참가 완료!',
            text: '파티에 성공적으로 참가했습니다. 내 파티를 확인해주세요.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '확인'
        })
        if(result.isConfirmed){
            setHasRoom(true);
            await handleViewModeChange('MY_PARTY');
        }
    };

    useMemberNotificationSocket({
        isLoggedIn,
        onRoomJoined: handleRoomJoined,
    });

    useEffect(() => {
        if (prevApplicantsRef.current && applicants && applicants.length > prevApplicantsRef.current.length) {
            const prevIds = new Set(prevApplicantsRef.current.map((a:Applicant) => a.applicantId));
            const newOnes = applicants.filter((a:Applicant) => !prevIds.has(a.applicantId));
            if (newOnes.length > 0) {
                setNewApplicantIds(currentIds => {
                    const newIds = new Set(currentIds);
                    newOnes.forEach((a:Applicant) => newIds.add(a.applicantId));
                    return newIds;
                });
            }
        }
        prevApplicantsRef.current = applicants;
    }, [applicants]);

    const handleViewApplicants = () => {
        setNewApplicantIds(new Set());
    };

    const handleViewModeChange = async (mode: string) => {
        if (mode === 'MAKE_PARTY') {
            if (!isLoggedIn) {
                Swal.fire({ icon: 'error', title: '로그인 필요', text: '방을 만들려면 먼저 로그인해야 합니다.', confirmButtonColor: '#3085d6', confirmButtonText: '확인' });
                return;
            }
            if (hasRoom) {
                Swal.fire({ icon: 'warning', title: '참여 중인 방 있음', text: '이미 참여중인 방이 있습니다. 새로운 방을 만들 수 없습니다.', confirmButtonColor: '#3085d6', confirmButtonText: '확인' });
                return;
            }
        }
        if (mode === 'MY_PARTY') {
            if (!isLoggedIn) {
                Swal.fire({ icon: 'error', title: '로그인 필요', text: '내 파티를 보려면 먼저 로그인해야 합니다.', confirmButtonColor: '#3085d6', confirmButtonText: '확인' });
                return;
            }
            if (!hasRoom) {
                Swal.fire({ icon: 'warning', title: '내 파티 없음', text: '현재 참여 중인 파티가 없습니다.', confirmButtonColor: '#3085d6', confirmButtonText: '확인' });
                return;
            }
            if (hasRoom) {
                try {
                    const data = await getMyRoom();
                    setSelectedRoomId(data.roomId);
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
                    Swal.fire({
                        icon: 'error',
                        title: '오류',
                        text: errorMessage,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '확인'
                    }).then((result) => {
                        if(result.isConfirmed){
                            setViewMode('OTHER_PARTY');
                        }
                    });
                }
            }
        }
        if(mode === 'OTHER_PARTY'){
            setSelectedRoomId(null);
        }
        setViewMode(mode);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const roomData = await fetchRoomPageData();
                setContinents(roomData.continents);
                setIsLoggedIn(roomData.isLoggedIn);
                setHasRoom(roomData.hasRoom);

                if (roomData.isLoggedIn) {
                    const { memberId } = await getMyMemberId();
                    setMyMemberId(memberId);
                }
            } catch (error) {
                console.error("초기 데이터 로딩 중 오류 발생", error);
                setIsLoggedIn(false);
            }
        };
        void loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedContinent && !isRoomsLoading) {
            if (fetchedRooms) {
                setRoomList(fetchedRooms);
            }
        }
    }, [selectedContinent, selectedHuntingGround, fetchedRooms, isRoomsLoading]);

    const handleRoomSelect = (id: string) => {
        setSelectedRoomId(id);
    };

    const handleRoomInfoClose = () => {
        setSelectedRoomId(null);
    };

    const handleLeaveSuccess = () => {
        setHasRoom(false);
        setViewMode('OTHER_PARTY');
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
                    selectedRoomId ? style.isRoomSectionSelectedRoomTrue : style.isRoomSectionSelectedRoomFalse
                )}
            >
                {selectedRoomId && (
                    <div className={style.roomInfoDiv}>
                        {isRoomLoading && <p>Loading room details...</p>}
                        {roomError && <p>Error loading room details.</p>}
                        {selectedRoom && <RoomInfo room={selectedRoom} isLoggedIn={isLoggedIn} onClose={handleRoomInfoClose} viewMode={viewMode} onLeaveSuccess={handleLeaveSuccess} />}
                    </div>
                )}

                <div
                    className={cn(
                        selectedRoomId ? style.isRoomsSelectedRoomTrue : style.isRoomsSelectedRoomFalse,
                        viewMode === 'MAKE_PARTY' && style.items_center
                    )}
                >
                    <ViewMode viewMode={viewMode} setViewMode={handleViewModeChange} />
                    {viewMode === 'OTHER_PARTY' ? (
                        <>
                            {isRoomsLoading && <p>Loading...</p>}
                            {isRoomsError && <p>Error fetching data: {isRoomsError.message}</p>}
                            {!isRoomsLoading && !isRoomsError && (
                                <Rooms roomList={roomList} handleRoomSelect={handleRoomSelect} selectedRoomId={selectedRoomId} />
                            )}
                        </>
                    ) : viewMode === 'MAKE_PARTY' ? (
                        <RoomCreate continents={continents} setHasRoom={setHasRoom} />
                    ) : (
                        <>
                            {isRoomLoading && <p>내 방 정보를 불러오는 중...</p>}
                            {roomError && <p>오류가 발생했습니다: {roomError.message}</p>}
                            {selectedRoom && applicants && chatMessages && <MyRoom room={selectedRoom} applicants={applicants} chatMessages={processedChatMessages} newApplicantIds={newApplicantIds} onViewApplicants={handleViewApplicants} />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

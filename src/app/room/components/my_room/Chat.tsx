'use client';

import {useState, useEffect, useRef, JSX} from 'react';
import {ChatMessage, selectedRoom} from '@/app/room/RoomTypes';
import { sendMessage } from "@/lib/api/messages";
import { cn } from '@/lib/utils';

interface ChatProps {
    chatMessages: ChatMessage[];
    room: selectedRoom;
}

export default function Chat({ chatMessages, room }: ChatProps) {
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        try {
            await sendMessage({
                roomId: room.roomId,
                content: newMessage
            });
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const style = {
        container: 'flex flex-col h-96',
        chatWindow: 'flex-grow p-4 space-y-2 overflow-y-auto bg-gray-50 rounded-t-lg',
        messageRow: 'flex items-end gap-2',
        avatar: 'w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden',
        messageBubble: 'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl',
        myMessage: 'bg-blue-500 text-white',
        otherMessage: 'bg-gray-200 text-gray-800',
        senderName: 'text-xs text-gray-500 mb-1 ml-1',
        dateDivider: 'text-center text-xs text-gray-500 my-4',
        messageTimestamp: 'text-xs text-gray-400 flex-shrink-0',
        inputContainer: 'flex p-2 border-t border-gray-200 bg-white rounded-b-lg',
        inputField: 'flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
        sendButton: 'px-4 py-2 bg-indigo-600 text-white font-semibold rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    };

    const chatElements: JSX.Element[] = [];
    let lastDate: string | null = null;

    (chatMessages || []).forEach((msg) => {
        if (!msg || !msg.messageCreatedAt) return;

        const messageDate = new Date(msg.messageCreatedAt).toDateString();
        if (messageDate !== lastDate) {
            chatElements.push(
                <div key={messageDate} className={style.dateDivider}>
                    <span>{new Date(msg.messageCreatedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            );
            lastDate = messageDate;
        }

        const timeString = new Date(msg.messageCreatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });

        chatElements.push(
            <div key={msg.messageId} className={cn(style.messageRow, msg.isMine ? 'justify-end' : 'justify-start', 'animate-message-in')}>
                
                {!msg.isMine && <div className={style.avatar}></div>} {/* Other's Avatar Placeholder */}
                
                {msg.isMine && <span className={style.messageTimestamp}>{timeString}</span>}
                
                <div>
                    {!msg.isMine && <p className={style.senderName}>{msg.memberName}</p>}
                    <div className={cn(style.messageBubble, msg.isMine ? style.myMessage : style.otherMessage)}>
                        <p>{msg.messageContent}</p>
                    </div>
                </div>

                {!msg.isMine && <span className={style.messageTimestamp}>{timeString}</span>}

            </div>
        );
    });

    return (
        <div className={style.container}>
            <div ref={chatContainerRef} className={style.chatWindow}>
                {chatElements}
            </div>
            <div className={style.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="메시지를 입력하세요..."
                    className={style.inputField}
                />
                <button onClick={handleSendMessage} className={style.sendButton}>
                    전송
                </button>
            </div>
        </div>
    );
}
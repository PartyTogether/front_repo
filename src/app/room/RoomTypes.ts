export interface HuntingGround {
    huntingGroundName: string;
    positions: string[];
}

export interface Continent {
    continentName: string;
    continentImage: string;
    huntingGrounds: HuntingGround[];
}

export interface users {
    id: number;
    name: string;
    level: number;
    class: string;
}

export interface selectedRoom {
    id: number;
    title: string;
    desc: string;
    users: users[];
    host: string;
    currentHead: number;
    maximumHead: number;
    isFull: boolean;
}

export interface Room {
    id: number;
    title: string;
    desc: string;
    continent: string;
    huntingGround: string;
    host: string;
    isFull: boolean;
    currentHead: number;
    maximumHead: number;
    channel: string;
    minimumLv: number;
    minimumPlayTime: number;
}

export interface createRoomReq {
    roomTitle: string,
    roomDesc: string,
    roomMinLevel: number,
    roomMaxMembers: number,
    roomMinTime: string,
    roomChannel: string,
    roomHuntingGround: string,
}
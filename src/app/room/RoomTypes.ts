export interface HuntingGround {
    huntingGroundName: string;
    positions: string[];
}

export interface Continent {
    continentName: string;
    continentImage: string;
    huntingGrounds: HuntingGround[];
}

export interface member {
    memberId: number;
    memberName: string;
    memberLevel: number;
    memberClass: string;
}

export interface selectedRoom {
    roomId: string;
    roomTitle: string;
    roomDesc: string;
    roomMembers: member[];
    roomHost: string;
    roomCurrentMembers: number;
    roomMaxMembers: number;
    roomIsFull: boolean;
}

export interface roomPosition{
    positionName: string;
    positionStatus: string;
    positionComment: string;
    member: member | null;
}

export interface Room {
    roomId: string;
    roomTitle: string;
    roomDesc: string | null
    roomContinent: string;
    roomHuntingGround: string;
    roomHost: string;
    roomCurrentMembers: number;
    roomMaxMembers: number;
    roomChannel: string | null;
    roomMinLevel: number;
    roomMinTime: string;
}

export interface createRoomReq {
    roomTitle: string,
    roomDesc: string,
    roomMinLevel: number,
    roomMaxMembers: number,
    roomMinTime: string,
    roomChannel: string,
    roomHuntingGround: string,
    roomPositions: string[],
    roomPositionComments: Record<string, string>,
    hostPosition: string,
}
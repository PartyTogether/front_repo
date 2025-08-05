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
    roomId: number;
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
    roomId: number;
    roomTitle: string;
    roomDesc: string;
    roomContinent: string;
    roomHuntingGround: string;
    roomHost: string;
    roomIsFull: boolean;
    roomCurrentMembers: number;
    roomMaxMembers: number;
    roomChannel: string;
    roomMinLevel: number;
    roomMinTime: number;
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
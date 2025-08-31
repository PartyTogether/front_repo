export interface HuntingGround {
    huntingGroundName: string;
    positions: string[];
}

export interface Continent {
    continentId: number;
    continentName: string;
    huntingGrounds: HuntingGround[];
}

export interface RoomMeta {
    continents: Continent[];
    isLoggedIn: boolean;
    hasRoom: boolean;
}

export interface memberSkill{
    skillName: string;
    skillImage: string;
    memberSkillLevel: number;
}

export interface member {
    memberId: string;
    memberName: string;
    memberLevel: number | null;
    memberClass: string;
    memberSkills: memberSkill[];
}

export interface selectedRoom {
    roomId: string;
    roomTitle: string;
    roomDesc: string | null;
    roomMembers: member[];
    roomHost: string;
    roomCurrentMembers: number;
    roomMaxMembers: number;
    roomChannel: string | null;
    roomMinLevel: number;
    roomMinTime: string;
    roomPositions: roomPosition[];
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

// 가입신청
export interface applyToRoomReq {
    roomId: string,
    roomPositionName: string,
}

// 가입수락
export interface AcceptToApply{
    applicantId: string,
}

export interface Applicant {
    applicantId: string;
    memberId: string;
    memberName: string;
    memberLevel: number | null;
    memberClass: string;
    positionName: string;
    memberSkills: memberSkill[];
}


export interface ChatMessage{
    messageId: string;
    messageCreatedAt: string;
    messageContent: string;
    memberId: string;
    memberName: string;
}
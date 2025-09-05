import authInstance from "@/lib/api/authInstance";
import {Member} from "@/app/member/page";


export async function getMemberInfo() {
    console.log("멤버 정보 가져오기");
    const res = await authInstance.get('/api/member');
    console.log("res In getMemberInfo : ", res);
    return res.data;
}

export async function updateMember(member: Member)    {
    console.log("멤버 업데이트 실행");
    const res = await authInstance.put('/api/member', member);
    return res.data;
}
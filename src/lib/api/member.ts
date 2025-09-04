import  apiInstance  from './apiInstance';
import authInstance from './authInstance';


export async function getMemberInfo() {
    console.log("멤버 정보 가져오기");
    const res = await authInstance.get('/api/member');
    console.log("res In getMemberInfo : ", res);
    return res.data;
}


export const getMyMemberId = async (): Promise<{ memberId: string }> => {
    const url = process.env.NEXT_PUBLIC_MEMBER_ID!;
    const res = await apiInstance.get(url);
    return res.data;
};
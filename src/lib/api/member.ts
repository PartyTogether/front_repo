import authInstance from "@/lib/api/authInstance";


export async function getMemberInfo() {
    console.log("멤버 정보 가져오기");
    const res = await authInstance.get('/api/member');
    console.log("res In getMemberInfo : ", res);
    return res.data;
}
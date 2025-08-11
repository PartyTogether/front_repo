import authInstance from "@/lib/api/authInstance";


export async function authMe() {
    console.log("클라이언트 검증 요청 실행");
    const res = await authInstance.get('/auth/me');
    return res.data;
}
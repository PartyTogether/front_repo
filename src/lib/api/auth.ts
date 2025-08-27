import authInstance from "@/lib/api/authInstance";


export async function authMe() {
    console.log("클라이언트 검증 요청 실행");
    const res = await authInstance.get('/auth/me');
    return res.data;
}

export async function logout() {
    console.log("로그아웃 요청 실행");
    const res = await authInstance.post("/auth/logout");
    return res;
}
import authInstance from "@/lib/api/authInstance";


export async function authMe() {
    console.log("클라이언트 검증 요청 실행");
    const res = await authInstance.get(process.env.NEXT_PUBLIC_AUTH_ME!);
    return res.data;
}

export async function logout() {
    console.log("로그아웃 요청 실행");
    return await authInstance.post(process.env.NEXT_PUBLIC_AUTH_LOGOUT!);
}
import axios from "axios";

const authInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE, // JSON 방식이 아닌경우 api를 제거한 url로 요청
    withCredentials: true, // 쿠키 자동 포함
    headers: {
        'Content-Type': 'application/json',
    },
});

export default authInstance;
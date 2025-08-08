import axios from "axios";

const authInstance = axios.create({
    baseURL: 'http://localhost:5000', // JSON 방식이 아닌경우 api를 제거한 url로 요청
    withCredentials: true, // 쿠키 자동 포함
    headers: {
        'Content-Type': 'application/json',
    },
});

export default authInstance;
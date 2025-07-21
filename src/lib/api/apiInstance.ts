
import axios from 'axios';

const apiInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // 백엔드 API 기본 URL
    withCredentials: true, // 쿠키 자동 포함
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiInstance;

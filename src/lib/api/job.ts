import authInstance from "@/lib/api/authInstance";
import {Member} from "@/app/member/page";
import  apiInstance  from './apiInstance';

export async function getAllJobs() {
    console.log("모든 직업정보 가져오기");
    const res = await authInstance.get('/api/job');
    console.log("res In getAllJobs : ", res);
    return res.data;
}
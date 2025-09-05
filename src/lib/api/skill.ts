import authInstance from "@/lib/api/authInstance";
import {Member} from "@/app/member/page";
import  apiInstance  from './apiInstance';

export async function getSkillsByJob(job: string) {
    console.log(job + " 직업 스킬정보 가져오기");
    const res = await authInstance.get('/api/skill', {
        params : { job }
    });
    console.log("res In getSkillsByJob : ", res);
    return res.data;
}
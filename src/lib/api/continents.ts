import apiInstance from './apiInstance';

export async function fetchContinents(){
    const res = await apiInstance.get('/continents');
    return res.data;
}
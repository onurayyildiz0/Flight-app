import axios from 'axios';

const API_URL = 'https://v1.nocodeapi.com/meldaf852/google_sheets/uGWgIuwdsgxqDbEV?tabId=Users';


export const fetchUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.data; // Kullanıcı verilerini döndür
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const addUser = async (user) => {
    try {
        const response = await axios.post(API_URL, [user]);
        return response.data; // API'den dönen yanıt
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};
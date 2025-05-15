import axios from 'axios';

const API_URL = 'https://v1.nocodeapi.com/meldaf852/google_sheets/uGWgIuwdsgxqDbEV?tabId=Cards';


export const getCards = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data.data; // Kart bilgilerini döndür
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};
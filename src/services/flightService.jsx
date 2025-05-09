import axios from 'axios';

const API_URL = 'https://v1.nocodeapi.com/meldaf01112/google_sheets/omvjePQDzNKZXeul?tabId=Flights';


export const getFlights = async () => {
    try {
        const response = await axios.get(API_URL);
        const flights = response.data.data;

        // Gelen verileri işleyerek kullanılabilir bir formata dönüştür
        return flights.map((flight) => ({
            id: flight.row_id,
            departure: flight.from,
            arrival: flight.to,
            date: flight.date,
            airline: flight.airline,
            price: parseFloat(flight.price),
            duration: parseInt(flight.duration, 10),
            isDirect: flight.isDirect === 'TRUE',
            seats: JSON.parse(flight.seats), // JSON string'i parse ediyoruz
        }));
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};



export const addFlight = async (flight) => {
    try {
        // Veriyi belirtilen formata dönüştür
        const formattedFlight = [
            flight.departure,
            flight.arrival,
            flight.date,
            flight.airline,
            flight.price,
            flight.duration,
            flight.isActive,
            JSON.stringify(flight.seats) // Seats alanını JSON string olarak gönderiyoruz
        ];

        // POST isteği ile uçuşu ekle
        const response = await axios.post(API_URL, [formattedFlight]);
        return response.data;
    } catch (error) {
        console.error('Error adding flight:', error);
        throw error;
    }
};


export const deleteFlight = async (rowId) => {
    try {
        const response = await axios.delete(`${API_URL}&row_id=${rowId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting flight:', error);
        throw error;
    }
};
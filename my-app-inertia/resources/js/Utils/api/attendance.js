import axios from "axios";

export const scanRfid = async (rfid) => {
    const response = await axios.post("/api/attendance/scan", { rfid });
    return response.data;
};

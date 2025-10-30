import axios from "axios";

export const scanRfid = async (rfid) => {
    const response = await axios.post("/api/attendance/scan", { rfid });
    return response.data;
};

export const manualAttendanceToggle = async (siswa_id, pertemuan_id) => {
    const response = await axios.post("/api/attendance/manual", {
        siswa_id,
        pertemuan_id,
    });
    return response.data;
};

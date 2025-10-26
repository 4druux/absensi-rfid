import axios from "axios";

export const createKelas = async (data) => {
    const response = await axios.post("/api/kelas", data);
    return response.data;
};

export const deleteKelas = async (id) => {
    const response = await axios.delete(`/api/kelas/${id}`);
    return response.data;
};

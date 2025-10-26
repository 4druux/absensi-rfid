import axios from "axios";

export const createJurusan = async (data) => {
    const response = await axios.post("/api/jurusan", data);
    return response.data;
};

export const deleteJurusan = async (id) => {
    const response = await axios.delete(`/api/jurusan/${id}`);
    return response.data;
};
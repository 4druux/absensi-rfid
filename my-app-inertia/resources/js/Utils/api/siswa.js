import axios from "axios";

export const createSiswa = async (data) => {
    const response = await axios.post("/api/siswa", data);
    return response.data;
};

export const createSingleSiswa = async (data) => {
    const response = await axios.post("/api/siswa/single", data);
    return response.data;
};

export const updateSiswa = async (id, data) => {
    const response = await axios.put(`/api/siswa/${id}`, data);
    return response.data;
};

export const deleteSiswa = async (id) => {
    const response = await axios.delete(`/api/siswa/${id}`);
    return response.data;
};

export const promoteStudents = async (data) => {
    const response = await axios.post("/api/siswa/promote", data);
    return response.data;
};

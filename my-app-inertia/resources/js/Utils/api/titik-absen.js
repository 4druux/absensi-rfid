import axios from "axios";

export const createTitikAbsen = async (data) => {
    const response = await axios.post("/api/titik-absen", data);
    return response.data;
};

export const deleteTitikAbsen = async (id) => {
    const response = await axios.delete(`/api/titik-absen/${id}`);
    return response.data;
};

export const assignPertemuan = async (id, pertemuan_id) => {
    const response = await axios.put(`/api/titik-absen/${id}/assign`, {
        pertemuan_id,
    });
    return response.data;
};

export const unassignPertemuan = async (titikAbsenId, pertemuanId) => {
    const response = await axios.delete(
        `/api/titik-absen/${titikAbsenId}/assign/${pertemuanId}`
    );
    return response.data;
};

import axios from "axios";

export const getPertemuans = async (tahun_ajaran, gender) => {
    const response = await axios.get("/api/pertemuan", {
        params: { tahun_ajaran, gender },
    });
    return response.data;
};

export const createPertemuan = async (data) => {
    const response = await axios.post("/api/pertemuan", data);
    return response.data;
};

export const updatePertemuan = async (id, data) => {
    const response = await axios.put(`/api/pertemuan/${id}`, data);
    return response.data;
};

export const deletePertemuan = async (id) => {
    const response = await axios.delete(`/api/pertemuan/${id}`);
    return response.data;
};

export const activatePertemuan = async (id) => {
    const response = await axios.post(`/api/pertemuan/${id}/activate`);
    return response.data;
};

export const deactivatePertemuan = async (id) => {
    const response = await axios.post(`/api/pertemuan/${id}/deactivate`);
    return response.data;
};

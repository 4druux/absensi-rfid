import axios from "axios";

export const getPertemuans = async (tahun_ajaran, gender, kelas_id) => {
    const response = await axios.get("/api/pertemuan", {
        params: { tahun_ajaran, gender, kelas_id },
    });
    return response.data;
};

export const createPertemuan = async (data) => {
    const response = await axios.post("/api/pertemuan", data);
    return response.data;
};

export const createBulkPertemuan = async (data) => {
    const response = await axios.post("/api/pertemuan/bulk-store", data);
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

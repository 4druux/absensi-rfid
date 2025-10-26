import axios from "axios";

export const approveUser = async (userId) => {
    const response = await axios.post(`/api/users/${userId}/approve`);
    return response.data;
};

export const rejectUser = async (userId) => {
    const response = await axios.delete(`/api/users/${userId}`);
    return response.data;
};

export const resetPassword = async (userId, passwordData) => {
    const response = await axios.put(
        `/api/users/${userId}/reset-password`,
        passwordData
    );
    return response.data;
};

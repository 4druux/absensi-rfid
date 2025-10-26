import axios from "axios";

export const createAcademicYear = async (data) => {
    const response = await axios.post("/api/academic-years", data);
    return response.data;
};

export const deleteAcademicYear = async (year) => {
    const response = await axios.delete(`/api/academic-years/${year}`);
    return response.data;
};
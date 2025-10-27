import useSWR from "swr";
import { fetcher } from "@/Utils/api/index";

const useAcademicYears = () => {
    const { data, error } = useSWR(
        "/api/academic-years/with-classes",
        fetcher
    );

    return {
        academicYears: data,
        isLoading: !error && !data,
        error: error,
    };
};

export default useAcademicYears;

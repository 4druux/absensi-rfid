import useSWR from "swr";
import { fetcher } from "@/Utils/api";

const useShowAttendance = (pertemuan_id, kelas_id) => {
    const apiUrl =
        pertemuan_id && kelas_id
            ? `/api/attendance/show/${pertemuan_id}?kelas_id=${kelas_id}`
            : null;

    const {
        data: attendanceData,
        error,
        isLoading,
        mutate,
    } = useSWR(apiUrl, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    return {
        attendanceData: attendanceData || [],
        isLoading,
        error,
        mutate,
    };
};

export default useShowAttendance;

import useSWR from "swr";
import { fetcher, manualAttendanceToggle } from "@/Utils/api";
import { useState } from "react";
import toast from "react-hot-toast";

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

    const [isToggling, setIsToggling] = useState(null);

    const toggleAttendance = async (siswa_id) => {
        if (!pertemuan_id) return;
        setIsToggling(siswa_id);

        try {
            const result = await manualAttendanceToggle(siswa_id, pertemuan_id);

            toast.success(result.message || "Status absensi berhasil diubah!");

            mutate();
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Gagal mengubah status absensi.";

            toast.error(message);
            console.error("Gagal toggle absensi:", err);
        } finally {
            setIsToggling(null);
        }
    };

    return {
        attendanceData: attendanceData || [],
        isLoading,
        error,
        mutate,
        isToggling,
        toggleAttendance,
    };
};

export default useShowAttendance;

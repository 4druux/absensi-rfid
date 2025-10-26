import useSWR from "swr";
import toast from "react-hot-toast";
import { deleteKelas, fetcher } from "@/Utils/api/index";

const useAllClass = () => {
    const { data, error, mutate } = useSWR("/api/kelas", fetcher);

    const handleDelete = async (kelasId, namaKelas) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin menghapus kelas "${namaKelas}"? Semua data siswa di dalamnya juga akan terhapus.`
            )
        ) {
            return;
        }

        const toastId = toast.loading("Menghapus kelas...");
        try {
            await deleteKelas(kelasId);
            mutate();
            toast.success("Kelas berhasil dihapus.", { id: toastId });
        } catch (error) {
            toast.error(error.toString(), { id: toastId });
        }
    };

    return {
        allKelas: data,
        isLoading: !error && !data,
        error: error,
        handleDelete,
    };
};

export default useAllClass;

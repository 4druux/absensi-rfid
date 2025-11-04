import useSWR from "swr";
import toast from "react-hot-toast";
import {
    getPertemuans,
    createPertemuan,
    createBulkPertemuan,
    updatePertemuan,
    deletePertemuan,
} from "@/Utils/api";

const useSelectMeet = (tahun_ajaran, gender, kelas_id) => {
    const swrKey =
        tahun_ajaran && gender && kelas_id
            ? ["/api/pertemuan", tahun_ajaran, gender, kelas_id]
            : null;

    const {
        data: pertemuans,
        error,
        mutate,
        isLoading: isLoadingPertemuans,
    } = useSWR(swrKey, () => getPertemuans(tahun_ajaran, gender, kelas_id));

    const handleCreate = async (data, onSuccess) => {
        const toastId = toast.loading("Menambahkan pertemuan...");
        try {
            await createPertemuan(data);
            toast.success("Pertemuan berhasil ditambahkan.", { id: toastId });
            mutate();
            if (onSuccess) onSuccess();
        } catch (error) {
            const message =
                error.response?.data?.errors?.title?.[0] ||
                "Gagal menambahkan pertemuan.";
            toast.error(message, { id: toastId });
            throw error;
        }
    };

    const handleBulkCreate = async (data, onSuccess) => {
        const toastId = toast.loading(
            "Menambahkan pertemuan ke semua kelas..."
        );
        try {
            const response = await createBulkPertemuan(data);
            toast.success(response.message, { id: toastId, duration: 5000 });
            mutate();
            if (onSuccess) onSuccess();
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Gagal menambahkan pertemuan massal.";
            toast.error(message, { id: toastId });
            throw error;
        }
    };

    const handleUpdate = async (id, data) => {
        const toastId = toast.loading("Memperbarui pertemuan...");
        try {
            await updatePertemuan(id, data);
            toast.success("Pertemuan berhasil diperbarui.", { id: toastId });
            mutate();
        } catch (error) {
            const message =
                error.response?.data?.errors?.title?.[0] ||
                "Gagal memperbarui pertemuan.";
            toast.error(message, { id: toastId });
            throw error;
        }
    };

    const handleDelete = async (id, title) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin menghapus "${title}"? Data absensi terkait juga mungkin terhapus.`
            )
        ) {
            return;
        }

        const toastId = toast.loading("Menghapus pertemuan...");
        try {
            await deletePertemuan(id);
            toast.success("Pertemuan berhasil dihapus.", { id: toastId });
            mutate();
        } catch (error) {
            const message =
                error.response?.data?.message || "Gagal menghapus pertemuan.";
            toast.error(message, { id: toastId });
        }
    };

    return {
        pertemuans,
        isLoading: isLoadingPertemuans && swrKey,
        error,
        handleCreate,
        handleBulkCreate,
        handleUpdate,
        handleDelete,
    };
};

export default useSelectMeet;

import useSWR from "swr";
import toast from "react-hot-toast";
import {
    getPertemuans,
    createPertemuan,
    updatePertemuan,
    deletePertemuan,
    activatePertemuan,
    deactivatePertemuan,
} from "@/Utils/api";

const useSelectMeet = (tahun_ajaran, gender) => {
    const swrKey =
        tahun_ajaran && gender
            ? ["/api/pertemuan", tahun_ajaran, gender]
            : null;

    const {
        data: pertemuans,
        error,
        mutate,
        isLoading: isLoadingPertemuans,
    } = useSWR(swrKey, () => getPertemuans(tahun_ajaran, gender));

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

    const handleActivate = async (id, title) => {
        if (!confirm(`Aktifkan sesi absensi untuk "${title}"?`)) return;
        const toastId = toast.loading(`Mengaktifkan sesi ${title}...`);
        try {
            await activatePertemuan(id);
            toast.success(`Sesi "${title}" berhasil diaktifkan.`, {
                id: toastId,
            });
            mutate();
        } catch (error) {
            toast.error(
                `Gagal mengaktifkan sesi ${title}.`,
                { id: toastId },
                error
            );
        }
    };

    const handleDeactivate = async (id, title) => {
        if (!confirm(`Nonaktifkan sesi absensi untuk "${title}"?`)) return;
        const toastId = toast.loading(`Menonaktifkan sesi ${title}...`);
        try {
            await deactivatePertemuan(id);
            toast.success(`Sesi "${title}" berhasil dinonaktifkan.`, {
                id: toastId,
            });
            mutate();
        } catch (error) {
            toast.error(
                `Gagal menonaktifkan sesi ${title}.`,
                { id: toastId },
                error
            );
        }
    };

    return {
        pertemuans,
        isLoading: isLoadingPertemuans && swrKey,
        error,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleActivate,
        handleDeactivate,
    };
};

export default useSelectMeet;

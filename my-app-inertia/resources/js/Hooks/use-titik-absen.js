import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import {
    fetcher,
    createTitikAbsen,
    deleteTitikAbsen,
    assignPertemuan,
    unassignPertemuan,
} from "@/Utils/api";

export const useTitikAbsen = () => {
    const {
        data: titikAbsens,
        error,
        isLoading: isDataLoading,
    } = useSWR("/api/titik-absen", fetcher);
    const { mutate } = useSWRConfig();

    const [modalState, setModalState] = useState({
        isOpen: false,
        titikAbsen: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (data) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Membuat titik absen...");
        try {
            await createTitikAbsen(data);
            toast.success("Titik absen baru berhasil dibuat.", { id: toastId });
            mutate("/api/titik-absen");
        } catch (error) {
            if (error.response?.status === 422) {
                toast.error(error.response?.data?.message, { id: toastId });
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Gagal membuat titik absen.",
                    { id: toastId }
                );
            }
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (titik) => {
        if (
            !confirm(
                `PERINGATAN: Menghapus titik absen akan mereset API Key. Anda yakin ingin menghapus ${titik.nama_titik}?`
            )
        )
            return;

        setIsSubmitting(true);
        const toastId = toast.loading("Menghapus titik absen...");

        deleteTitikAbsen(titik.id)
            .then(() => {
                toast.success("Titik absen berhasil dihapus.", { id: toastId });
                mutate("/api/titik-absen");
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Gagal menghapus.", {
                    id: toastId,
                });
            })
            .finally(() => setIsSubmitting(false));
    };

    const handleOpenModal = (titik) => {
        setModalState({ isOpen: true, titikAbsen: titik });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, titikAbsen: null });
    };

    const handleAssign = (pertemuan_id) => {
        if (!modalState.titikAbsen) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Menghubungkan sesi...");

        assignPertemuan(modalState.titikAbsen.id, pertemuan_id)
            .then(() => {
                toast.success("Sesi berhasil dihubungkan.", { id: toastId });
                mutate("/api/titik-absen");
                handleCloseModal();
            })
            .catch((err) => {
                toast.error(
                    err.response?.data?.message || "Gagal menghubungkan sesi.",
                    { id: toastId }
                );
            })
            .finally(() => setIsSubmitting(false));
    };

    const handleUnassign = (titik, pertemuan) => {
        if (
            !confirm(
                `Anda yakin ingin melepas sesi "${pertemuan.title}" dari ${titik.nama_titik}?`
            )
        )
            return;

        setIsSubmitting(true);
        const toastId = toast.loading("Melepas sesi...");

        unassignPertemuan(titik.id, pertemuan.id)
            .then(() => {
                toast.success("Sesi berhasil dilepas.", { id: toastId });
                mutate("/api/titik-absen");
            })
            .catch((err) => {
                toast.error(
                    err.response?.data?.message || "Gagal melepas sesi.",
                    {
                        id: toastId,
                    }
                );
            })
            .finally(() => setIsSubmitting(false));
    };

    return {
        titikAbsens,
        isLoading: isDataLoading && !error,
        error,
        isSubmitting,
        modalState,
        handleCreate,
        handleDelete,
        handleOpenModal,
        handleCloseModal,
        handleAssign,
        handleUnassign,
    };
};

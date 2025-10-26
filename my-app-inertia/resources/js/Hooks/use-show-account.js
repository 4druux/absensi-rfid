import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { fetcher, approveUser, rejectUser, resetPassword } from "@/Utils/api";

export const useShowAccount = (role) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    const swrKey = role
        ? `/api/users?role=${role}&search=${debouncedSearchTerm}`
        : null;
    const { data: users, error, mutate } = useSWR(swrKey, fetcher);

    const pendingUsers = useMemo(
        () => (users || []).filter((user) => !user.approved_at),
        [users]
    );

    const approvedUsers = useMemo(
        () => (users || []).filter((user) => user.approved_at),
        [users]
    );

    const handleApprove = async (userId) => {
        setIsProcessing(true);
        const toastId = toast.loading("Menyetujui pengguna...");
        try {
            const response = await approveUser(userId);
            toast.success(response.message, { id: toastId });
            mutate();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menyetujui pengguna.",
                { id: toastId }
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (userId) => {
        const action = users.find((u) => u.id === userId)?.approved_at
            ? "menghapus"
            : "menolak";
        if (!confirm(`Apakah Anda yakin ingin ${action} pengguna ini?`)) return;

        setIsProcessing(true);
        const toastId = toast.loading("Memproses permintaan...");
        try {
            const response = await rejectUser(userId);
            toast.success(response.message, { id: toastId });
            mutate();
        } catch (error) {
            toast.error(
                error.response?.data?.message || `Gagal ${action} pengguna.`,
                { id: toastId }
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleResetPassword = async (
        user,
        newPassword,
        passwordConfirmation
    ) => {
        const toastId = toast.loading("Mereset password...");
        try {
            const response = await resetPassword(user.id, {
                password: newPassword,
                password_confirmation: passwordConfirmation,
            });
            toast.success(response.message, { id: toastId });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal mereset password.",
                { id: toastId }
            );
            throw error;
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    return {
        users,
        isLoading: !error && !users,
        error,
        pendingUsers,
        approvedUsers,
        isProcessing,
        isModalOpen,
        selectedUser,
        searchTerm,
        handleApprove,
        handleReject,
        handleResetPassword,
        handleOpenModal,
        handleCloseModal,
        handleSearchChange,
        handleClearSearch,
    };
};

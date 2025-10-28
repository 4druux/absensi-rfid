import { useState } from "react";
import toast from "react-hot-toast";

export const useExport = () => {
    const [downloadingStatus, setDownloadingStatus] = useState({});

    const handleExport = async (key, endpoint, params) => {
        if (downloadingStatus[key]) {
            return;
        }

        setDownloadingStatus((prev) => ({ ...prev, [key]: true }));

        const url = route(endpoint, params);

        try {
            const response = await fetch(url, {
                method: "GET",
            });

            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                toast.error(errorData.error || "Gagal mengekspor data.");
                return;
            }

            window.location.href = url;
            toast.success("File berhasil diunduh!");
        } catch (error) {
            console.error("Error during export:", error);
            toast.error("Gagal mengekspor data. Terjadi kesalahan.");
        } finally {
            setTimeout(() => {
                setDownloadingStatus((prev) => ({ ...prev, [key]: false }));
            }, 500);
        }
    };

    return {
        handleExport,
        downloadingStatus,
    };
};

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import "@/bootstrap";

export const useAttendance = () => {
    const {
        data: initialRecords,
        error: swrError,
        mutate,
        isLoading: recordsLoading,
    } = useSWR("/api/attendance/today", fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    const {
        data: activeStatusData,
        error: statusError,
        isLoading: statusLoading,
    } = useSWR("/api/pertemuan-active-status", fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    const [status, setStatus] = useState({
        type: "waiting",
        title: "Menunggu Kartu...",
        detail: null,
    });

    const statusTimerRef = useRef(null);
    const [isAudioReady, setIsAudioReady] = useState(() => {
        return localStorage.getItem("audioActivated") === "true";
    });

    const attendanceRecords = initialRecords || [];
    const attendanceCount = attendanceRecords.length;
    const isSessionActive = !!activeStatusData?.is_active && !statusLoading;

    const resetStatus = () => {
        clearTimeout(statusTimerRef.current);
        statusTimerRef.current = setTimeout(() => {
            setStatus({
                type: "waiting",
                title: "Menunggu Kartu...",
                detail: null,
            });
        }, 3000);
    };

    const initAudio = () => {
        try {
            const tempAudio = new Audio("/sounds/scan-beep.mp3");
            const playPromise = tempAudio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setTimeout(() => {
                            tempAudio.pause();
                            tempAudio.currentTime = 0;
                        }, 50);
                        setIsAudioReady(true);
                        localStorage.setItem("audioActivated", "true");
                    })
                    .catch(() => {
                        setIsAudioReady(true);
                        localStorage.setItem("audioActivated", "true");
                    });
            } else {
                setIsAudioReady(true);
                localStorage.setItem("audioActivated", "true");
            }
        } catch (e) {
            console.error("Gagal init audio:", e);
            setIsAudioReady(true);
            localStorage.setItem("audioActivated", "true");
        }
    };

    useEffect(() => {
        const handleScan = (e) => {
            if (isAudioReady) {
                const soundToPlay = new Audio("/sounds/scan-beep.mp3");
                soundToPlay
                    .play()
                    .catch((err) =>
                        console.error("Audio scan gagal diputar:", err)
                    );
            }

            setStatus({ type: e.type, title: e.title, detail: e.detail });
            resetStatus();

            if (e.type === "success") {
                mutate();
            }
        };

        window.Echo.channel("attendance-channel").listen(
            "AttendanceScanned",
            handleScan
        );

        return () => {
            window.Echo.channel("attendance-channel").stopListening(
                "AttendanceScanned"
            );
            clearTimeout(statusTimerRef.current);
        };
    }, [mutate, isAudioReady]);

    return {
        status,
        attendanceRecords,
        attendanceCount,
        isSessionActive,
        isLoading: recordsLoading || statusLoading,
        error: swrError || statusError,
        isAudioReady,
        initAudio,
    };
};

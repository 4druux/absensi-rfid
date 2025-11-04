import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import "@/bootstrap";

export const useAttendance = () => {
    const {
        data: dashboardData,
        error: swrError,
        mutate,
        isLoading: dataLoading,
    } = useSWR("/api/dashboard-data", fetcher, {
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

    const attendanceRecords = dashboardData?.attendanceRecords || [];
    const attendanceCount = dashboardData?.attendanceCount || 0;
    const isSessionActive = !!dashboardData?.isSessionActive && !dataLoading;

    useEffect(() => {
        if (dashboardData?.status) {
            setStatus(dashboardData.status);
            resetStatus();
        }
    }, [dashboardData]);

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
        isLoading: dataLoading,
        error: swrError,
        isAudioReady,
        initAudio,
    };
};

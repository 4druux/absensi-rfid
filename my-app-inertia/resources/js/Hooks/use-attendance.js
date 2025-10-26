import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import "@/bootstrap";

// Hapus definisi Audio di sini
// const scanSound = new Audio("/sounds/scan-beep.mp3");
// scanSound.load();

export const useAttendance = () => {
    const {
        data: initialRecords,
        error: swrError,
        mutate,
    } = useSWR("/api/attendance/today", fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    const [status, setStatus] = useState({
        type: "waiting",
        title: "Scan Kartu Pelajar Anda...",
        detail: null,
    });

    const statusTimerRef = useRef(null);

    const [isAudioReady, setIsAudioReady] = useState(() => {
        return localStorage.getItem("audioActivated") === "true";
    });

    const attendanceRecords = initialRecords || [];
    const attendanceCount = attendanceRecords.length;

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
        // Coba buat dan putar instance audio dummy singkat saat klik
        try {
            const tempAudio = new Audio("/sounds/scan-beep.mp3"); // Arahkan ke file yang valid
            const playPromise = tempAudio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setTimeout(() => {
                            tempAudio.pause();
                            tempAudio.currentTime = 0;
                        }, 50); // Jeda setelah 50ms
                        setIsAudioReady(true);
                        localStorage.setItem("audioActivated", "true");
                    })
                    .catch(() => {
                        // Fallback jika tetap diblokir
                        setIsAudioReady(true);
                        localStorage.setItem("audioActivated", "true");
                    });
            } else {
                setIsAudioReady(true);
                localStorage.setItem("audioActivated", "true");
            }
        } catch (e) {
            console.error("Gagal init audio:", e);
            // Fallback terakhir
            setIsAudioReady(true);
            localStorage.setItem("audioActivated", "true");
        }
    };

    useEffect(() => {
        const handleScan = (e) => {
            if (isAudioReady) {
                // Buat instance Audio baru SETIAP KALI event masuk
                const soundToPlay = new Audio("/sounds/scan-beep.mp3");
                soundToPlay
                    .play()
                    .catch((err) =>
                        console.error("Audio scan gagal diputar:", err)
                    );
            }

            setStatus({
                type: e.type,
                title: e.title,
                detail: e.detail,
            });

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
        isLoading: !swrError && !initialRecords,
        error: swrError,
        isAudioReady,
        initAudio,
    };
};

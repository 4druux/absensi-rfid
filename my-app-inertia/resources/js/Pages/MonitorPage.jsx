import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import AttendanceHeader from "@/Components/home/attendance-header";
import StatusCard from "@/Components/home/status-card";
import DotLoader from "@/Components/ui/dot-loader";
import { Volume2 } from "lucide-react";
import "@/bootstrap";

const MonitorPage = ({ identifier }) => {
    const {
        data: monitorData,
        error,
        isLoading,
        mutate,
    } = useSWR(identifier ? `/api/monitor-data/${identifier}` : null, fetcher, {
        refreshInterval: 2000,
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            if (error.response?.status === 404) return;
            setTimeout(() => revalidate({ retryCount }), 5000);
        },
    });

    const [isAudioReady, setIsAudioReady] = React.useState(false);
    const initAudio = () => {
        setIsAudioReady(true);
    };

    const [realTimeStatus, setRealTimeStatus] = useState(null);
    const statusTimerRef = useRef(null);

    const isSessionActive = monitorData?.isSessionActive || false;
    const attendanceCount = monitorData?.attendanceCount || 0;

    const initialStatus = monitorData?.status || {
        type: "waiting",
        title: "Menghubungkan...",
        detail: "Memuat status sesi...",
    };
    const hookStatus = realTimeStatus || initialStatus;

    useEffect(() => {
        const resetStatus = () => {
            clearTimeout(statusTimerRef.current);
            statusTimerRef.current = setTimeout(() => {
                setRealTimeStatus(null);
            }, 3000);
        };

        const handleScan = (e) => {
            if (isAudioReady) {
                let soundFile = "/sounds/scan-beep.mp3";
                if (e.type === "error" || e.type === "duplicate") {
                    soundFile = "/sounds/scan-error.mp3";
                }

                const soundToPlay = new Audio(soundFile);
                soundToPlay
                    .play()
                    .catch((err) =>
                        console.error("Audio scan gagal diputar:", err)
                    );
            }

            setRealTimeStatus({
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

    if (isLoading && !monitorData && !error) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-screen px-4">
                <p className="text-lg text-red-600 font-medium text-center">
                    Gagal terhubung ke Titik Absen.
                </p>
                <p className="text-sm text-gray-500 text-center">
                    (
                    {error.response?.data?.message ||
                        "Pastikan identifier URL sudah benar."}
                    )
                </p>
            </div>
        );
    }

    const statusCardProp = {
        type: hookStatus.type,
        message: (
            <>
                {hookStatus.title}
                {hookStatus.detail && (
                    <>
                        <br /> <p>{hookStatus.detail}</p>
                    </>
                )}
            </>
        ),
    };

    const handleEnterMonitor = () => {
        initAudio();
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    return (
        <div className="h-screen p-4 sm:p-6 lg:p-8">
            {!isAudioReady && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center cursor-pointer"
                    onClick={handleEnterMonitor}
                >
                    <div className="flex flex-col items-center gap-4 text-white p-6 rounded-lg text-center">
                        <Volume2 className="w-16 h-16" />
                        <h2 className="text-2xl font-bold">
                            Masuk Mode Monitor
                        </h2>
                        <p className="text-lg">
                            Klik di mana saja untuk mengaktifkan suara dan masuk
                            mode layar penuh.
                        </p>
                    </div>
                </div>
            )}

            <div className="h-full flex flex-col space-y-4 md:space-y-6">
                <AttendanceHeader
                    count={attendanceCount}
                    isSessionActive={isSessionActive}
                />
                <StatusCard
                    status={statusCardProp}
                    sessionActive={isSessionActive}
                    className="flex-1"
                />
            </div>
        </div>
    );
};

MonitorPage.layout = null;

export default MonitorPage;

import AttendanceHeader from "@/Components/home/attendance-header";
import StatusCard from "@/Components/home/status-card";
import { useAttendance } from "@/Hooks/use-attendance";
import DotLoader from "@/Components/ui/dot-loader";
import { Volume2 } from "lucide-react";

const MonitorPage = () => {
    const {
        status: hookStatus,
        attendanceCount,
        isSessionActive,
        isLoading,
        error,
        isAudioReady,
        initAudio,
    } = useAttendance();

    if (isLoading && attendanceCount === 0) {
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
                    Gagal memuat data absensi. Pastikan server API berjalan.
                </p>
                <p className="text-sm text-gray-500 text-center">
                    ({error.message})
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
                            Aktifkan Notifikasi Suara
                        </h2>
                        <p className="text-lg">
                            Klik di mana saja untuk mengaktifkan suara saat
                            scan.
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

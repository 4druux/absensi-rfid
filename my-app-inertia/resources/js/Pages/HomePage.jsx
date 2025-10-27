import AttendanceTable from "@/Components/home/attendance-table";
import AttendanceHeader from "@/Components/home/attendance-header";
import StatusCard from "@/Components/home/status-card";
import AttendanceCard from "@/Components/home/attendance-card";
import { useAttendance } from "@/Hooks/use-attendance";
import DotLoader from "@/Components/ui/dot-loader";
import { Volume2 } from "lucide-react";

const HomePage = () => {
    const {
        status: hookStatus,
        attendanceRecords,
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
            <div className="flex flex-col gap-4 justify-center items-center h-[80vh]">
                <p className="text-lg text-red-600">
                    Gagal memuat data absensi. Silakan refresh halaman. (
                    {error.message})
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
                        {" "}
                        <br /> <p>{hookStatus.detail}</p>{" "}
                    </>
                )}
            </>
        ),
    };

    return (
        <>
            {!isAudioReady && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center cursor-pointer"
                    onClick={initAudio}
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

            <div className="space-y-4 md:space-y-6">
                <AttendanceHeader
                    count={attendanceCount}
                    isSessionActive={isSessionActive}
                />
                <StatusCard
                    status={statusCardProp}
                    sessionActive={isSessionActive}
                />
                <div className="hidden xl:block">
                    <AttendanceTable records={attendanceRecords} />
                </div>
                <div className="xl:hidden">
                    <AttendanceCard records={attendanceRecords} />
                </div>
            </div>
        </>
    );
};

export default HomePage;

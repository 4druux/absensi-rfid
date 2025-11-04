import AttendanceTable from "@/Components/home/attendance-table";
import AttendanceHeader from "@/Components/home/attendance-header";
import StatusCard from "@/Components/home/status-card";
import AttendanceCard from "@/Components/home/attendance-card";
import { useAttendance } from "@/Hooks/use-attendance";
import DotLoader from "@/Components/ui/dot-loader";
import { Monitor } from "lucide-react";

const HomePage = () => {
    const {
        status: hookStatus,
        attendanceRecords,
        attendanceCount,
        isSessionActive,
        isLoading,
        error,
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
        <div className="mb-4">
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

            <a
                href={route("titik-absen.index")}
                target="_blank"
                rel="noopener noreferrer"
                className="
                    fixed top-1/2 right-0 z-50 transform -translate-y-1/2 
                    flex items-center 
                    bg-indigo-600/60 text-white 
                    rounded-l-full shadow-lg 
                    h-12 
                    group 
                    transition-all duration-300 ease-in-out
                    overflow-hidden
                    hover:shadow-xl hover:pr-5
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                "
            >
                <div className="p-3">
                    <Monitor className="w-6 h-6" />
                </div>

                <span
                    className="
                        font-medium whitespace-nowrap 
                        max-w-0 opacity-0 
                        group-hover:max-w-xs group-hover:opacity-100 
                        transition-all duration-300 ease-in-out hover:underline text-sm
                    "
                >
                    Buka Monitor
                </span>
            </a>
        </div>
    );
};

export default HomePage;

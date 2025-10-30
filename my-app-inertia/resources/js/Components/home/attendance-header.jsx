import { useState, useEffect } from "react";
import { Calendar, Clock, PlayCircle, XCircle } from "lucide-react";

function AttendanceHeader({ count, isSessionActive }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    const formatDate = (date) => {
        const days = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ];
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${day} ${month} ${year}`;
    };

    const sessionText = isSessionActive ? "Aktif" : "Tidak Aktif";

    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 md:gap-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 md:p-6 border border-amber-200">
                <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-amber-500 rounded-full">
                    <Clock
                        className="w-5 h-5 md:w-7 md:h-7 text-white"
                        strokeWidth={2}
                    />
                </div>
                <div className="text-amber-500">
                    <p className="text-sm md:text-md font-medium">
                        Waktu Saat Ini
                    </p>
                    <p className="text-md md:text-2xl font-bold tracking-tight">
                        {formatTime(currentTime)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 md:p-6 border border-cyan-200">
                <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-cyan-500 rounded-full">
                    <Calendar
                        className="w-5 h-5 md:w-7 md:h-7 text-white"
                        strokeWidth={2}
                    />
                </div>
                <div className="text-cyan-500">
                    <p className="text-sm md:text-md font-medium">Tanggal</p>
                    <p className="text-md md:text-2xl font-bold tracking-tight">
                        {formatDate(currentTime)}
                    </p>
                </div>
            </div>
            <div
                className={`flex items-center gap-2 md:gap-4 rounded-lg p-3 md:p-6 border ${
                    isSessionActive
                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                        : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                }`}
            >
                <div
                    className={`flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full ${
                        isSessionActive ? "bg-emerald-500" : "bg-gray-500"
                    }`}
                >
                    {isSessionActive ? (
                        <PlayCircle
                            className="w-5 h-5 md:w-7 md:h-7 text-white"
                            strokeWidth={2}
                        />
                    ) : (
                        <XCircle
                            className="w-5 h-5 md:w-7 md:h-7 text-white"
                            strokeWidth={2}
                        />
                    )}
                </div>
                <div
                    className={
                        isSessionActive ? "text-emerald-500" : "text-gray-500"
                    }
                >
                    <p className="text-sm md:text-md font-medium">
                        Sesi Absensi {sessionText}
                    </p>
                    {isSessionActive && (
                        <p className="text-md md:text-2xl font-bold tracking-tight">
                            {count} Siswa Hadir
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AttendanceHeader;

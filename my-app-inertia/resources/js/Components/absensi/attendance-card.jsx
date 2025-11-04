import React from "react";
import {
    CheckCircle2,
    XCircle,
    Calendar,
    Clock,
    Mars,
    Venus,
    Fingerprint,
    Ban,
    Stethoscope,
    CalendarCheck,
} from "lucide-react";
import ManualStatusDropdown from "./manual-status-dropdown";

const AttendanceCard = ({ records, onManualAttendance, isToggling }) => {
    const getStatusDisplay = (status) => {
        switch (status) {
            case "Hadir":
                return {
                    label: "Hadir",
                    className: "bg-emerald-50 text-emerald-600",
                    icon: <CheckCircle2 className="h-3 w-3" />,
                };
            case "Telat":
                return {
                    label: "Telat",
                    className: "bg-yellow-50 text-yellow-600",
                    icon: <Clock className="h-3 w-3" />,
                };
            case "Sakit":
                return {
                    label: "Sakit",
                    className: "bg-blue-50 text-blue-600",
                    icon: <Stethoscope className="h-3 w-3" />,
                };
            case "Izin":
                return {
                    label: "Izin",
                    className: "bg-red-50 text-red-600",
                    icon: <CalendarCheck className="h-3 w-3" />,
                };
            case "Bolos":
                return {
                    label: "Bolos",
                    className: "bg-pink-50 text-pink-600",
                    icon: <Ban className="h-3 w-3" />,
                };
            default:
                return {
                    label: "Alfa",
                    className: "bg-red-50 text-red-600",
                    icon: <XCircle className="h-3 w-3" />,
                };
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            {records.map((record, index) => {
                const statusDisplay = getStatusDisplay(record.status);

                return (
                    <div
                        key={record.siswa_id}
                        className="border rounded-xl border-slate-300"
                    >
                        <div className="flex items-start justify-between p-4">
                            <div className="flex items-start gap-2">
                                <p className="text-sm font-medium text-gray-800 pt-px">
                                    {index + 1}.
                                </p>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-medium text-gray-800">
                                        {record.nama}
                                    </p>

                                    <div className="flex items-center gap-2 text-gray-800">
                                        <Fingerprint className="w-5 h-5 flex-shrink-0" />
                                        <div className="flex flex-col text-sm font-medium">
                                            <span className="text-xs font-normal">
                                                RFID:{" "}
                                            </span>
                                            {record.rfid || "-"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-800">
                                        {record.jenis_kelamin === "L" ? (
                                            <Mars className="w-5 h-5 flex-shrink-0" />
                                        ) : (
                                            <Venus className="w-5 h-5 flex-shrink-0" />
                                        )}
                                        <div className="flex flex-col text-sm font-medium">
                                            <span className="text-xs font-normal">
                                                Jenis Kelamin:{" "}
                                            </span>
                                            {record.jenis_kelamin === "L"
                                                ? "Laki-laki"
                                                : "Perempuan"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusDisplay.className}`}
                                >
                                    {statusDisplay.icon}
                                    {statusDisplay.label}
                                </span>
                            </div>
                        </div>
                        <div className="px-4 pb-3 flex justify-end">
                            <ManualStatusDropdown
                                siswaId={record.siswa_id}
                                currentStatus={record.status}
                                onManualAttendance={onManualAttendance}
                                isToggling={isToggling}
                            />
                        </div>
                        {record.status !== "Alfa" && (
                            <div className="px-4 py-3 border-t rounded-b-xl border-slate-300 bg-gray-100 text-sm text-gray-600 space-y-1">
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />

                                    {record.tanggal_absen || "-"}
                                </p>

                                <p className="flex items-center gap-2 font-mono">
                                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />

                                    {record.waktu_absen || "-"}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AttendanceCard;

import React from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Ban,
    Stethoscope,
    CalendarCheck,
} from "lucide-react";
import ManualStatusDropdown from "./manual-status-dropdown";

const AttendanceTable = ({ records, onManualAttendance, isToggling }) => {
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
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Nama Siswa
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            RFID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Jenis Kelamin
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Tanggal Absen
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Waktu Absen
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Aksi Manual
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {records.map((record, index) => {
                        const statusDisplay = getStatusDisplay(record.status);

                        return (
                            <tr
                                key={record.siswa_id}
                                className="even:bg-slate-50 hover:bg-slate-100"
                            >
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                    {index + 1}.
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                    {record.nama}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                    {record.rfid || "-"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                    {record.jenis_kelamin === "L" ? "L" : "P"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${statusDisplay.className}`}
                                    >
                                        {statusDisplay.icon}
                                        {statusDisplay.label}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                    {record.tanggal_absen || "-"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-mono text-gray-500">
                                    {record.waktu_absen || "-"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm">
                                    <ManualStatusDropdown
                                        siswaId={record.siswa_id}
                                        currentStatus={record.status}
                                        onManualAttendance={onManualAttendance}
                                        isToggling={isToggling}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;

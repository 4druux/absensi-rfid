import React from "react";
import {
    CheckCircle2,
    XCircle,
    Calendar,
    Clock,
    Mars,
    Venus,
    Fingerprint,
    Loader2,
} from "lucide-react";
import Button from "@/Components/ui/button";

const AttendanceCard = ({ records, onToggle, isToggling }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {records.map((record, index) => (
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
                            {record.status === "Hadir" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                                    <CheckCircle2 className="h-3 w-3" /> Hadir
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                                    <XCircle className="h-3 w-3" /> Alfa
                                </span>
                            )}
                            {/* <Button
                                variant="outline"
                                size="sm"
                                className={`text-xs ${
                                    record.status === "Hadir"
                                        ? "text-red-600 border-red-500 hover:bg-red-50"
                                        : "text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                                }`}
                                onClick={() => onToggle(record.siswa_id)}
                                disabled={isToggling === record.siswa_id}
                            >
                                {isToggling === record.siswa_id
                                    ? "..."
                                    : record.status === "Hadir"
                                    ? "Batalkan"
                                    : "Hadirkan"}
                            </Button> */}
                        </div>
                    </div>

                    <div className="flex items-end justify-end pr-4 pb-4">
                        {record.status !== "Hadir" && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                                onClick={() => onToggle(record.siswa_id)}
                                disabled={isToggling === record.siswa_id}
                                iconLeft={
                                    isToggling === record.siswa_id ? (
                                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                                    ) : null
                                }
                            >
                                {isToggling === record.siswa_id
                                    ? "Loading..."
                                    : "Hadirkan"}
                            </Button>
                        )}
                    </div>

                    {record.status === "Hadir" && (
                        <div className="px-4 py-3 border-t rounded-b-xl border-slate-300 bg-gray-100 text-sm text-gray-600 space-y-1">
                            <p className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                {record.tanggal_absen
                                    ? new Date(
                                          record.tanggal_absen
                                      ).toLocaleDateString("id-ID", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : "-"}
                            </p>
                            <p className="flex items-center gap-2 font-mono">
                                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                {record.waktu_absen || "-"}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AttendanceCard;

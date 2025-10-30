import React from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Button from "@/Components/ui/button";

const AttendanceTable = ({ records, onToggle, isToggling }) => {
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
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {records.map((record, index) => (
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
                                {record.status === "Hadir" ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Hadir
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                                        <XCircle className="h-3 w-3" />
                                        Alfa
                                    </span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                                {record.tanggal_absen
                                    ? new Date(
                                          record.tanggal_absen
                                      ).toLocaleDateString("id-ID", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : "-"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-mono text-gray-500">
                                {record.waktu_absen || "-"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-sm">
                                {/* <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                        record.status === "Hadir"
                                            ? "text-red-600 border-red-500 hover:bg-red-50"
                                            : "text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                                    }
                                    onClick={() => onToggle(record.siswa_id)}
                                    disabled={isToggling === record.siswa_id}
                                >
                                    {isToggling === record.siswa_id
                                        ? "..."
                                        : record.status === "Hadir"
                                        ? "Batalkan"
                                        : "Hadirkan"}
                                </Button> */}

                                {record.status !== "Hadir" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                                        onClick={() =>
                                            onToggle(record.siswa_id)
                                        }
                                        disabled={
                                            isToggling === record.siswa_id
                                        }
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;

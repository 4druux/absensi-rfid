import React, { useState } from "react";
import Button from "@/Components/ui/button";
import { Link, Link2Off, Trash2, KeySquare, Copy, Check } from "lucide-react";

const TitikAbsenCard = ({
    records,
    isSubmitting,
    onDelete,
    onAssign,
    onUnassign,
}) => {
    const [copiedKey, setCopiedKey] = useState(null);

    const handleCopy = (key) => {
        if (isSubmitting || !key) return;
        navigator.clipboard.writeText(key).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            {records.map((titik, index) => (
                <div
                    key={titik.id}
                    className="border rounded-xl border-slate-300"
                >
                    <div className="flex flex-col items-start justify-between p-4 gap-4">
                        <div className="flex items-start gap-2 w-full">
                            <p className="text-sm font-medium text-gray-800 pt-px">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-sm font-medium text-gray-800">
                                    {titik.nama_titik}
                                </p>

                                <div className="flex items-start gap-2 text-gray-800">
                                    <KeySquare className="w-5 h-5 flex-shrink-0 text-gray-500" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            API Key:{" "}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs break-all">
                                                {titik.api_key}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCopy(titik.api_key)
                                                }
                                                disabled={isSubmitting}
                                                className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 flex-shrink-0"
                                            >
                                                {copiedKey === titik.api_key ? (
                                                    <Check className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Link className="w-5 h-5 flex-shrink-0" />
                                    <a
                                        href={route("monitor", {
                                            identifier: titik.identifier,
                                        })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium hover:underline font-mono break-all"
                                    >
                                        {`monitor/${titik.identifier}`}
                                    </a>
                                </div>

                                {titik.pertemuan_aktif &&
                                titik.pertemuan_aktif.length > 0 ? (
                                    <div>
                                        <p className="font-medium text-gray-800 text-xs mt-2">
                                            Sesi Aktif:
                                        </p>
                                        <ul className="space-y-2 mt-1 pl-2">
                                            {titik.pertemuan_aktif.map(
                                                (sesi) => (
                                                    <li
                                                        key={sesi.id}
                                                        className="flex items-start justify-between gap-3"
                                                    >
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span>-</span>
                                                            <span className="font-semibold text-gray-700 break-all">
                                                                {sesi.kelas
                                                                    ? `${sesi.kelas.nama_kelas} ${sesi.kelas.kelompok} - `
                                                                    : ""}
                                                                {sesi.title}
                                                            </span>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onUnassign(
                                                                    titik,
                                                                    sesi
                                                                )
                                                            }
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className="flex items-center justify-center flex-shrink-0"
                                                        >
                                                            <Link2Off className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="text-xs font-medium text-gray-500 italic mt-4">
                                        Tidak ada sesi aktif
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="px-4 py-3 border-t rounded-b-xl border-slate-300 bg-gray-100 text-sm text-gray-600 space-y-2">
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="danger"
                                size="sm"
                                className="w-full text-red-600 border-red-500 hover:bg-red-50"
                                onClick={() => onDelete(titik)}
                                disabled={isSubmitting}
                                iconLeft={<Trash2 className="w-3.5 h-3.5" />}
                            >
                                Hapus
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                                onClick={() => onAssign(titik)}
                                disabled={isSubmitting}
                                iconLeft={<Link className="w-3.5 h-3.5" />}
                            >
                                Hubungkan
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TitikAbsenCard;

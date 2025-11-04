import React, { useState } from "react";
import Button from "@/Components/ui/button";
import { Check, Copy, Link, Link2Off, Trash2 } from "lucide-react";

const TitikAbsenTable = ({
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
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Nama Titik
                        </th>
                        <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Sesi Aktif
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            API Key
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            URL Monitor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {records.map((titik) => (
                        <tr
                            key={titik.id}
                            className="even:bg-slate-50 hover:bg-slate-100"
                        >
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                {titik.nama_titik}
                            </td>
                            <td className="whitespace-nowrap py-4 text-sm text-gray-800">
                                {titik.pertemuan_aktif &&
                                titik.pertemuan_aktif.length > 0 ? (
                                    <ul className="space-y-2">
                                        {titik.pertemuan_aktif.map((sesi) => (
                                            <li
                                                key={sesi.id}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="font-semibold text-gray-700">
                                                    {sesi.kelas
                                                        ? `${sesi.kelas.nama_kelas} ${sesi.kelas.kelompok} - `
                                                        : ""}
                                                    {sesi.title}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onUnassign(titik, sesi)
                                                    }
                                                    disabled={isSubmitting}
                                                    className="flex items-center justify-center"
                                                >
                                                    <Link2Off className="w-4 h-4 text-red-600" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-gray-500 italic">
                                        Tidak ada sesi
                                    </span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-mono text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span>{titik.api_key}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(titik.api_key)
                                        }
                                        disabled={isSubmitting}
                                        className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        {copiedKey === titik.api_key ? (
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-mono">
                                <a
                                    href={route("monitor", {
                                        identifier: titik.identifier,
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                >
                                    {`/monitor/${titik.identifier}`}
                                </a>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm space-x-2">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="text-red-600 border-red-500 hover:bg-red-50"
                                    onClick={() => onDelete(titik)}
                                    disabled={isSubmitting}
                                    iconLeft={
                                        <Trash2 className="w-3.5 h-3.5" />
                                    }
                                >
                                    Hapus
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                                    onClick={() => onAssign(titik)}
                                    disabled={isSubmitting}
                                    iconLeft={<Link className="w-3.5 h-3.5" />}
                                >
                                    Hubungkan
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TitikAbsenTable;

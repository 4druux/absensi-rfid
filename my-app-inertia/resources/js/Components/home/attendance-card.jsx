import React, { useState } from "react";
import {
    School,
    Clock,
    List,
    Users,
    CheckCircle2,
    XCircle,
    Ban,
    Stethoscope,
    CalendarCheck,
    User,
    Hash,
} from "lucide-react";
import HeaderContent from "../ui/header-content";
import DataNotFound from "../ui/data-not-found";
import { useExport } from "@/Hooks/use-export";
import Button from "../ui/button";
import { FaRegFilePdf } from "react-icons/fa6";
import { RiFileExcel2Line } from "react-icons/ri";

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
        case "Alfa":
        default:
            if (status === "Alfa") {
                return {
                    label: "Alfa",
                    className: "bg-red-50 text-red-600",
                    icon: <XCircle className="h-3 w-3" />,
                };
            }
            return {
                label: "Hadir",
                className: "bg-emerald-50 text-emerald-600",
                icon: <CheckCircle2 className="h-3 w-3" />,
            };
    }
};

const AttendanceCard = ({ records = [] }) => {
    const [genderFilter, setGenderFilter] = useState("All");
    const { handleExport, downloadingStatus } = useExport();

    const genderFilters = [
        {
            value: "All",
            label: "Semua",
            positionClasses: "border border-gray-300 rounded-l-lg",
        },
        {
            value: "L",
            label: "Laki-laki",
            positionClasses: "border-t border-b border-gray-300",
        },
        {
            value: "P",
            label: "Perempuan",
            positionClasses: "border border-gray-300 rounded-r-lg",
        },
    ];

    const filteredRecords = records.filter((record) => {
        if (genderFilter === "All") return true;
        return record.jenis_kelamin === genderFilter;
    });

    const studentDetails = [
        { icon: Users, label: `${filteredRecords.length} Total Siswa` },
    ];

    const handleExportAbsentPdf = () => {
        handleExport("absentPdf", "attendance.session.export.absent.pdf", {
            gender: genderFilter,
        });
    };

    const handleExportAbsentExcel = () => {
        handleExport("absentExcel", "attendance.session.export.absent.excel", {
            gender: genderFilter,
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-3 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                <HeaderContent
                    Icon={List}
                    title="Daftar Absen Siswa"
                    details={studentDetails}
                />
                <div className="flex justify-end gap-2 flex-shrink-0 w-full lg:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleExportAbsentPdf}
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<FaRegFilePdf className="h-5 w-5" />}
                        disabled={downloadingStatus.absentPdf}
                        className="w-1/2 lg:w-auto"
                    >
                        {downloadingStatus.absentPdf
                            ? "Mengunduh..."
                            : "Export PDF"}
                    </Button>
                    <Button
                        onClick={handleExportAbsentExcel}
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<RiFileExcel2Line className="h-5 w-5" />}
                        disabled={downloadingStatus.absentExcel}
                        className="w-1/2 lg:w-auto"
                    >
                        {downloadingStatus.absentExcel
                            ? "Mengunduh..."
                            : "Export Excel"}
                    </Button>
                </div>
            </div>

            <div className="flex justify-end items-end my-4 px-3">
                <div className="inline-flex rounded-lg shadow-sm" role="group">
                    {genderFilters.map((filter) => {
                        const isActive = genderFilter === filter.value;

                        const buttonClasses = [
                            "px-4 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none",
                            filter.positionClasses,
                            isActive
                                ? "bg-indigo-600 text-white z-10 border-indigo-600"
                                : "bg-white text-gray-700 hover:bg-gray-50",
                        ].join(" ");

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setGenderFilter(filter.value)}
                                className={buttonClasses}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {filteredRecords.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 mt-4">
                    {filteredRecords.map((record, index) => {
                        const statusDisplay = getStatusDisplay(record.status);
                        return (
                            <div
                                key={record.id}
                                className="border rounded-xl border-gray-300"
                            >
                                <div className="p-4 flex items-start gap-3">
                                    <p className="text-sm font-medium text-gray-700 pt-0.5">
                                        {index + 1}.
                                    </p>

                                    <div className="flex flex-col gap-2 w-full">
                                        <p className="text-base font-medium text-gray-700">
                                            {record.nama}
                                        </p>

                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User className="w-4 h-4" />
                                            <div className="flex justify-between w-full text-sm">
                                                <span className="text-xs font-normal text-gray-500">
                                                    Jenis Kelamin:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {record.jenis_kelamin ===
                                                    "L"
                                                        ? "L"
                                                        : "P"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-700">
                                            <School className="w-4 h-4" />
                                            <div className="flex justify-between w-full text-sm">
                                                <span className="text-xs font-normal text-gray-500">
                                                    Kelas:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {record.kelas}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Hash className="w-4 h-4" />
                                            <div className="flex justify-between w-full text-sm">
                                                <span className="text-xs font-normal text-gray-500">
                                                    RFID:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {record.rfid || "-"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Clock className="w-4 h-4" />
                                            <div className="flex justify-between w-full text-sm">
                                                <span className="text-xs font-normal text-gray-500">
                                                    Waktu Absen:
                                                </span>
                                                <span className="font-mono font-medium text-gray-800">
                                                    {record.waktu_absen || "-"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-700">
                                            {React.cloneElement(
                                                statusDisplay.icon,
                                                {
                                                    className: "w-4 h-4",
                                                }
                                            )}
                                            <div className="flex justify-between w-full text-sm">
                                                <span className="text-xs font-normal text-gray-500">
                                                    Status:
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusDisplay.className}`}
                                                >
                                                    {statusDisplay.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <DataNotFound message="Tidak ada siswa yang cocok dengan filter." />
            )}
        </div>
    );
};

export default AttendanceCard;

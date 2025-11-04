import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import { X, Check, Loader2 } from "lucide-react";
import Button from "@/Components/ui/button";
import DotLoader from "@/Components/ui/dot-loader";
import SearchBar from "../ui/search-bar";

const formatDate = (dateString) => {
    if (!dateString) {
        return "Tgl tidak diatur";
    }
    try {
        const datePart = dateString.split("T")[0];
        const [year, month, day] = datePart.split("-");
        return `${day}/${month}/${year}`;
    } catch (error) {
        return dateString;
    }
};

const AssignModal = ({ isOpen, onClose, onAssign, titikAbsen }) => {
    const {
        data: pertemuan,
        error,
        isLoading,
    } = useSWR(isOpen ? "/api/titik-absen/available-pertemuan" : null, fetcher);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [genderFilter, setGenderFilter] = useState("All");

    useEffect(() => {
        if (isOpen) {
            setSelectedIds([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const processedPertemuan = useMemo(() => {
        if (!pertemuan) return [];

        return pertemuan.map((p) => {
            const kelasNama = p.kelas?.nama_kelas || "";
            const kelasKelompok = p.kelas?.kelompok || "";
            const jurusNama = p.kelas?.jurusan?.nama_jurusan || "";

            let nama_kelas_lengkap = kelasNama;
            if (kelasKelompok) nama_kelas_lengkap += ` ${kelasKelompok}`;
            if (jurusNama) nama_kelas_lengkap += ` - ${jurusNama}`;

            const tanggal_pertemuan_formatted = formatDate(p.tanggal_pertemuan);

            return {
                ...p,
                nama_kelas_lengkap,
                tanggal_pertemuan_formatted,
            };
        });
    }, [pertemuan]);

    const filteredPertemuan = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();

        return processedPertemuan.filter((p) => {
            const genderMatch =
                genderFilter === "All" ? true : p.gender === genderFilter;

            const searchMatch =
                lowerCaseSearch === ""
                    ? true
                    : p.title.toLowerCase().includes(lowerCaseSearch) ||
                      p.nama_kelas_lengkap
                          .toLowerCase()
                          .includes(lowerCaseSearch);

            return genderMatch && searchMatch;
        });
    }, [searchTerm, processedPertemuan, genderFilter]);

    const handleSelect = (id) => {
        setSelectedIds((prevIds) => {
            if (prevIds.includes(id)) {
                return prevIds.filter((prevId) => prevId !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    const handleSubmit = () => {
        if (selectedIds.length > 0) {
            onAssign(selectedIds);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    };

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 250,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed bottom-0 left-0 right-0 w-full h-[98dvh] rounded-t-2xl bg-white shadow-xl flex flex-col overflow-hidden md:static md:max-w-3xl md:h-[90vh] md:rounded-2xl"
                    >
                        <div className="sticky top-0 z-10 flex justify-center bg-white py-4 md:hidden">
                            <div className="h-1 w-16 rounded-full bg-gray-300" />
                        </div>

                        <div className="border-b border-slate-300 px-4 pb-4 md:p-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-700">
                                    Hubungkan Sesi ke{" "}
                                    <span className="font-bold text-indigo-600">
                                        {titikAbsen?.nama_titik}
                                    </span>
                                </h3>
                                <div
                                    onClick={onClose}
                                    className="group cursor-pointer rounded-full p-2 hover:bg-slate-50"
                                >
                                    <X className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:rotate-120 group-hover:text-gray-800" />
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleFormSubmit}
                            noValidate
                            className="flex flex-col flex-1 overflow-hidden"
                        >
                            <div className="flex flex-col-reverse lg:flex-row justify-between items-end gap-4 p-4 flex-shrink-0 border-b border-gray-200">
                                <div className="flex justify-center">
                                    <div
                                        className="inline-flex rounded-lg shadow-sm"
                                        role="group"
                                    >
                                        {genderFilters.map((filter) => {
                                            const isActive =
                                                genderFilter === filter.value;

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
                                                    onClick={() =>
                                                        setGenderFilter(
                                                            filter.value
                                                        )
                                                    }
                                                    className={buttonClasses}
                                                >
                                                    {filter.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onClear={() => setSearchTerm("")}
                                    placeholder="Cari Kelas, Pertemuan..."
                                    className="max-w-sm"
                                />
                            </div>

                            <div className="flex flex-col p-4 md:p-6 flex-1 overflow-y-auto">
                                {isLoading && <DotLoader />}
                                {error && (
                                    <p className="text-center text-red-600">
                                        Gagal memuat sesi.
                                    </p>
                                )}

                                {!isLoading && !error && processedPertemuan && (
                                    <div className="space-y-2">
                                        {filteredPertemuan.length > 0 ? (
                                            filteredPertemuan.map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelect(p.id)
                                                    }
                                                    className={`w-full text-left p-3 border rounded-lg flex justify-between items-center transition-all ${
                                                        selectedIds.includes(
                                                            p.id
                                                        )
                                                            ? "border-indigo-500 bg-indigo-50 ring-0"
                                                            : "border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {p.title} |{" "}
                                                            {p.nama_kelas_lengkap
                                                                ? `${p.nama_kelas_lengkap} `
                                                                : ""}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                {p.gender ===
                                                                "L"
                                                                    ? "Laki-laki"
                                                                    : "Perempuan"}
                                                            </span>

                                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                T.A{" "}
                                                                {p.tahun_ajaran}
                                                            </span>

                                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                {
                                                                    p.tanggal_pertemuan_formatted
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {selectedIds.includes(
                                                        p.id
                                                    ) && (
                                                        <Check className="w-5 h-5 text-indigo-600" />
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 italic px-4 py-8">
                                                <p className="font-medium">
                                                    Tidak Ada Hasil
                                                </p>
                                                {searchTerm && (
                                                    <p className="text-sm">
                                                        Untuk pencarian: &quot;
                                                        {searchTerm}&quot;
                                                    </p>
                                                )}
                                                {genderFilter !== "All" && (
                                                    <p className="text-sm">
                                                        Filter:{" "}
                                                        {genderFilter === "L"
                                                            ? "Laki-laki"
                                                            : "Perempuan"}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 p-4 md:p-6 flex-shrink-0 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    iconLeft={<X className="h-4 w-4" />}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={
                                        selectedIds.length === 0 || isLoading
                                    }
                                    iconLeft={
                                        isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )
                                    }
                                >
                                    {isLoading ? "Memuat..." : "Hubungkan Sesi"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AssignModal;

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import DotLoader from "./dot-loader";
import Button from "./button";
import { Loader2, X } from "lucide-react";
import CheckboxItem from "../common/checkbox";
import SearchBar from "./search-bar";

const ExportPertemuanModal = ({
    isOpen,
    onClose,
    onSubmit,
    tahunAjaran,
    namaKelas = null,
    kelasId = null,
}) => {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const apiUrl = useMemo(() => {
        if (!isOpen || !tahunAjaran) {
            return null;
        }
        if (kelasId) {
            return `/api/pertemuan-by-class/${kelasId}?tahun_ajaran=${tahunAjaran}`;
        }
        return `/api/pertemuan-by-year/${tahunAjaran}`;
    }, [isOpen, tahunAjaran, kelasId]);

    const { data: pertemuanData, error, isLoading } = useSWR(apiUrl, fetcher);

    const { lakiLaki, perempuan } = useMemo(() => {
        if (!pertemuanData) {
            return { lakiLaki: [], perempuan: [] };
        }

        const lowerSearch = searchTerm.toLowerCase();

        const filteredData = pertemuanData.filter((p) => {
            if (lowerSearch === "") return true;

            const titleMatch = p.title.toLowerCase().includes(lowerSearch);

            let classMatch = false;
            if (!kelasId && p.nama_kelas) {
                const kelasNama = `${p.nama_kelas} ${p.kelompok}`.toLowerCase();
                classMatch = kelasNama.includes(lowerSearch);
            }

            return titleMatch || classMatch;
        });

        const lakiLaki = filteredData.filter((p) => p.gender === "L");
        const perempuan = filteredData.filter((p) => p.gender === "P");

        return { lakiLaki, perempuan };
    }, [pertemuanData, searchTerm, kelasId]);

    const handleCheckChange = (id) => {
        setSelectedIds((prevSet) => {
            const newSet = new Set(prevSet);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = (genderList, shouldSelect) => {
        setSelectedIds((prevSet) => {
            const newSet = new Set(prevSet);
            const idsToToggle = genderList.map((p) => p.id);

            if (shouldSelect) {
                idsToToggle.forEach((id) => newSet.add(id));
            } else {
                idsToToggle.forEach((id) => newSet.delete(id));
            }
            return newSet;
        });
    };

    const isAllLakiLakiSelected =
        lakiLaki.length > 0 && lakiLaki.every((p) => selectedIds.has(p.id));
    const isAllPerempuanSelected =
        perempuan.length > 0 && perempuan.every((p) => selectedIds.has(p.id));

    useEffect(() => {
        if (!isOpen) {
            setSelectedIds(new Set());
            setIsProcessing(false);
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

    const handleSubmit = async () => {
        if (selectedIds.size === 0) {
            alert("Pilih setidaknya satu pertemuan untuk diekspor.");
            return;
        }
        setIsProcessing(true);
        await onSubmit([...selectedIds]);
        setIsProcessing(false);
        onClose();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    };

    const formatLabel = (pertemuan) => {
        if (!kelasId && pertemuan.nama_kelas) {
            return `${pertemuan.nama_kelas} ${pertemuan.kelompok} - ${pertemuan.title}`;
        }
        return pertemuan.title;
    };

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
                        className="fixed bottom-0 left-0 right-0 w-full max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white shadow-xl md:static md:max-w-2xl md:max-h-[100%] md:rounded-2xl"
                    >
                        <div className="sticky top-0 z-10 flex justify-center bg-white py-4 md:hidden">
                            <div className="h-1 w-16 rounded-full bg-gray-300" />
                        </div>

                        <form onSubmit={handleFormSubmit} noValidate>
                            <div className="border-b border-slate-300 px-4 pb-4 md:p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-medium text-gray-700">
                                            Pilih Pertemuan
                                        </h3>
                                        <h4 className="text-sm font-medium text-gray-500">
                                            {namaKelas && (
                                                <span>{namaKelas} </span>
                                            )}
                                            T.A {tahunAjaran}
                                        </h4>
                                    </div>
                                    <div
                                        onClick={onClose}
                                        className="group cursor-pointer rounded-full p-2 hover:bg-slate-50"
                                    >
                                        <X className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:rotate-120 group-hover:text-gray-800" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 md:px-6 border-b border-gray-200">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onClear={() => setSearchTerm("")}
                                    placeholder="Cari pertemuan (atau kelas)..."
                                />
                            </div>

                            <div className="flex flex-col p-4 md:p-6">
                                <div className="space-y-4">
                                    {isLoading && (
                                        <div className="flex justify-center items-center h-40">
                                            <DotLoader />
                                        </div>
                                    )}

                                    {error && (
                                        <div className="text-red-600 text-center">
                                            Gagal memuat data pertemuan.
                                        </div>
                                    )}

                                    {pertemuanData &&
                                        !isLoading &&
                                        lakiLaki.length === 0 &&
                                        perempuan.length === 0 &&
                                        searchTerm && (
                                            <div className="text-center text-gray-500 italic px-4 py-8">
                                                <p className="font-medium">
                                                    Tidak Ada Hasil
                                                </p>
                                                <p className="text-sm">
                                                    Untuk pencarian: &quot;
                                                    {searchTerm}&quot;
                                                </p>
                                            </div>
                                        )}

                                    {pertemuanData &&
                                        !isLoading &&
                                        (lakiLaki.length > 0 ||
                                            perempuan.length > 0) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Kolom Laki-laki */}
                                                <div className="space-y-2">
                                                    <h4 className="text-md font-medium text-gray-800 border-b pb-2">
                                                        Laki-laki
                                                    </h4>
                                                    {lakiLaki.length > 0 ? (
                                                        <div className="max-h-[40vh] overflow-y-auto">
                                                            <CheckboxItem
                                                                id="all-l"
                                                                label="Pilih Semua"
                                                                checked={
                                                                    isAllLakiLakiSelected
                                                                }
                                                                onChange={(e) =>
                                                                    handleSelectAll(
                                                                        lakiLaki,
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                            <div className="pl-4 border-l">
                                                                {lakiLaki.map(
                                                                    (
                                                                        pertemuan
                                                                    ) => (
                                                                        <CheckboxItem
                                                                            key={
                                                                                pertemuan.id
                                                                            }
                                                                            id={`p-${pertemuan.id}`}
                                                                            label={formatLabel(
                                                                                pertemuan
                                                                            )}
                                                                            checked={selectedIds.has(
                                                                                pertemuan.id
                                                                            )}
                                                                            onChange={() =>
                                                                                handleCheckChange(
                                                                                    pertemuan.id
                                                                                )
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">
                                                            Tidak ada pertemuan.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Kolom Perempuan */}
                                                <div className="space-y-2">
                                                    <h4 className="text-md font-medium text-gray-800 border-b pb-2">
                                                        Perempuan
                                                    </h4>
                                                    {perempuan.length > 0 ? (
                                                        <div className="max-h-[40vh] overflow-y-auto">
                                                            <CheckboxItem
                                                                id="all-p"
                                                                label="Pilih Semua"
                                                                checked={
                                                                    isAllPerempuanSelected
                                                                }
                                                                onChange={(e) =>
                                                                    handleSelectAll(
                                                                        perempuan,
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                            />
                                                            <div className="pl-4 border-l">
                                                                {perempuan.map(
                                                                    (
                                                                        pertemuan
                                                                    ) => (
                                                                        <CheckboxItem
                                                                            key={
                                                                                pertemuan.id
                                                                            }
                                                                            id={`p-${pertemuan.id}`}
                                                                            label={formatLabel(
                                                                                pertemuan
                                                                            )}
                                                                            checked={selectedIds.has(
                                                                                pertemuan.id
                                                                            )}
                                                                            onChange={() =>
                                                                                handleCheckChange(
                                                                                    pertemuan.id
                                                                                )
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">
                                                            Tidak ada pertemuan.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 p-4 md:p-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isProcessing || isLoading}
                                    iconLeft={<X className="h-4 w-4" />}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={
                                        isProcessing ||
                                        isLoading ||
                                        selectedIds.size === 0
                                    }
                                    iconLeft={
                                        isProcessing ? (
                                            <Loader2 className="animate-spin h-4 w-4" />
                                        ) : null
                                    }
                                >
                                    {isProcessing
                                        ? "Memproses..."
                                        : `(${selectedIds.size}) Export Pertemuan`}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExportPertemuanModal;

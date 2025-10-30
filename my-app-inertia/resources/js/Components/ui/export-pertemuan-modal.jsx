import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import DotLoader from "./dot-loader";
import Button from "./button";
import { Loader2, X } from "lucide-react";
import CheckboxItem from "../common/checkbox";

const ExportPertemuanModal = ({
    isOpen,
    onClose,
    onSubmit,
    tahunAjaran,
    namaKelas = null,
}) => {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);

    const apiUrl = isOpen ? `/api/pertemuan-by-year/${tahunAjaran}` : null;
    const { data: pertemuanData, error, isLoading } = useSWR(apiUrl, fetcher);

    const { lakiLaki, perempuan } = useMemo(() => {
        if (!pertemuanData) {
            return { lakiLaki: [], perempuan: [] };
        }

        const sortedData = [...pertemuanData].sort((a, b) => a.id - b.id);

        const lakiLaki = sortedData.filter((p) => p.gender === "L");
        const perempuan = sortedData.filter((p) => p.gender === "P");

        return { lakiLaki, perempuan };
    }, [pertemuanData]);

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between p-4 border-b">
                            <div className="flex flex-col">
                                <h1 className="text-lg font-medium text-gray-900">
                                    Pilih Pertemuan
                                </h1>
                                <h3 className="text-sm font-medium text-gray-700">
                                    {namaKelas && <span>{namaKelas} </span>}
                                    T.A {tahunAjaran}
                                </h3>
                            </div>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
                            {pertemuanData && !isLoading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <div className="pl-4 border-l">
                                                    {lakiLaki.map(
                                                        (pertemuan) => (
                                                            <CheckboxItem
                                                                key={
                                                                    pertemuan.id
                                                                }
                                                                id={`p-${pertemuan.id}`}
                                                                label={
                                                                    pertemuan.title
                                                                }
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
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <div className="pl-4 border-l">
                                                    {perempuan.map(
                                                        (pertemuan) => (
                                                            <CheckboxItem
                                                                key={
                                                                    pertemuan.id
                                                                }
                                                                id={`p-${pertemuan.id}`}
                                                                label={
                                                                    pertemuan.title
                                                                }
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

                        <div className="flex items-center justify-end p-6 space-x-2 border-t rounded-b">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
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
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExportPertemuanModal;

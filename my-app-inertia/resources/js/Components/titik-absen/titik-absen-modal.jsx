import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import Button from "@/Components/ui/button";
import InputField from "../common/input-field";

const TitikAbsenModal = ({ isOpen, onClose, onSave, isSubmitting }) => {
    const [namaTitik, setNamaTitik] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setNamaTitik("");
            setErrors({});
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

    const handleChange = (e) => {
        setNamaTitik(e.target.value);
        if (errors.nama_titik) {
            setErrors((prev) => ({ ...prev, nama_titik: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!namaTitik.trim()) {
            setErrors({ nama_titik: ["Nama titik tidak boleh kosong."] });
            return;
        }

        try {
            await onSave({ nama_titik: namaTitik });
            onClose();
        } catch (err) {
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors) {
                setErrors(serverErrors);
            } else {
                setErrors({
                    general: ["Terjadi kesalahan yang tidak diketahui."],
                });
            }
        }
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
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="border-b border-slate-300 px-4 pb-4 md:p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-700">
                                        Buat Titik Absen Baru
                                    </h3>
                                    <div
                                        onClick={onClose}
                                        className="group cursor-pointer rounded-full p-2 hover:bg-slate-50"
                                    >
                                        <X className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:rotate-120 group-hover:text-gray-800" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col p-4 md:p-6">
                                <InputField
                                    id="nama_titik"
                                    name="nama_titik"
                                    label="Nama Titik"
                                    value={namaTitik}
                                    onChange={handleChange}
                                    error={errors?.nama_titik?.[0]}
                                    disabled={isSubmitting}
                                    required
                                    placeholder="cth: Pintu A - Laki Laki"
                                />
                                <p className="mt-2 text-xs text-gray-500 px-1">
                                    Identifier & API Key akan dibuat secara
                                    otomatis.
                                </p>
                                {errors.general && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.general[0]}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 p-4 md:p-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    iconLeft={<X className="h-4 w-4" />}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    iconLeft={
                                        isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )
                                    }
                                >
                                    {isSubmitting
                                        ? "Membuat..."
                                        : "Buat Titik Absen"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TitikAbsenModal;

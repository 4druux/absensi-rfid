import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import Button from "@/Components/ui/button";
import InputField from "../common/input-field";

const PertemuanModal = ({
    isOpen,
    onClose,
    onSave,
    selectedPertemuan,
    tahun_ajaran,
    gender,
    kelas_id,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        tanggal_pertemuan: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const isEditing = !!selectedPertemuan;

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFormData({
                    title: selectedPertemuan.title || "",
                    tanggal_pertemuan:
                        selectedPertemuan.tanggal_pertemuan || "",
                });
            } else {
                setFormData({ title: "", tanggal_pertemuan: "" });
            }
            setErrors({});
        }
    }, [selectedPertemuan, isOpen]);

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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e, scope = "this_class") => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        let validationErrors = {};
        if (!formData.title.trim()) {
            validationErrors.title = ["Judul pertemuan tidak boleh kosong."];
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        let dataToSave;
        if (isEditing) {
            dataToSave = {
                title: formData.title,
                tanggal_pertemuan: formData.tanggal_pertemuan,
            };
        } else {
            dataToSave = {
                title: formData.title,
                tahun_ajaran: tahun_ajaran,
                gender: gender,
                tanggal_pertemuan: formData.tanggal_pertemuan,
                kelas_id: kelas_id,
                scope: scope,
            };
        }

        try {
            await onSave(dataToSave, selectedPertemuan?.id, scope);
        } catch (err) {
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors) {
                setErrors(serverErrors);
            }
        } finally {
            setIsSubmitting(false);
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
                                        {isEditing
                                            ? "Edit Pertemuan"
                                            : "Tambah Pertemuan"}
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
                                <div className="mb-4 md:mb-6">
                                    <InputField
                                        id="title"
                                        name="title"
                                        label="Judul Pertemuan"
                                        value={formData.title}
                                        onChange={handleChange}
                                        error={errors?.title?.[0]}
                                        disabled={isSubmitting}
                                        required
                                    />
                                </div>

                                <InputField
                                    id="tanggal_pertemuan"
                                    name="tanggal_pertemuan"
                                    label="Tanggal Pertemuan"
                                    type="date"
                                    value={formData.tanggal_pertemuan}
                                    onChange={handleChange}
                                    error={errors?.tanggal_pertemuan?.[0]}
                                    disabled={isSubmitting}
                                />
                                <p className="mt-2 text-xs text-gray-500 px-1">
                                    Jika dikosongkan, tanggal hari ini akan
                                    digunakan.
                                </p>

                                <div className="flex justify-end gap-2 pt-4">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={onClose}
                                                disabled={isSubmitting}
                                                iconLeft={
                                                    <X className="h-4 w-4" />
                                                }
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
                                                    ? "Menyimpan..."
                                                    : "Simpan Perubahan"}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                type="submit"
                                                variant="outline"
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
                                                    ? "Menyimpan..."
                                                    : "Simpan"}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={(e) =>
                                                    handleSubmit(
                                                        e,
                                                        "all_classes"
                                                    )
                                                }
                                                disabled={isSubmitting}
                                                iconLeft={
                                                    <Save className="h-4 w-4" />
                                                }
                                            >
                                                {isSubmitting
                                                    ? "Menyimpan..."
                                                    : "Simpan Semua"}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PertemuanModal;

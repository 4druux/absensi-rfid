import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import Select from "@/Components/common/select";
import Button from "@/Components/ui/button";

const KenaikanKelasModal = ({
    isOpen,
    onClose,
    isPromoting,
    promoteForm,
    promoteErrors,
    handlePromoteFormChange,
    handlePromote,
    classOptions,
    academicYearOptions,
    jurusan,
    handleCreateKelas,
    handleCreateAcademicYear,
}) => {
    const handlePromoteSubmit = async (e) => {
        e.preventDefault();
        await handlePromote();
    };

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

    const jurusanName = jurusan?.nama_jurusan || "Jurusan";
    const kelasTitle = `Kelas untuk ${jurusanName}`;
    const kelasDescription = `Berikut daftar kelas yang tersedia untuk jurusan ${jurusanName}.`;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
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
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl w-full max-h-[85dvh] overflow-y-auto md:max-w-2xl md:static md:rounded-2xl md:max-h-[100%]"
                    >
                        <div className="md:hidden py-4 flex justify-center sticky top-0 bg-white z-10">
                            <div className="w-16 h-1 bg-gray-300 rounded-full" />
                        </div>

                        <form onSubmit={handlePromoteSubmit}>
                            <div className="px-4 border-b border-slate-300 pb-4 md:p-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-700">
                                        Naik Kelas
                                    </h3>

                                    <div
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-50 rounded-full group cursor-pointer"
                                    >
                                        <X className="w-5 h-5 text-gray-500 group-hover:text-gray-800 group-hover:rotate-120 transition-all duration-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 md:p-6 flex flex-col space-y-4 md:space-y-6">
                                <Select
                                    label="Kelas Baru"
                                    title={kelasTitle}
                                    description={kelasDescription}
                                    options={classOptions}
                                    value={promoteForm.new_kelas_id}
                                    onChange={(value) =>
                                        handlePromoteFormChange(
                                            "new_kelas_id",
                                            value
                                        )
                                    }
                                    placeholder="-- Pilih Kelas Baru --"
                                    error={promoteErrors.new_kelas_id?.[0]}
                                    allowAdd
                                    onAdd={handleCreateKelas}
                                    isProcessing={isPromoting}
                                />

                                <Select
                                    label="Tahun Ajaran Baru"
                                    options={academicYearOptions}
                                    value={promoteForm.new_tahun_ajaran}
                                    onChange={(value) =>
                                        handlePromoteFormChange(
                                            "new_tahun_ajaran",
                                            value
                                        )
                                    }
                                    placeholder="-- Pilih Tahun Ajaran Baru --"
                                    error={promoteErrors.new_tahun_ajaran?.[0]}
                                    allowAdd
                                    onAdd={handleCreateAcademicYear}
                                    isProcessing={isPromoting}
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isPromoting}
                                        iconLeft={<X className="w-4 h-4" />}
                                    >
                                        Batal
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isPromoting}
                                        iconLeft={
                                            isPromoting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )
                                        }
                                    >
                                        Simpan
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default KenaikanKelasModal;

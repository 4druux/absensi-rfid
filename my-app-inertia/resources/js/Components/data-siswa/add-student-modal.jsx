import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import Button from "@/Components/ui/button";
import InputField from "@/Components/common/input-field";

const AddStudentModal = ({
    isOpen,
    onClose,
    isAdding,
    addForm,
    addErrors,
    onFormChange,
    onSave,
}) => {
    const handleAddStudentSubmit = (e) => {
        e.preventDefault();
        onSave();
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
                        <form onSubmit={handleAddStudentSubmit} noValidate>
                            <div className="border-b border-slate-300 px-4 pb-4 md:p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-700">
                                        Tambah Siswa
                                    </h3>
                                    <div
                                        onClick={onClose}
                                        className="group cursor-pointer rounded-full p-2 hover:bg-slate-50"
                                    >
                                        <X className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:rotate-120 group-hover:text-gray-800" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4 p-4 md:space-y-6 md:p-6">
                                <InputField
                                    id="nama"
                                    name="nama"
                                    label="Nama Lengkap"
                                    type="text"
                                    value={addForm.nama}
                                    onChange={onFormChange}
                                    disabled={isAdding}
                                    error={
                                        addErrors?.nama
                                            ? addErrors.nama[0]
                                            : undefined
                                    }
                                    required
                                />
                                <InputField
                                    id="rfid"
                                    name="rfid"
                                    label="RFID"
                                    type="text"
                                    value={addForm.rfid}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) {
                                            onFormChange(e);
                                        }
                                    }}
                                    disabled={isAdding}
                                    error={
                                        addErrors?.rfid
                                            ? addErrors.rfid[0]
                                            : undefined
                                    }
                                    required
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-600">
                                        Jenis Kelamin{" "}
                                        <span className="text-red-600">*</span>
                                    </span>
                                    <div className="mt-2 flex items-center space-x-6">
                                        <label className="flex cursor-pointer items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="jenis_kelamin"
                                                value="L"
                                                checked={
                                                    addForm.jenis_kelamin ===
                                                    "L"
                                                }
                                                onChange={onFormChange}
                                                disabled={isAdding}
                                                className="form-radio h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span>Laki-laki</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="jenis_kelamin"
                                                value="P"
                                                checked={
                                                    addForm.jenis_kelamin ===
                                                    "P"
                                                }
                                                onChange={onFormChange}
                                                disabled={isAdding}
                                                className="form-radio h-4 w-4 border-slate-300 text-pink-600 focus:ring-pink-500"
                                            />
                                            <span>Perempuan</span>
                                        </label>
                                    </div>
                                    {addErrors?.jenis_kelamin && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {addErrors.jenis_kelamin[0]}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isAdding}
                                        iconLeft={<X className="w-4 h-4" />}
                                    >
                                        Batal
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isAdding}
                                        iconLeft={
                                            isAdding ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )
                                        }
                                    >
                                        {isAdding ? "Menyimpan..." : "Simpan"}
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

export default AddStudentModal;

import { dropdownAnimation } from "@/Hooks/use-dropdown";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegFilePdf } from "react-icons/fa6";
import { RiFileExcel2Line } from "react-icons/ri";

const DropdownCardExport = ({
    isOpen,
    dropdownRef,
    onExportPdf,
    onExportExcel,
    isDownloadingPdf,
    isDownloadingExcel,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    className="absolute top-7 right-3 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-40"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownAnimation.variants}
                    transition={dropdownAnimation.transition}
                >
                    <button
                        onClick={onExportPdf}
                        disabled={isDownloadingPdf}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FaRegFilePdf className="h-4 w-4" />
                        {isDownloadingPdf ? "Mengunduh..." : "Export PDF"}
                    </button>
                    <button
                        onClick={onExportExcel}
                        disabled={isDownloadingExcel}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <RiFileExcel2Line className="h-4 w-4" />
                        {isDownloadingExcel ? "Mengunduh..." : "Export Excel"}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DropdownCardExport;

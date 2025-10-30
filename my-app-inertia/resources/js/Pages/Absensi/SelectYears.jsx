import CardContent from "@/Components/ui/card-content";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import DropdownCardExport from "@/Components/ui/dropdown-card-export";
import ExportPertemuanModal from "@/Components/ui/export-pertemuan-modal";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import useAcademicYears from "@/Hooks/use-academic-years";
import { useExport } from "@/Hooks/use-export";
import { LucideGraduationCap, CalendarDays, Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SelectYears = () => {
    const { academicYears, isLoading, error } = useAcademicYears();
    const { handleExport, downloadingStatus } = useExport();
    const [openDropdownYear, setOpenDropdownYear] = useState(null);
    const [modalState, setModalState] = useState({
        isOpen: false,
        tahunAjaran: null,
        exportType: null,
    });

    const dropdownRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openDropdownYear &&
                dropdownRefs.current[openDropdownYear] &&
                !dropdownRefs.current[openDropdownYear].contains(event.target)
            ) {
                setOpenDropdownYear(null);
            }
        };

        if (openDropdownYear) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdownYear]);

    const handleOpenModal = (type, tahunAjaran) => {
        setModalState({
            isOpen: true,
            tahunAjaran: tahunAjaran,
            exportType: type,
        });
        setOpenDropdownYear(null);
    };

    const handleModalSubmit = (pertemuanIds) => {
        const { tahunAjaran, exportType } = modalState;

        if (!tahunAjaran || !exportType || !pertemuanIds) return;

        const params = {
            tahun_ajaran: tahunAjaran,
            pertemuan_ids: pertemuanIds,
        };

        let downloadId = "";
        let routeName = "";

        switch (exportType) {
            case "pdf-all":
                downloadId = `pdf-all-${tahunAjaran}`;
                routeName = "attendance.export.year.pdf";
                break;
            case "excel-all":
                downloadId = `excel-all-${tahunAjaran}`;
                routeName = "attendance.export.year.excel";
                break;
            case "pdf-absent":
                downloadId = `pdf-absent-${tahunAjaran}`;
                routeName = "attendance.export.year.absent.pdf";
                break;
            case "excel-absent":
                downloadId = `excel-absent-${tahunAjaran}`;
                routeName = "attendance.export.year.absent.excel";
                break;
            default:
                return;
        }

        handleExport(downloadId, routeName, params);
    };

    const breadcrumbItems = [
        { label: "Absensi Siswa", href: route("absensi-siswa.years") },
        { label: "Pilih Tahun Ajaran", href: null },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen font-medium text-red-600">
                Gagal memuat data tahun ajaran. Silakan coba lagi nanti.
            </div>
        );
    }

    return (
        <PageContent
            pageTitle="Absensi Siswa"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                <HeaderContent
                    Icon={LucideGraduationCap}
                    title="Pilih Tahun Ajaran"
                    description="Pilih tahun ajaran untuk melanjutkan ke absensi kelas."
                />
            </div>

            {academicYears && academicYears.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {academicYears.map((year) => {
                        const yearKey = year.year;

                        const isPdfAllDownloading =
                            downloadingStatus[`pdf-all-${yearKey}`];
                        const isExcelAllDownloading =
                            downloadingStatus[`excel-all-${yearKey}`];
                        const isPdfAbsentDownloading =
                            downloadingStatus[`pdf-absent-${yearKey}`];
                        const isExcelAbsentDownloading =
                            downloadingStatus[`excel-absent-${yearKey}`];

                        return (
                            <div key={yearKey} className="relative">
                                <CardContent
                                    href={route("absensi-siswa.class", {
                                        tahun_ajaran: yearKey,
                                    })}
                                    icon={
                                        <CalendarDays className="h-12 w-12" />
                                    }
                                    title={`Tahun Ajaran ${yearKey}`}
                                    subtitle="Lihat daftar kelas"
                                    moreActionsButton={
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setOpenDropdownYear(
                                                    openDropdownYear === yearKey
                                                        ? null
                                                        : yearKey
                                                );
                                            }}
                                            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                            aria-label="Opsi ekspor"
                                        >
                                            <Ellipsis className="w-5 h-5 text-gray-600" />
                                        </button>
                                    }
                                />
                                <DropdownCardExport
                                    isOpen={openDropdownYear === yearKey}
                                    dropdownRef={(el) =>
                                        (dropdownRefs.current[yearKey] = el)
                                    }
                                    onExportPdf={() =>
                                        handleOpenModal("pdf-all", yearKey)
                                    }
                                    isDownloadingPdf={isPdfAllDownloading}
                                    onExportExcel={() =>
                                        handleOpenModal("excel-all", yearKey)
                                    }
                                    isDownloadingExcel={isExcelAllDownloading}
                                    onExportPdfAbsent={() =>
                                        handleOpenModal("pdf-absent", yearKey)
                                    }
                                    isDownloadingPdfAbsent={
                                        isPdfAbsentDownloading
                                    }
                                    onExportExcelAbsent={() =>
                                        handleOpenModal("excel-absent", yearKey)
                                    }
                                    isDownloadingExcelAbsent={
                                        isExcelAbsentDownloading
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <DataNotFound
                    title="Data Tahun Ajaran Kosong"
                    message="Belum ada data tahun ajaran yang memiliki siswa."
                />
            )}

            <ExportPertemuanModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                onSubmit={handleModalSubmit}
                tahunAjaran={modalState.tahunAjaran}
            />
        </PageContent>
    );
};

export default SelectYears;

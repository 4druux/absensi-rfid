import CardContent from "@/Components/ui/card-content";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import DropdownCardExport from "@/Components/ui/dropdown-card-export";
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
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
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
                        const handleExportPdfForYear = () => {
                            const params = { tahun_ajaran: year.year };
                            handleExport(
                                `pdf-${year.year}`,
                                "attendance.export.year.pdf",
                                params
                            );
                            setOpenDropdownYear(null);
                        };

                        const handleExportExcelForYear = () => {
                            const params = { tahun_ajaran: year.year };
                            handleExport(
                                `excel-${year.year}`,
                                "attendance.export.year.excel",
                                params
                            );
                            setOpenDropdownYear(null);
                        };

                        const isCurrentPdfDownloading =
                            downloadingStatus[`pdf-${year.year}`];
                        const isCurrentExcelDownloading =
                            downloadingStatus[`excel-${year.year}`];

                        return (
                            <div key={year.year} className="relative">
                                <CardContent
                                    href={route("absensi-siswa.class", {
                                        tahun_ajaran: year.year,
                                    })}
                                    icon={
                                        <CalendarDays className="h-12 w-12" />
                                    }
                                    title={`Tahun Ajaran ${year.year}`}
                                    subtitle="Lihat daftar kelas"
                                    moreActionsButton={
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setOpenDropdownYear(
                                                    openDropdownYear ===
                                                        year.year
                                                        ? null
                                                        : year.year
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
                                    isOpen={openDropdownYear === year.year}
                                    dropdownRef={dropdownRef}
                                    onExportPdf={handleExportPdfForYear}
                                    onExportExcel={handleExportExcelForYear}
                                    isDownloadingPdf={isCurrentPdfDownloading}
                                    isDownloadingExcel={
                                        isCurrentExcelDownloading
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
        </PageContent>
    );
};

export default SelectYears;

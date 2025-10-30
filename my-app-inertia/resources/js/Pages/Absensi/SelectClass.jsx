import { useEffect, useRef, useState } from "react";
import Button from "@/Components/ui/button";
import CardContent from "@/Components/ui/card-content";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import useAllClass from "@/Hooks/use-all-class";
import { useExport } from "@/Hooks/use-export";
import { ArrowLeft, LucideGraduationCap, Ellipsis, School } from "lucide-react";
import DropdownCardExport from "@/Components/ui/dropdown-card-export";
import ExportPertemuanModal from "@/Components/ui/export-pertemuan-modal";

const SelectClass = ({ tahun_ajaran }) => {
    const { allKelas, isLoading, error, handleDelete } = useAllClass();
    const { handleExport, downloadingStatus } = useExport();
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRefs = useRef({});

    const [modalState, setModalState] = useState({
        isOpen: false,
        tahunAjaran: null,
        kelasInfo: null,
        exportType: null,
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openDropdownId &&
                dropdownRefs.current[openDropdownId] &&
                !dropdownRefs.current[openDropdownId].contains(event.target)
            ) {
                setOpenDropdownId(null);
            }
        };

        if (openDropdownId) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdownId]);

    const handleModalSubmit = (pertemuanIds) => {
        const { kelasInfo, exportType, tahunAjaran } = modalState;

        if (!kelasInfo || !exportType || !pertemuanIds) return;

        const params = {
            kelas: kelasInfo.id,
            tahun_ajaran: tahunAjaran,
            nama_kelas_lengkap: kelasInfo.nama_kelas_lengkap,
            nama_jurusan: kelasInfo.nama_jurusan,
            pertemuan_ids: pertemuanIds,
        };

        let downloadId = "";
        let routeName = "";

        if (exportType === "pdf-all") {
            downloadId = `pdf-${kelasInfo.id}`;
            routeName = "attendance.class.export.pdf";
        } else if (exportType === "excel-all") {
            downloadId = `excel-${kelasInfo.id}`;
            routeName = "attendance.class.export.excel";
        } else {
            return;
        }

        handleExport(downloadId, routeName, params);

        setModalState({
            isOpen: false,
            tahunAjaran: null,
            kelasInfo: null,
            exportType: null,
        });
    };

    const breadcrumbItems = [
        { label: "Absensi Siswa", href: route("absensi-siswa.years") },
        {
            label: `T.A ${tahun_ajaran}`,
            href: route("absensi-siswa.years"),
        },
        {
            label: `Pilih Kelas`,
            href: null,
        },
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
                Gagal memuat data kelas. Silakan coba lagi nanti.
            </div>
        );
    }

    const filteredKelas = allKelas?.filter(
        (k) => k.tahun_ajaran === tahun_ajaran
    );

    const groupedByYearAndLevel = filteredKelas?.reduce((acc, kelas) => {
        const year = kelas.tahun_ajaran;
        const level = kelas.nama_kelas;

        if (!acc[year]) {
            acc[year] = {};
        }

        if (!acc[year][level]) {
            acc[year][level] = [];
        }

        acc[year][level].push(kelas);
        return acc;
    }, {});

    const classLevelOrder = ["X", "XI", "XII"];

    const yearGroups =
        groupedByYearAndLevel && groupedByYearAndLevel[tahun_ajaran]
            ? groupedByYearAndLevel[tahun_ajaran]
            : {};

    return (
        <PageContent
            pageTitle="Absensi Siswa"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={LucideGraduationCap}
                title={`Daftar Kelas T.A ${tahun_ajaran}`}
                description="Pilih kelas untuk melanjutkan."
            />

            {Object.keys(yearGroups).length > 0 ? (
                <div className="space-y-6">
                    {classLevelOrder.map((level) =>
                        yearGroups[level] ? (
                            <div key={`${tahun_ajaran}-${level}`}>
                                <h5 className="text-sm font-medium text-gray-600 mb-4">{`Kelas ${level}`}</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {yearGroups[level].map((kelas) => {
                                        const namaKelasLengkap = `${kelas.nama_kelas} ${kelas.kelompok}`;

                                        const handleOpenModal = (type) => {
                                            setModalState({
                                                isOpen: true,
                                                tahunAjaran: tahun_ajaran,
                                                kelasInfo: {
                                                    id: kelas.kelas_id,
                                                    nama_kelas_lengkap:
                                                        namaKelasLengkap,
                                                    nama_jurusan:
                                                        kelas.nama_jurusan,
                                                },
                                                exportType: type,
                                            });
                                            setOpenDropdownId(null);
                                        };

                                        const handleExportPdfForClass = () => {
                                            handleOpenModal("pdf-all");
                                        };

                                        const handleExportExcelForClass =
                                            () => {
                                                handleOpenModal("excel-all");
                                            };

                                        const isCurrentPdfDownloading =
                                            downloadingStatus[
                                                `pdf-${kelas.kelas_id}`
                                            ];
                                        const isCurrentExcelDownloading =
                                            downloadingStatus[
                                                `excel-${kelas.kelas_id}`
                                            ];

                                        return (
                                            <div
                                                key={kelas.kelas_id}
                                                className="relative"
                                            >
                                                <CardContent
                                                    href={route(
                                                        "absensi-siswa.gender",
                                                        {
                                                            kelas_id:
                                                                kelas.kelas_id,
                                                            tahun_ajaran:
                                                                tahun_ajaran,
                                                            nama_kelas:
                                                                namaKelasLengkap,
                                                            nama_jurusan:
                                                                kelas.nama_jurusan,
                                                        }
                                                    )}
                                                    icon={
                                                        <School className="h-12 w-12" />
                                                    }
                                                    title={namaKelasLengkap}
                                                    subtitle={
                                                        kelas.nama_jurusan
                                                    }
                                                    onDelete={() =>
                                                        handleDelete(
                                                            kelas.kelas_id,
                                                            namaKelasLengkap
                                                        )
                                                    }
                                                    moreActionsButton={
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setOpenDropdownId(
                                                                    openDropdownId ===
                                                                        kelas.kelas_id
                                                                        ? null
                                                                        : kelas.kelas_id
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
                                                    isOpen={
                                                        openDropdownId ===
                                                        kelas.kelas_id
                                                    }
                                                    dropdownRef={(el) =>
                                                        (dropdownRefs.current[
                                                            kelas.kelas_id
                                                        ] = el)
                                                    }
                                                    onExportPdf={
                                                        handleExportPdfForClass
                                                    }
                                                    onExportExcel={
                                                        handleExportExcelForClass
                                                    }
                                                    isDownloadingPdf={
                                                        isCurrentPdfDownloading
                                                    }
                                                    isDownloadingExcel={
                                                        isCurrentExcelDownloading
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            ) : (
                <DataNotFound
                    title="Data Kelas Kosong"
                    message={`Belum ada data kelas untuk tahun ajaran ${tahun_ajaran}.`}
                />
            )}

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("absensi-siswa.years")}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>

            <ExportPertemuanModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                onSubmit={handleModalSubmit}
                tahunAjaran={modalState.tahunAjaran}
                namaKelas={modalState.kelasInfo?.nama_kelas_lengkap}
            />
        </PageContent>
    );
};

export default SelectClass;

import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import Button from "@/Components/ui/button";
import {
    LucideGraduationCap,
    ArrowLeft,
    List,
    XCircle,
    CheckCircle2,
} from "lucide-react";
import useShowAttendance from "@/Hooks/use-show-attendance";
import AttendanceTable from "@/Components/absensi/attendance-table";
import useSWR from "swr";
import { fetcher } from "@/Utils/api";
import AttendanceCard from "@/Components/absensi/attendance-card";
import { FaRegFilePdf } from "react-icons/fa6";
import { RiFileExcel2Line } from "react-icons/ri";
import { useExport } from "@/Hooks/use-export";

const ShowAttendance = ({
    pertemuan_id,
    kelas_id,
    gender,
    tahun_ajaran,
    nama_kelas,
    nama_jurusan,
}) => {
    const { attendanceData, isLoading, error } = useShowAttendance(
        pertemuan_id,
        kelas_id
    );

    const { data: pertemuanDetail, isLoading: isLoadingPertemuan } = useSWR(
        pertemuan_id ? `/api/pertemuan/${pertemuan_id}` : null,
        fetcher
    );

    const { handleExport, downloadingStatus } = useExport();

    const currentLoading = isLoading || isLoadingPertemuan;
    const pertemuanTitle = pertemuanDetail?.title || "Memuat Judul...";
    const genderLabel = gender === "L" ? "Laki-laki " : "Perempuan";

    const breadcrumbItems = [
        { label: "Absensi Siswa", href: route("absensi-siswa.years") },
        {
            label: `T.A ${tahun_ajaran}`,
            href: route("absensi-siswa.years"),
        },
        {
            label: `${nama_kelas} - ${nama_jurusan}`,
            href: route("absensi-siswa.class", { tahun_ajaran }),
        },
        {
            label: genderLabel,
            href: route("absensi-siswa.gender", {
                kelas_id,
                tahun_ajaran,
                nama_kelas,
                nama_jurusan,
            }),
        },
        {
            label: pertemuanTitle,
            href: route("absensi-siswa.pertemuan", {
                gender,
                kelas_id,
                tahun_ajaran,
                nama_kelas,
                nama_jurusan,
            }),
        },
        {
            label: "Laporan Absensi",
            href: null,
        },
    ];

    const hadirCount = attendanceData.filter(
        (s) => s.status === "Hadir"
    ).length;
    const alfaCount = attendanceData.length - hadirCount;

    const studentDetails = [
        { icon: LucideGraduationCap, label: nama_kelas },
        { icon: LucideGraduationCap, label: nama_jurusan },
        {
            icon: CheckCircle2,
            label: `${hadirCount} Hadir`,
            className: "text-emerald-600",
        },
        {
            icon: XCircle,
            label: `${alfaCount} Alfa`,
            className: "text-red-600",
        },
    ];

    const handleExportPdf = () => {
        const params = {
            pertemuan: pertemuan_id, 
            kelas_id: kelas_id,
            nama_kelas: nama_kelas,
            nama_jurusan: nama_jurusan,
            pertemuan_title: pertemuanTitle,
        };
        handleExport("pdf", "attendance.meet.export.pdf", params);
    };

    const handleExportExcel = () => {
        const params = {
            pertemuan: pertemuan_id, 
            kelas_id: kelas_id,
            nama_kelas: nama_kelas,
            nama_jurusan: nama_jurusan,
            pertemuan_title: pertemuanTitle,
        };
        handleExport("excel", "attendance.meet.export.excel", params);
    };

    if (currentLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen font-medium text-red-600">
                Gagal memuat data Absensi. Silakan coba lagi nanti.
            </div>
        );
    }

    return (
        <PageContent
            pageTitle={`Laporan Absensi - ${nama_kelas}`}
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                <HeaderContent
                    Icon={List}
                    title={`Absensi ${pertemuanTitle}`}
                    details={studentDetails}
                />
                <div className="flex justify-end gap-2 flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleExportPdf}
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<FaRegFilePdf className="h-5 w-5" />}
                        disabled={downloadingStatus.pdf}
                    >
                        {downloadingStatus.pdf ? "Mengunduh..." : "Export Pdf"}
                    </Button>

                    <Button
                        onClick={handleExportExcel}
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<RiFileExcel2Line className="h-5 w-5" />}
                        disabled={downloadingStatus.excel}
                    >
                        {downloadingStatus.excel
                            ? "Mengunduh..."
                            : "Export Excel"}
                    </Button>
                </div>
            </div>

            {attendanceData.length > 0 ? (
                <>
                    <div className="hidden xl:block">
                        <AttendanceTable records={attendanceData} />
                    </div>

                    <div className="xl:hidden">
                        <AttendanceCard records={attendanceData} />
                    </div>
                </>
            ) : (
                <DataNotFound
                    title="Belum Ada Absensi"
                    message="Belum ada absensi pada pertemuan ini."
                />
            )}

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("absensi-siswa.pertemuan", {
                        gender,
                        kelas_id,
                        tahun_ajaran,
                        nama_kelas,
                        nama_jurusan,
                    })}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
        </PageContent>
    );
};

export default ShowAttendance;

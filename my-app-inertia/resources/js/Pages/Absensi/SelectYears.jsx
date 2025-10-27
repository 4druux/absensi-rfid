import CardContent from "@/Components/ui/card-content";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import useAcademicYears from "@/Hooks/use-academic-years";
import { LucideGraduationCap, CalendarDays } from "lucide-react";

const SelectYears = () => {
    const { academicYears, isLoading, error } = useAcademicYears();

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
                    {academicYears.map((year) => (
                        <CardContent
                            key={year.year}
                            href={route("absensi-siswa.class", {
                                tahun_ajaran: year.year,
                            })}
                            icon={<CalendarDays className="h-12 w-12" />}
                            title={`Tahun Ajaran ${year.year}`}
                            subtitle="Lihat daftar kelas"
                        />
                    ))}
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

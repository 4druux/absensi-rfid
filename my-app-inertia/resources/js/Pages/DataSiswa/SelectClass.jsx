import Button from "@/Components/ui/button";
import CardContent from "@/Components/ui/card-content";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import useAllClass from "@/Hooks/data-siswa/use-all-class";
import { LucideGraduationCap, PlusCircle, School } from "lucide-react";

const SelectClass = () => {
    const { allKelas, isLoading, error, handleDelete } = useAllClass();

    const breadcrumbItems = [
        { label: "Data Siswa", href: route("data-siswa.index") },
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

    const groupedByYearAndLevel = allKelas?.reduce((acc, kelas) => {
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

    const sortedYears = Object.keys(groupedByYearAndLevel || {})
        .sort()
        .reverse();

    const classLevelOrder = ["X", "XI", "XII"];

    return (
        <PageContent
            pageTitle="Kelola Data Kelas dan Siswa"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                <HeaderContent
                    Icon={LucideGraduationCap}
                    title="Daftar Kelas per Tahun Ajaran"
                    description="Pilih kelas untuk melihat detail atau kelola data siswa."
                />
                <div className="flex justify-end flex-shrink-0">
                    <Button
                        as="link"
                        href={route("data-siswa.input")}
                        variant="outline"
                        size={{ base: "md", md: "lg" }}
                        iconLeft={<PlusCircle className="h-5 w-5" />}
                    >
                        Input Data Baru
                    </Button>
                </div>
            </div>

            {sortedYears.length > 0 ? (
                <div className="space-y-8">
                    {sortedYears.map((year) => (
                        <section key={year}>
                            <h4 className="text-md font-medium text-gray-600 mb-2">{`Tahun Ajaran ${year}`}</h4>
                            <div className="space-y-6">
                                {classLevelOrder.map((level) =>
                                    groupedByYearAndLevel[year][level] ? (
                                        <div key={`${year}-${level}`}>
                                            <h5 className="text-sm font-medium text-gray-600 mb-4 md:mb-6">{`Kelas ${level}`}</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {groupedByYearAndLevel[year][
                                                    level
                                                ].map((kelas) => (
                                                    <CardContent
                                                        key={kelas.kelas_id}
                                                        href={route(
                                                            "data-siswa.show",
                                                            {
                                                                kelas_id:
                                                                    kelas.kelas_id,
                                                                tahun_ajaran:
                                                                    kelas.tahun_ajaran,
                                                            }
                                                        )}
                                                        icon={
                                                            <School className="h-12 w-12" />
                                                        }
                                                        title={`${kelas.nama_kelas} ${kelas.kelompok}`}
                                                        subtitle={
                                                            kelas.nama_jurusan
                                                        }
                                                        onDelete={() =>
                                                            handleDelete(
                                                                kelas.kelas_id,
                                                                `${kelas.nama_kelas} ${kelas.kelompok}`
                                                            )
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <DataNotFound
                    title="Data Kelas Kosong"
                    message="Belum ada data kelas. Silakan tambahkan data siswa terlebih dahulu."
                />
            )}
        </PageContent>
    );
};

export default SelectClass;

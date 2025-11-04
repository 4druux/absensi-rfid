import { useState } from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import CardContent from "@/Components/ui/card-content";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import Button from "@/Components/ui/button";
import useSelectMeet from "@/Hooks/use-select-meet";
import {
    LucideGraduationCap,
    PlusCircle,
    CalendarCheck,
    ArrowLeft,
} from "lucide-react";
import PertemuanModal from "@/Components/absensi/pertemuan-modal";

const SelectMeet = ({
    gender,
    kelas_id,
    tahun_ajaran,
    nama_kelas,
    nama_jurusan,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPertemuan, setSelectedPertemuan] = useState(null);

    const {
        pertemuans,
        isLoading,
        error,
        handleCreate,
        handleBulkCreate,
        handleUpdate,
        handleDelete,
    } = useSelectMeet(tahun_ajaran, gender, kelas_id);

    const genderLabel = gender === "L" ? "Laki-laki " : "Perempuan";
    const pageTitle = `Pilih Pertemuan ${genderLabel}`;

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
            label: "Pilih Pertemuan",
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

    const openCreateModal = () => {
        setSelectedPertemuan(null);
        setIsModalOpen(true);
    };

    const openEditModal = (pertemuan) => {
        setSelectedPertemuan(pertemuan);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPertemuan(null);
    };

    const handleSave = async (data, id, scope) => {
        if (id) {
            await handleUpdate(id, data);
        } else if (scope === "all_classes") {
            await handleBulkCreate(data, closeModal);
        } else {
            await handleCreate(data, closeModal);
        }
        closeModal();
    };
    return (
        <PageContent
            pageTitle="Absensi Siswa"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:gap-4">
                <HeaderContent
                    Icon={LucideGraduationCap}
                    title={pageTitle}
                    description={`Kelola atau pilih pertemuan untuk ${nama_kelas} - ${tahun_ajaran}.`}
                />

                <div className="flex justify-end flex-shrink-0 mb-4">
                    <Button
                        variant="outline"
                        size={{ base: "md", md: "lg" }}
                        onClick={openCreateModal}
                        iconLeft={<PlusCircle className="h-5 w-5" />}
                    >
                        Tambah Pertemuan
                    </Button>
                </div>
            </div>

            {pertemuans?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pertemuans.map((pertemuan) => (
                        <CardContent
                            key={pertemuan.id}
                            href={route("absensi-siswa.show", {
                                pertemuan_id: pertemuan.id,
                                pertemuan_title: pertemuan.title,
                                kelas_id: kelas_id,
                                gender: gender,
                                tahun_ajaran: tahun_ajaran,
                                nama_kelas: nama_kelas,
                                nama_jurusan: nama_jurusan,
                            })}
                            icon={<CalendarCheck className="h-12 w-12" />}
                            title={pertemuan.title}
                            subtitle="Lihat Laporan Absen"
                            isActive={pertemuan.is_active}
                            onEdit={() => openEditModal(pertemuan)}
                            onDelete={() =>
                                handleDelete(pertemuan.id, pertemuan.title)
                            }
                        />
                    ))}
                </div>
            ) : (
                <DataNotFound
                    title="Belum Ada Pertemuan"
                    message="Silakan tambahkan pertemuan baru menggunakan tombol di atas."
                />
            )}

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("absensi-siswa.gender", {
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

            <PertemuanModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                selectedPertemuan={selectedPertemuan}
                tahun_ajaran={tahun_ajaran}
                gender={gender}
                kelas_id={kelas_id}
            />
        </PageContent>
    );
};

export default SelectMeet;

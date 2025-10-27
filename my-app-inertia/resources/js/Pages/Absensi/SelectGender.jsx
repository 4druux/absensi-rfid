import Button from "@/Components/ui/button";
import CardContent from "@/Components/ui/card-content";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import { ArrowLeft, LucideGraduationCap, User, UserRound } from "lucide-react";

const SelectGender = ({ kelas_id, tahun_ajaran, nama_kelas, nama_jurusan }) => {
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
            label: "Pilih Jenis Kelamin",
            href: null,
        },
    ];

    const genderOptions = [
        {
            label: "Laki-laki",
            value: "L",
            icon: <User className="h-12 w-12" />,
            subtitle: "Lihat absensi siswa laki-laki",
        },
        {
            label: "Perempuan",
            value: "P",
            icon: <UserRound className="h-12 w-12" />,
            subtitle: "Lihat absensi siswa perempuan",
        },
    ];

    return (
        <PageContent
            pageTitle="Absensi Siswa"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={LucideGraduationCap}
                title="Pilih Jenis Kelamin"
                description={`Pilih jenis kelamin untuk kelas ${nama_kelas} - ${nama_jurusan}.`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                {genderOptions.map((gender) => (
                    <CardContent
                        key={gender.value}
                        href={route("absensi-siswa.pertemuan", {
                            gender: gender.value,
                            kelas_id: kelas_id,
                            tahun_ajaran: tahun_ajaran,
                            nama_kelas: nama_kelas,
                            nama_jurusan: nama_jurusan,
                        })}
                        icon={gender.icon}
                        title={gender.label}
                        subtitle={gender.subtitle}
                    />
                ))}
            </div>

            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("absensi-siswa.class", { tahun_ajaran })}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
        </PageContent>
    );
};

export default SelectGender;

import {
    ArrowLeft,
    BookOpen,
    School,
    Users,
    ArrowUpCircle,
    UserPlus,
} from "lucide-react";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import PageContent from "@/Components/ui/page-content";
import Button from "@/Components/ui/button";
import ShowSiswaTable from "@/Components/data-siswa/show-siswa-table";
import ShowSiswaCard from "@/Components/data-siswa/show-siswa-card";
import KenaikanKelasModal from "@/Components/data-siswa/kenaikan-kelas-modal";
import AddStudentModal from "@/Components/data-siswa/add-student-modal";
import { useShowSiswa } from "@/Hooks/data-siswa/use-show-siswa";
import { usePage } from "@inertiajs/react";
import HeaderContent from "@/Components/ui/header-content";

const ShowClass = () => {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split("?")[1] || "");
    const classId = queryParams.get("kelas_id");
    const tahunAjaran = queryParams.get("tahun_ajaran");

    const {
        kelasData,
        students,
        isLoading,
        error,
        editingId,
        editData,
        editErrors,
        handleEditClick,
        handleCancelEdit,
        handleInputChange,
        handleUpdate,
        handleDelete,
        isPromoteModalOpen,
        isPromoting,
        promoteForm,
        promoteErrors,
        handlePromoteClick,
        handleClosePromoteModal,
        handlePromoteFormChange,
        handlePromote,
        classOptions,
        academicYearOptions,
        jurusan,
        handleCreateKelas,
        handleCreateAcademicYear,
        isAddStudentModalOpen,
        handleAddStudentClick,
        handleCloseAddStudentModal,
        addStudentForm,
        addStudentErrors,
        handleAddStudentFormChange,
        handleAddStudent,
        isAddingStudent,
    } = useShowSiswa(classId, tahunAjaran);

    const fullClassName = kelasData
        ? `${kelasData.nama_kelas} ${kelasData.kelompok} - ${kelasData.jurusan.nama_jurusan}`
        : "";

    const breadcrumbItems = [
        { label: "Data Siswa", href: route("data-siswa.index") },
        {
            label: fullClassName
                ? `${fullClassName} | ${tahunAjaran}`
                : "Memuat...",
            href: null,
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h3 className="font-medium text-red-600">
                    Gagal memuat data siswa.
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                    Coba periksa koneksi atau hubungi administrator.
                </p>
            </div>
        );
    }

    const tableProps = {
        students,
        editingId,
        editData,
        editErrors,
        handleEditClick,
        handleCancelEdit,
        handleInputChange,
        handleUpdate,
        handleDelete,
    };

    const isKelasXII = kelasData?.nama_kelas === "XII";

    const studentDetails = [
        { icon: Users, label: `${students?.length} Siswa` },
        { icon: School, label: fullClassName },
        { icon: BookOpen, label: tahunAjaran },
    ];

    return (
        <PageContent
            pageTitle="Kelola data kelas dan siswa"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between mb-6 xl:gap-4">
                <HeaderContent
                    Icon={Users}
                    title="Daftar Siswa"
                    details={studentDetails}
                />

                <div className="flex items-center justify-end gap-2">
                    {students && students.length > 0 && !isKelasXII && (
                        <Button
                            variant="outline"
                            size={{ base: "md", md: "lg" }}
                            onClick={handlePromoteClick}
                            iconLeft={<ArrowUpCircle className="h-5 w-5" />}
                        >
                            Naik Kelas
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size={{ base: "md", md: "lg" }}
                        onClick={handleAddStudentClick}
                        iconLeft={<UserPlus className="h-5 w-5" />}
                    >
                        Tambah Siswa
                    </Button>
                </div>
            </div>

            {students && students.length > 0 ? (
                <>
                    <div className="hidden xl:block">
                        <ShowSiswaTable {...tableProps} />
                    </div>
                    <div className="xl:hidden">
                        <ShowSiswaCard {...tableProps} />
                    </div>
                </>
            ) : (
                <DataNotFound
                    title="Belum Ada Siswa"
                    message="Tidak ada data siswa yang ditemukan untuk kelas ini. Anda bisa menambahkannya di halaman ini atau di halaman Input Data."
                />
            )}
            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("data-siswa.index")}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
            <KenaikanKelasModal
                isOpen={isPromoteModalOpen}
                onClose={handleClosePromoteModal}
                isPromoting={isPromoting}
                promoteForm={promoteForm}
                promoteErrors={promoteErrors}
                handlePromoteFormChange={handlePromoteFormChange}
                handlePromote={handlePromote}
                classOptions={classOptions}
                jurusan={jurusan}
                academicYearOptions={academicYearOptions}
                handleCreateKelas={handleCreateKelas}
                handleCreateAcademicYear={handleCreateAcademicYear}
            />
            <AddStudentModal
                isOpen={isAddStudentModalOpen}
                onClose={handleCloseAddStudentModal}
                isAdding={isAddingStudent}
                addForm={addStudentForm}
                addErrors={addStudentErrors}
                onFormChange={handleAddStudentFormChange}
                onSave={handleAddStudent}
            />
        </PageContent>
    );
};

export default ShowClass;

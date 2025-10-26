import Select from "@/Components/common/select";
import InputSiswaCard from "@/Components/data-siswa/input-siswa-card";
import InputSiswaTable from "@/Components/data-siswa/input-siswa-table";
import Button from "@/Components/ui/button";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import useInputSiswaForm from "@/Hooks/data-siswa/use-input-siswa-form";
import { ArrowLeft, Loader2, PlusCircle, Upload, Users } from "lucide-react";

const InputData = () => {
    const {
        data,
        isSubmitting,
        errors,
        formRef,
        fileInputRef,
        importError,
        allJurusans,
        isLoadingJurusans,
        kelasOptions,
        isLoadingKelas,
        academicYearOptions,
        isLoadingAcademicYears,
        handleFormChange,
        handleStudentChange,
        addStudentRow,
        removeStudentRow,
        handleSubmit,
        handleCreateJurusan,
        handleDeleteJurusan,
        handleCreateKelas,
        handleDeleteKelas,
        handleCreateAcademicYear,
        handleDeleteAcademicYear,
        handleImportClick,
        handleFileChange,
    } = useInputSiswaForm();

    const breadcrumbItems = [
        { label: "Data Siswa", href: route("data-siswa.index") },
        {
            label: "Input Data Kelas dan Siswa",
            href: "",
        },
    ];

    const jurusanOptions =
        allJurusans?.map((j) => ({ value: j.id, label: j.nama_jurusan })) || [];

    const kelasSelectOptions =
        kelasOptions?.map((k) => ({
            value: k.id,
            label: `${k.nama_kelas} ${k.kelompok}`,
        })) || [];

    const jurusanSelected =
        allJurusans?.find((j) => j.id === data.jurusan_id)?.nama_jurusan || "";

    return (
        <>
            <PageContent
                pageTitle="Kelola data kelas dan siswa"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Users}
                    title="Input Data Kelas dan Siswa"
                    description="Silahkan input data kelas dan siswa"
                />

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Select
                            label="Pilih Jurusan"
                            title="Manajemen Jurusan"
                            description="Anda dapat mencari, menambah, atau menghapus jurusan."
                            options={jurusanOptions}
                            value={data.jurusan_id}
                            onChange={(value) =>
                                handleFormChange("jurusan_id", value)
                            }
                            isLoading={isLoadingJurusans}
                            placeholder="-- Pilih Jurusan --"
                            error={errors.jurusan_id?.[0]}
                            allowAdd
                            onAdd={handleCreateJurusan}
                            allowDelete
                            onDelete={handleDeleteJurusan}
                            isProcessing={isSubmitting}
                        />

                        <Select
                            label="Pilih Kelas"
                            title={
                                jurusanSelected
                                    ? `Kelas untuk ${jurusanSelected}`
                                    : "Pilih Jurusan Dahulu"
                            }
                            description={
                                jurusanSelected
                                    ? "Daftar kelas yang tersedia untuk jurusan ini."
                                    : "Pilih jurusan di sebelah kiri untuk melihat daftar kelas."
                            }
                            options={kelasSelectOptions}
                            value={data.kelas_id}
                            onChange={(value) =>
                                handleFormChange("kelas_id", value)
                            }
                            isLoading={isLoadingKelas}
                            disabled={!data.jurusan_id}
                            placeholder={
                                !data.jurusan_id
                                    ? "Pilih jurusan terlebih dahulu"
                                    : "-- Pilih Kelas --"
                            }
                            error={errors.kelas_id?.[0]}
                            allowAdd
                            onAdd={handleCreateKelas}
                            allowDelete
                            onDelete={handleDeleteKelas}
                            isProcessing={isSubmitting}
                        />
                        <Select
                            label="Tahun Ajaran"
                            title="Manajemen Tahun Ajaran"
                            description="Anda dapat mencari, menambah, atau menghapus tahun ajaran."
                            options={academicYearOptions}
                            value={data.tahun_ajaran}
                            onChange={(value) =>
                                handleFormChange("tahun_ajaran", value)
                            }
                            isLoading={isLoadingAcademicYears}
                            placeholder="-- Pilih Tahun Ajaran --"
                            error={errors.tahun_ajaran?.[0]}
                            allowAdd
                            onAdd={handleCreateAcademicYear}
                            isProcessing={isSubmitting}
                            allowDelete
                            onDelete={handleDeleteAcademicYear}
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Daftar Siswa{" "}
                                <span className="text-red-600">*</span>
                            </label>
                            <div className="flex items-center justify-end space-x-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                    accept=".csv, .xlsx, .xls"
                                />

                                <Button
                                    onClick={handleImportClick}
                                    size={{ base: "sm" }}
                                    href={route("data-siswa.index")}
                                    variant="blue"
                                    iconLeft={<Upload className="h-4 w-4" />}
                                >
                                    Import Data
                                </Button>

                                <Button
                                    onClick={addStudentRow}
                                    size={{ base: "sm" }}
                                    href={route("data-siswa.index")}
                                    variant="success"
                                    iconLeft={
                                        <PlusCircle className="h-4 w-4" />
                                    }
                                >
                                    Tambah Siswa
                                </Button>
                            </div>
                        </div>
                        {importError && (
                            <div className="text-center bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 w-fit">
                                {importError}
                            </div>
                        )}
                        {errors.students && (
                            <div
                                id="students-list-error"
                                className="text-center bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 w-fit"
                            >
                                {errors.students[0] || errors.students}
                            </div>
                        )}

                        <div className="hidden lg:block">
                            <InputSiswaTable
                                students={data.students}
                                handleStudentChange={handleStudentChange}
                                removeStudentRow={removeStudentRow}
                                displayErrors={errors}
                            />
                        </div>
                        <div className="lg:hidden">
                            <InputSiswaCard
                                students={data.students}
                                handleStudentChange={handleStudentChange}
                                removeStudentRow={removeStudentRow}
                                displayErrors={errors}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end space-x-4">
                        <Button
                            as="link"
                            size="lg"
                            href={route("data-siswa.index")}
                            variant="outline"
                            iconLeft={<ArrowLeft className="h-5 w-5" />}
                        >
                            Kembali
                        </Button>

                        <Button
                            type="submit"
                            size="lg"
                            variant="primary"
                            disabled={isSubmitting}
                            iconLeft={
                                isSubmitting && (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                )
                            }
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                        </Button>
                    </div>
                </form>
            </PageContent>
        </>
    );
};

export default InputData;

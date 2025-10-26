import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

import { router } from "@inertiajs/react";
import {
    createAcademicYear,
    createKelas,
    deleteSiswa,
    fetcher,
    promoteStudents,
    createSingleSiswa,
    updateSiswa,
} from "@/Utils/api/index";

export const useShowSiswa = (classId, tahunAjaran) => {
    const currentKelasSwrKey =
        classId && tahunAjaran
            ? `/api/kelas/${classId}?tahun_ajaran=${tahunAjaran}`
            : null;

    const {
        data: kelasData,
        error,
        isLoading,
        mutate,
    } = useSWR(currentKelasSwrKey, fetcher);

    const newKelasSwrKey = kelasData?.jurusan_id
        ? `/api/jurusan/${kelasData.jurusan_id}/kelas`
        : null;

    const {
        data: allKelas,
        isLoading: isLoadingKelas,
        mutate: mutateKelas,
    } = useSWR(newKelasSwrKey, fetcher);

    const {
        data: academicYears,
        isLoading: isLoadingAcademicYears,
        mutate: mutateAcademicYears,
    } = useSWR("/api/academic-years", fetcher);

    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [isPromoting, setIsPromoting] = useState(false);
    const [promoteForm, setPromoteForm] = useState({
        new_kelas_id: "",
        new_tahun_ajaran: "",
    });
    const [promoteErrors, setPromoteErrors] = useState({});

    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [addStudentForm, setAddStudentForm] = useState({
        nama: "",
        rfid: "",
        jenis_kelamin: "L",
    });
    const [addStudentErrors, setAddStudentErrors] = useState({});

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [editErrors, setEditErrors] = useState({});

    const handleAddStudentClick = () => {
        setIsAddStudentModalOpen(true);
        setAddStudentForm({
            nama: "",
            rfid: "",
            jenis_kelamin: "",
        });
        setAddStudentErrors({});
    };

    const handleCloseAddStudentModal = () => {
        setIsAddStudentModalOpen(false);
    };

    const handleAddStudentFormChange = (e) => {
        const { name, value } = e.target;
        setAddStudentForm((prev) => ({ ...prev, [name]: value }));
        if (addStudentErrors[name]) {
            setAddStudentErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleAddStudent = async () => {
        setIsAddingStudent(true);
        setAddStudentErrors({});
        try {
            const payload = {
                kelas_id: classId,
                tahun_ajaran: tahunAjaran,
                nama: addStudentForm.nama,
                rfid: addStudentForm.rfid,
                jenis_kelamin: addStudentForm.jenis_kelamin,
            };
            const response = await createSingleSiswa(payload);
            toast.success(response.message);
            handleCloseAddStudentModal();
            mutate();
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                setAddStudentErrors(errors);
                const firstErrorMessage =
                    errors?.nama?.[0] ||
                    errors?.rfid?.[0] ||
                    errors?.jenis_kelamin?.[0] ||
                    error.response.data.message ||
                    "Gagal menambahkan siswa. Periksa kembali form.";
                toast.error(firstErrorMessage);
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Terjadi kesalahan pada server."
                );
            }
        } finally {
            setIsAddingStudent(false);
        }
    };

    const handlePromoteClick = () => {
        setIsPromoteModalOpen(true);
        setPromoteForm({
            new_kelas_id: "",
            new_tahun_ajaran: "",
        });
        setPromoteErrors({});
    };

    const handleClosePromoteModal = () => {
        setIsPromoteModalOpen(false);
    };

    const handlePromoteFormChange = (name, value) => {
        setPromoteForm((prev) => ({ ...prev, [name]: value }));
        if (promoteErrors[name]) {
            setPromoteErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handlePromote = async () => {
        setIsPromoting(true);
        setPromoteErrors({});
        try {
            const payload = {
                current_kelas_id: classId,
                current_tahun_ajaran: tahunAjaran,
                new_kelas_id: promoteForm.new_kelas_id,
                new_tahun_ajaran: promoteForm.new_tahun_ajaran,
            };

            const response = await promoteStudents(payload);
            toast.success(response.message);
            handleClosePromoteModal();

            router.visit(
                route("data-siswa.show", {
                    kelas_id: promoteForm.new_kelas_id,
                    tahun_ajaran: promoteForm.new_tahun_ajaran,
                })
            );
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                setPromoteErrors(errors);

                const firstErrorMessage =
                    errors?.[Object.keys(errors)[0]]?.[0] ||
                    error.response.data.message ||
                    "Gagal melakukan kenaikan kelas. Periksa kembali form.";

                toast.error(firstErrorMessage);
            } else {
                toast.error(
                    error.response?.data?.message ||
                        "Terjadi kesalahan pada server."
                );
            }
        } finally {
            setIsPromoting(false);
        }
    };

    const handleEditClick = (student) => {
        setEditingId(student.id);
        setEditData({
            nama: student.nama,
            rfid: student.rfid,
            jenis_kelamin: student.jenis_kelamin,
        });
        setEditErrors({});
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
        setEditErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        setEditErrors({});
        try {
            const result = await updateSiswa(id, editData);
            toast.success(result.message);
            setEditingId(null);
            mutate();
        } catch (error) {
            if (error.response?.status === 422) {
                const firstError = Object.values(
                    error.response.data.errors
                )[0][0];
                toast.error(firstError || "Gagal memperbarui data.");
                setEditErrors(error.response.data.errors);
            } else {
                toast.error(
                    "Gagal memperbarui data. Terjadi kesalahan server."
                );
            }
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
            try {
                const result = await deleteSiswa(id);
                toast.success(result.message);
                mutate();
            } catch (error) {
                toast.error("Gagal menghapus siswa."), error;
            }
        }
    };

    const handleCreateKelas = async (namaLengkapKelas) => {
        const parts = namaLengkapKelas.split(" ");
        const nama_kelas = parts[0];
        const kelompok = parts.slice(1).join(" ");
        const jurusanId = kelasData?.jurusan_id;

        if (!nama_kelas || !kelompok || !jurusanId) {
            toast.error(
                "Jurusan tidak ditemukan atau format kelas tidak valid."
            );
            return;
        }

        setIsPromoting(true);
        try {
            const result = await createKelas({
                nama_kelas,
                kelompok,
                jurusan_id: jurusanId,
            });
            toast.success(result.message);
            const newKelas = result.kelas;
            await mutateKelas();
            handlePromoteFormChange("new_kelas_id", newKelas.id);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menambahkan kelas."
            );
            throw error;
        } finally {
            setIsPromoting(false);
        }
    };

    const handleCreateAcademicYear = async (newYear) => {
        setIsPromoting(true);
        try {
            const result = await createAcademicYear({ year: newYear });
            toast.success(result.message);
            const newAcademicYear = result.academic_year;
            await mutateAcademicYears();
            handlePromoteFormChange("new_tahun_ajaran", newAcademicYear.year);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Gagal menambahkan tahun ajaran."
            );
            throw error;
        } finally {
            setIsPromoting(false);
        }
    };

    const classOptions =
        allKelas?.map((k) => {
            const label = `${k.nama_kelas} ${k.kelompok || ""}`.trim();
            return {
                value: k.id,
                label: label,
            };
        }) || [];

    const academicYearOptions =
        academicYears
            ?.filter((ay) => ay.year > tahunAjaran)
            .map((ay) => ({
                value: ay.year,
                label: ay.year,
            })) || [];

    return {
        kelasData,
        students: kelasData?.siswas,
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
        isLoadingKelas,
        isLoadingAcademicYears,
        jurusan: kelasData?.jurusan,
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
    };
};

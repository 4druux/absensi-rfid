import React, { useState } from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import Button from "@/Components/ui/button";
import DotLoader from "@/Components/ui/dot-loader";
import DataNotFound from "@/Components/ui/data-not-found";
import { PlusCircle, RadioTower } from "lucide-react";
import AssignModal from "../../Components/titik-absen/assign-modal";
import { useTitikAbsen } from "@/Hooks/use-titik-absen";
import TitikAbsenTable from "@/Components/titik-absen/titik-absen-table";
import TitikAbsenCard from "@/Components/titik-absen/titik-absen-card";
import TitikAbsenModal from "@/Components/titik-absen/titik-absen-modal";

const TitikAbsen = () => {
    const {
        titikAbsens,
        error,
        isLoading,
        isSubmitting,
        modalState,
        handleCreate,
        handleDelete,
        handleOpenModal,
        handleCloseModal,
        handleAssign,
        handleUnassign,
    } = useTitikAbsen();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const breadcrumbItems = [{ label: "Manajemen Titik Absen", href: null }];

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <DataNotFound
                title="Gagal Memuat Data"
                message={
                    error.response?.data?.message ||
                    "Terjadi kesalahan saat memuat data titik absen."
                }
            />
        );
    }

    return (
        <>
            <PageContent
                pageTitle="Manajemen Titik Absen"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 md:gap-4">
                    <HeaderContent
                        Icon={RadioTower}
                        title="Manajemen Titik Absen"
                        description="Buat dan kelola titik absen dan hubungkan sesi pertemuan yang aktif ke setiap titik."
                    />

                    <div className="flex justify-end flex-shrink-0 mb-4">
                        <Button
                            variant="outline"
                            size={{ base: "md", md: "lg" }}
                            iconLeft={<PlusCircle className="h-5 w-5" />}
                            disabled={isSubmitting}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Buat Titik Absen
                        </Button>
                    </div>
                </div>

                {titikAbsens.length > 0 ? (
                    <>
                        <div className="hidden xl:block">
                            <TitikAbsenTable
                                records={titikAbsens}
                                isSubmitting={isSubmitting}
                                onDelete={handleDelete}
                                onAssign={handleOpenModal}
                                onUnassign={handleUnassign}
                            />
                        </div>

                        <div className="xl:hidden">
                            <TitikAbsenCard
                                records={titikAbsens}
                                isSubmitting={isSubmitting}
                                onDelete={handleDelete}
                                onAssign={handleOpenModal}
                                onUnassign={handleUnassign}
                            />
                        </div>
                    </>
                ) : (
                    <DataNotFound
                        title="Belum Ada Titik Absen"
                        message="Belum ada titik absen yang dibuat. Klik tombol 'Buat Titik Absen' untuk memulai."
                    />
                )}
            </PageContent>

            <TitikAbsenModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreate}
                isSubmitting={isSubmitting}
            />

            <AssignModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onAssign={handleAssign}
                titikAbsen={modalState.titikAbsen}
            />
        </>
    );
};

export default TitikAbsen;

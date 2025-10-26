import React from "react";
import PageContent from "@/Components/ui/page-content";
import HeaderContent from "@/Components/ui/header-content";
import { UserCog, ArrowLeft } from "lucide-react";
import DataNotFound from "@/Components/ui/data-not-found";
import DotLoader from "@/Components/ui/dot-loader";
import Button from "@/Components/ui/button";
import ShowAkunTable from "@/Components/manajemen-akun/show-akun-table";
import ShowAkunCard from "@/Components/manajemen-akun/show-akun-card";
import { useShowAccount } from "@/Hooks/use-show-account";
import ResetPasswordModal from "@/Components/manajemen-akun/reset-password-modal";
import SearchBar from "@/Components/ui/search-bar";

const accountTypes = {
    admin: { title: "Admin", IconComponent: UserCog },
};

const ShowAccount = () => {
    const role = new URLSearchParams(window.location.search).get("role");

    const {
        isLoading,
        error,
        pendingUsers,
        approvedUsers,
        isProcessing,
        isModalOpen,
        selectedUser,
        searchTerm,
        handleApprove,
        handleReject,
        handleResetPassword,
        handleOpenModal,
        handleCloseModal,
        handleSearchChange,
        handleClearSearch,
    } = useShowAccount(role);

    const account = accountTypes[role] || {
        title: "Akun",
        IconComponent: UserCog,
    };
    const needsApproval = role === "admin";

    const breadcrumbItems = [
        { label: "Manajemen Akun", href: route("manajemen-akun.index") },
        { label: `Kelola ${account.title}`, href: "" },
    ];

    const resetPasswordAndCloseModal = async (
        newPassword,
        passwordConfirmation
    ) => {
        if (selectedUser) {
            await handleResetPassword(
                selectedUser,
                newPassword,
                passwordConfirmation
            );
            handleCloseModal();
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center font-medium text-red-600">
                Gagal memuat data pengguna.
            </div>
        );
    }

    return (
        <PageContent
            pageTitle={`Kelola Akun ${account.title}`}
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between mb-6 xl:gap-4">
                <HeaderContent
                    Icon={account.IconComponent}
                    title={`Daftar Akun ${account.title}`}
                    description={`Kelola semua akun ${role} yang terdaftar di sistem.`}
                />

                <SearchBar
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClear={handleClearSearch}
                    placeholder="Cari Nama, Email"
                    className="max-w-sm"
                />
            </div>

            {needsApproval && pendingUsers.length > 0 && (
                <div className="mb-8">
                    <h3 className="mb-4 text-lg font-medium text-gray-700">
                        Persetujuan Pengguna Baru
                    </h3>
                    <div className="hidden xl:block">
                        <ShowAkunTable
                            users={pendingUsers}
                            type="pending"
                            role={role}
                            onApprove={
                                role === "admin" ? handleApprove : undefined
                            }
                            onReject={
                                role === "admin" ? handleReject : undefined
                            }
                            isProcessing={isProcessing}
                        />
                    </div>
                    <div className="xl:hidden">
                        <ShowAkunCard
                            users={pendingUsers}
                            type="pending"
                            role={role}
                            onApprove={
                                role === "admin" ? handleApprove : undefined
                            }
                            onReject={
                                role === "admin" ? handleReject : undefined
                            }
                            isProcessing={isProcessing}
                        />
                    </div>
                </div>
            )}
            <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                    Daftar Pengguna Aktif
                </h3>
                {approvedUsers.length > 0 ? (
                    <>
                        <div className="hidden xl:block">
                            <ShowAkunTable
                                users={approvedUsers}
                                type="approved"
                                role={role}
                                onReject={handleReject}
                                isProcessing={isProcessing}
                                onOpenResetPasswordModal={handleOpenModal}
                            />
                        </div>
                        <div className="xl:hidden">
                            <ShowAkunCard
                                users={approvedUsers}
                                type="approved"
                                role={role}
                                onReject={handleReject}
                                isProcessing={isProcessing}
                                onOpenResetPasswordModal={handleOpenModal}
                            />
                        </div>
                    </>
                ) : (
                    <DataNotFound message={`Belum ada pengguna ${role}.`} />
                )}
            </div>
            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size="lg"
                    variant="outline"
                    href={route("manajemen-akun.index")}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Kembali
                </Button>
            </div>
            <ResetPasswordModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={selectedUser}
                onResetPassword={resetPasswordAndCloseModal}
            />
        </PageContent>
    );
};

export default ShowAccount;

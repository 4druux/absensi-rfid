import PageContent from "@/Components/ui/page-content";
import { usePage } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Button from "@/Components/ui/button";
import InputField from "@/Components/common/input-field";
import PasswordField from "@/Components/common/password-field";
import axios from "axios";

const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
};

const AccountSettingsPage = () => {
    const { auth } = usePage().props;
    const breadcrumbItems = [
        { label: "Pengaturan Akun", href: route("account.settings") },
    ];

    const [formData, setFormData] = useState({
        name: auth.user.name || "",
        email: auth.user.email || "",
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.put(
                "/api/account/settings", 
                formData
            );
            toast.success(
                response.data.message || "Pengaturan akun berhasil diperbarui."
            );

            setFormData((prev) => ({
                ...prev,
                name: response.data.user.name,
                current_password: "",
                password: "",
                password_confirmation: "",
            }));
        } catch (error) {
            if (
                error.response?.status === 422 &&
                error.response?.data?.errors
            ) {
                setErrors(error.response.data.errors);
                toast.error(error.response.data.message || "Data tidak valid.");
            } else {
                toast.error(
                    error.response?.data?.message || "Gagal memperbarui akun."
                );
                console.error("Update failed:", error);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <PageContent
            breadcrumbItems={breadcrumbItems}
            pageTitle="Pengaturan Akun"
            pageClassName="mt-4"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                        {getInitials(formData.name)}
                    </div>
                    <h3 className="text-md md:text-lg font-medium text-neutral-700">
                        {formData.name}
                    </h3>
                    <p className="text-sm md:text-md text-neutral-500 capitalize">
                        {auth.user.role.replace("_", " ")}
                    </p>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-md font-medium text-neutral-700 mb-4 border-b pb-2">
                            Profil
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                id="name"
                                name="name"
                                label="Nama"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name?.[0]}
                            />
                            <InputField
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                disabled={true}
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-md font-medium text-neutral-700 mb-4 border-b pb-2">
                            Ubah Password
                        </h3>
                        <div className="space-y-4">
                            <PasswordField
                                id="current_password"
                                name="current_password"
                                label="Password Lama"
                                value={formData.current_password}
                                onChange={handleChange}
                                error={errors.current_password?.[0]}
                                placeholder="Wajib diisi jika mengubah password"
                                autoComplete="current-password"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <PasswordField
                                    id="password"
                                    name="password"
                                    label="Password Baru"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password?.[0]}
                                    autoComplete="new-password"
                                />
                                <PasswordField
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    label="Konfirmasi Password Baru"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    error={errors.password?.[0]}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        as="link"
                        size="lg"
                        variant="outline"
                        href={route("home")}
                        iconLeft={<ArrowLeft className="h-5 w-5" />}
                    >
                        Kembali
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                        iconLeft={
                            processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )
                        }
                    >
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </PageContent>
    );
};

export default AccountSettingsPage;

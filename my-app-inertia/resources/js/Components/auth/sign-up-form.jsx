import React, { useState } from "react";
import { router } from "@inertiajs/react";
import InputField from "@/Components/common/input-field";
import PasswordField from "@/Components/common/password-field";
import toast from "react-hot-toast";
import Button from "../ui/button";
import { Loader2, LogIn } from "lucide-react";
import axios from "axios";

export default function SignUpForm() {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await axios.post(route("api.register"), values);
            toast.success(response.data.message);

            router.visit(route("login"));
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error("Gagal mendaftar, periksa kembali data Anda.");
            } else {
                toast.error("Terjadi kesalahan pada server.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md px-4 md:px-0">
            <div className="flex flex-col items-start">
                <h2 className="font-medium text-lg text-indigo-600">
                    Smk Yapia Parung (LOGO)
                </h2>
                <h1 className="mt-4 text-3xl text-gray-700">
                    Selamat Datang! 👋
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Silakan daftar akun Anda, dan mulai menggunakan aplikasi.
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                <InputField
                    id="name"
                    name="name"
                    label="Nama Lengkap"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                />
                <InputField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                />

                <PasswordField
                    id="password"
                    name="password"
                    label="Password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />
                <PasswordField
                    id="password_confirmation"
                    name="password_confirmation"
                    label="Konfirmasi Password"
                    value={values.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                    required
                />

                <div>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className="w-full"
                        iconLeft={
                            isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <LogIn className="h-4 w-4" />
                            )
                        }
                    >
                        {isSubmitting ? "Mendaftar..." : "Daftar"}
                    </Button>
                </div>
            </form>
            <h1 className="text-sm text-gray-700 mt-4">
                Sudah mempunyai akun?{" "}
                <a
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    Silahkan Masuk
                </a>
            </h1>
        </div>
    );
}

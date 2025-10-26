import React, { useState } from "react";
import { router } from "@inertiajs/react";
import InputField from "@/Components/common/input-field";
import PasswordField from "@/Components/common/password-field";
import toast from "react-hot-toast";
import { Loader2, LogIn } from "lucide-react";
import Button from "../ui/button";
import axios from "axios";

export default function SignInForm() {
    const [values, setValues] = useState({ email: "", password: "" });
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
            await axios.post(route("api.login"), values);

            toast.success("Login berhasil!");
            router.visit(route("home"));
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
                toast.error(
                    error.response.data.message || "Email atau password salah."
                );
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
                    Silakan masuk ke akun Anda, dan mulai menggunakan aplikasi.
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                <InputField
                    id="email"
                    name="email"
                    label="Email atau No Peserta"
                    type="text"
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
                        {isSubmitting ? "Memproses..." : "Masuk"}
                    </Button>
                </div>
            </form>
            <h1 className="text-sm text-gray-700 mt-4">
                Tidak mempunyai akun?{" "}
                <a
                    href="/register"
                    className="text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    Silahkan Daftar
                </a>
            </h1>
        </div>
    );
}

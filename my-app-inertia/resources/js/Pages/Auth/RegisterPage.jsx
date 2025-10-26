import React, { Suspense } from "react";
import DotLoader from "@/Components/ui/dot-loader";
import Badge from "@/Components/auth/badge";
import AuthHeader from "@/Components/auth/auth-header";
import SignUpForm from "@/Components/auth/sign-up-form";

const RegisterPage = () => {
    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 min-h-screen">
                <div className="hidden sm:flex sm:col-span-1 xl:col-span-2 items-center justify-center bg-gray-50 p-12 relative overflow-hidden">
                    <Badge
                        imageSrc="./images/register.svg"
                        altText="Register Illustration"
                    />
                </div>

                <div className="flex items-center justify-center sm:col-span-1">
                    <AuthHeader />
                    <Suspense
                        fallback={
                            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                                <DotLoader />
                            </div>
                        }
                    >
                        <SignUpForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

RegisterPage.layout = null;
export default RegisterPage;

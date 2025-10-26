import { Menu, Settings, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDropdown, dropdownAnimation } from "@/Hooks/use-dropdown";
import { usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import DotLoader from "./ui/dot-loader";
import toast from "react-hot-toast";
import axios from "axios";

const Header = ({ onMenuClick }) => {
    const { isOpen, setIsOpen, dropdownRef } = useDropdown();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { auth = { user: null } } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        setIsOpen(false);
        setIsLoggingOut(true);

        const logoutPromise = axios.post(route("api.logout"));

        toast.promise(logoutPromise, {
            loading: "Sedang keluar...",
            success: () => {
                window.location.href = route("login");
                return "Anda berhasil keluar.";
            },
            error: (err) => {
                console.error("Logout failed:", err);
                window.location.href = route("login");
                return "Gagal keluar, coba lagi.";
            },
        });
    };

    const getInitials = (name) => {
        if (!name) return "";
        const names = name.split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (
            names[0].charAt(0) + names[names.length - 1].charAt(0)
        ).toUpperCase();
    };

    const formatRoleName = (role) => {
        if (!role) return "";
        return role
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <>
            {isLoggingOut && (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-[999]">
                    <DotLoader />
                </div>
            )}

            <header className="lg:py-3 lg:px-6 text-gray-700 sticky top-0 z-30">
                <div className="flex items-center justify-between bg-white lg:border border-gray-300 rounded-lg lg:shadow-sm py-3 lg:px-4">
                    <div className="flex items-center gap-1">
                        {/* <img
                        src="/images/logo-jurusan.png"
                        alt="Logo"
                        className="w-10 md:w-14 object-cover"
                    /> */}

                        <div className="px-4 md:px-14">Logo</div>

                        <hr className="w-px h-8 bg-gray-300" />
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
                            aria-label="Toggle Menu"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <a
                            href="/"
                            className="text-sm uppercase hover:bg-gray-100 p-2 rounded-lg"
                        >
                            dashboard
                        </a>
                    </div>

                    {auth.user ? (
                        <div
                            ref={dropdownRef}
                            className="relative flex items-center pr-3"
                        >
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm md:text-md hover:bg-indigo-200 focus:outline-none cursor-pointer"
                                aria-label="User Profile"
                            >
                                {getInitials(auth.user.name)}
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={dropdownAnimation.variants}
                                        transition={
                                            dropdownAnimation.transition
                                        }
                                        className="absolute top-full right-3 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200"
                                    >
                                        <div
                                            className="p-2"
                                            role="menu"
                                            aria-orientation="vertical"
                                        >
                                            <div className="px-4 py-2 text-sm text-gray-800 border-b border-gray-100 mb-1">
                                                <div className="mb-1">
                                                    Halo! {auth.user.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatRoleName(
                                                        auth.user.role
                                                    )}
                                                </div>
                                            </div>
                                            <Link
                                                // href={route("account.settings")}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                role="menuitem"
                                            >
                                                <Settings className="w-4 h-4 text-gray-500" />
                                                <span>Pengaturan Akun</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                                                role="menuitem"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Keluar</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : null}
                </div>
            </header>
        </>
    );
};

export default Header;

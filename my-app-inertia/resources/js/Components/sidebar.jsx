import { useState } from "react";
import {
    Users,
    ChevronDown,
    HomeIcon,
    UserCog,
    ClipboardCheck,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";

const Sidebar = ({ isOpen }) => {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const { auth = { user: null } } = usePage().props;

    const userRole = auth.user?.role;
    const normalizedRole = userRole
        ? userRole.toLowerCase().replace(" ", "")
        : null;

    const hasAccess = (allowedRoles) => {
        if (!normalizedRole) return false;
        return allowedRoles.includes(normalizedRole);
    };

    const getIsActive = (href) => {
        const pathname = window.location.pathname;

        if (href === "/beranda") {
            return pathname === "/beranda" || pathname.startsWith("/beranda/");
        }

        return pathname === href || pathname.startsWith(href + "/");
    };

    const menuItems = [
        {
            id: "home",
            label: "Beranda",
            icon: HomeIcon,
            description: "Halaman utama",
            href: "/",
            canView: !!auth.user,
        },
        {
            id: "data-siswa",
            label: "Data Kelas & Siswa",
            icon: Users,
            description: "Kelola data kelas & siswa",
            href: "/data-siswa",
            canView: auth.user && hasAccess("superadmin", "admin"),
        },
        {
            id: "manajemen-akun",
            label: "Manajemen Akun",
            icon: UserCog,
            description: "Kelola akun pengguna",
            href: "/manajemen-akun",
            canView: auth.user && hasAccess("superadmin", "admin"),
        },
        {
            id: "absensi-siswa",
            label: "Absensi Siswa",
            icon: ClipboardCheck,
            description: "Absensi siswa",
            href: "/absensi-siswa",
            canView: auth.user && hasAccess("superadmin", "admin"),
        },
    ];

    const listVariants = {
        visible: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
        hidden: {},
    };

    const itemVariants = {
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
        hidden: {
            opacity: 0,
            x: -20,
        },
    };

    const footerVariants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: 0.5,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
        },
    };

    return (
        <aside
            className={`
        fixed top-0 left-0 bg-white z-50 rounded-r-xl lg:rounded-lg border transition-transform duration-300 ease-in-out w-[270px] 
        h-full lg:h-[calc(91vh-2.5rem)] lg:top-28
        ${isOpen ? "translate-x-0 lg:left-6" : "-translate-x-full"}`}
        >
            <div className="h-full flex flex-col">
                <div className="pt-6 px-4">
                    <div className="flex items-center gap-2 lg:gap-4">
                        <div>
                            <h1 className="text-md md:text-lg uppercase font-medium text-gray-700">
                                Smk yapia parung
                            </h1>
                            <p className="text-xs md:text-sm text-gray-600">
                                Absensi Online
                            </p>
                        </div>
                    </div>
                    <hr className="mt-4" />
                </div>

                <nav className="flex-1 pr-5 py-5 overflow-y-auto">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.ul
                                className="space-y-2"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={listVariants}
                            >
                                {menuItems.map((item) => {
                                    if (!item.canView) return null;

                                    const Icon = item.icon;
                                    const isParentActive =
                                        item.subMenu &&
                                        item.subMenu.some((subItem) =>
                                            getIsActive(subItem.href)
                                        );

                                    if (item.subMenu) {
                                        return (
                                            <motion.li
                                                key={item.id}
                                                variants={itemVariants}
                                            >
                                                <div
                                                    className={`w-full flex items-center justify-between p-3 rounded-r-full border-r border-y transition-all duration-200 text-left cursor-pointer group ${
                                                        isParentActive
                                                            ? "bg-indigo-100 border-indigo-500"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-transparent"
                                                    }`}
                                                    onClick={() =>
                                                        setOpenSubMenu(
                                                            openSubMenu ===
                                                                item.id
                                                                ? null
                                                                : item.id
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Icon
                                                            className={`w-7 h-7 ${
                                                                isParentActive
                                                                    ? "text-indigo-600"
                                                                    : "text-gray-600"
                                                            }`}
                                                        />
                                                        <div className="flex-1">
                                                            <div
                                                                className={`font-medium text-sm ${
                                                                    isParentActive
                                                                        ? "text-indigo-600"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {item.label}
                                                            </div>
                                                            <div
                                                                className={`text-xs ${
                                                                    isParentActive
                                                                        ? "text-indigo-600"
                                                                        : "text-gray-500 group-hover:text-gray-800"
                                                                }`}
                                                            >
                                                                {
                                                                    item.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronDown
                                                        className={`w-5 h-5 transition-transform duration-200 ${
                                                            openSubMenu ===
                                                            item.id
                                                                ? "rotate-180"
                                                                : ""
                                                        } ${
                                                            isParentActive
                                                                ? "text-indigo-600"
                                                                : "text-gray-600"
                                                        }`}
                                                    />
                                                </div>
                                                <AnimatePresence>
                                                    {openSubMenu ===
                                                        item.id && (
                                                        <motion.ul
                                                            initial={{
                                                                height: 0,
                                                                opacity: 0,
                                                                marginTop: 0,
                                                            }}
                                                            animate={{
                                                                height: "auto",
                                                                opacity: 1,
                                                                marginTop:
                                                                    "0.5rem",
                                                            }}
                                                            exit={{
                                                                height: 0,
                                                                opacity: 0,
                                                                marginTop: 0,
                                                            }}
                                                            className="pl-8 space-y-1 overflow-hidden"
                                                        >
                                                            {item.subMenu.map(
                                                                (subItem) => {
                                                                    const isSubActive =
                                                                        getIsActive(
                                                                            subItem.href
                                                                        );
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                subItem.id
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={
                                                                                    subItem.href
                                                                                }
                                                                                className={`w-full flex p-2 items-center rounded-full text-left ${
                                                                                    isSubActive
                                                                                        ? "bg-indigo-100 text-indigo-600 font-medium border-indigo-400 border"
                                                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:translate-x-1 transition-transform duration-300 will-change-transform"
                                                                                }`}
                                                                            >
                                                                                <span className="text-sm ml-2">
                                                                                    {
                                                                                        subItem.label
                                                                                    }
                                                                                </span>
                                                                            </Link>
                                                                        </li>
                                                                    );
                                                                }
                                                            )}
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </motion.li>
                                        );
                                    }

                                    const isActive = getIsActive(item.href);
                                    return (
                                        <motion.li
                                            key={item.id}
                                            variants={itemVariants}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`w-full flex items-center space-x-2 p-3 rounded-r-full border-r border-y transition-all duration-200 text-left cursor-pointer group ${
                                                    isActive
                                                        ? "bg-indigo-100 border-indigo-500"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-transparent"
                                                }`}
                                            >
                                                <Icon
                                                    className={`w-7 h-7 ${
                                                        isActive
                                                            ? "text-indigo-600"
                                                            : "text-gray-600"
                                                    }`}
                                                />
                                                <div className="flex-1">
                                                    <div
                                                        className={`font-medium text-sm ${
                                                            isActive
                                                                ? "text-indigo-600"
                                                                : ""
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </div>
                                                    <div
                                                        className={`text-xs ${
                                                            isActive
                                                                ? "text-indigo-600"
                                                                : "text-gray-500 group-hover:text-gray-800"
                                                        }`}
                                                    >
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </nav>

                <AnimatePresence>
                    {isOpen && (
                        <div className="p-4 border-t border-gray-200">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={footerVariants}
                                className="text-xs uppercase text-gray-500 text-center"
                            >
                                Smk Yapia Parung &copy;{" "}
                                {new Date().getFullYear()}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </aside>
    );
};

export default Sidebar;

import Header from "@/Components/header";
import Sidebar from "@/Components/sidebar";
import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import DotLoader from "@/Components/ui/dot-loader";

export default function MainLayout({ children, title }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!auth.user) {
            router.visit(route("login"), { replace: true });
        }
    }, [auth]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const isMobile = window.innerWidth < 1024;
        if (isSidebarOpen && isMobile) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleNavigate = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
        };

        const removeListener = router.on("navigate", handleNavigate);

        return () => {
            removeListener();
        };
    }, []);

    if (!auth.user) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header onMenuClick={toggleSidebar} pageTitle={title} />
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} />
                <div
                    onClick={toggleSidebar}
                    className={`
                        fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
                        ${
                            isSidebarOpen
                                ? "opacity-100 pointer-events-auto"
                                : "opacity-0 pointer-events-none"
                        }
                        lg:hidden
                    `}
                />
                <div
                    className={`min-w-0 w-full transition-all duration-300 ease-in-out ${
                        isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
                    }`}
                >
                    <main className="px-4 lg:px-6 mt-2">{children}</main>
                </div>
            </div>
        </div>
    );
}

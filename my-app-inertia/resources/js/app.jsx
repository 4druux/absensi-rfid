import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp, router } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import MainLayout from "./Layouts/MainLayout";

window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
        window.location.reload();
    }
});

const pageTitles = {
    "/login": "Login | SMK Yapia",
    "/register": "Register | SMK Yapia",
    "/auth-redirect": "Mengalihkan...",
    "/": "SMK Yapia",
    "/data-siswa": "Data Siswa | SMK Yapia",
    "/manajemen-akun": "Manajemen Akun | SMK Yapia",
};

const appName = import.meta.env.VITE_APP_NAME || "SMK Yapia";

createInertiaApp({
    title: (title) => {
        if (title.includes("404")) {
            return title;
        }

        const path = window.location.pathname;
        const mainSection = Object.keys(pageTitles)
            .sort((a, b) => b.length - a.length)
            .find((p) => path.startsWith(p));

        const pageTitleFromMap = pageTitles[mainSection];

        return pageTitleFromMap || `${title} - ${appName}`;
    },

    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];

        if (page.default.layout === undefined) {
            page.default.layout = (page) => <MainLayout>{page}</MainLayout>;
        }

        return page;
    },
    progress: {
        color: "#4B5563",
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    reverseOrder={true}
                    duration={5000}
                    toastOptions={{ className: "custom-toast" }}
                />
            </>
        );
    },
});

router.on("navigate", (event) => {
    const newCsrfToken = event.detail.page.props.csrf_token;
    const csrfMetaTag = document.head.querySelector('meta[name="csrf-token"]');

    if (newCsrfToken && csrfMetaTag) {
        if (csrfMetaTag.getAttribute("content") !== newCsrfToken) {
            csrfMetaTag.setAttribute("content", newCsrfToken);
        }
    }
});

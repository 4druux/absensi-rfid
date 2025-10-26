import CardContent from "@/Components/ui/card-content";
import HeaderContent from "@/Components/ui/header-content";
import PageContent from "@/Components/ui/page-content";
import { UserCog, UserLock } from "lucide-react";

const accountTypes = [
    {
        role: "admin",
        title: "Akun Admin",
        IconComponent: UserCog,
        description: "Kelola akun dengan hak akses administrator.",
    },
];

const SelectAccount = () => {
    const breadcrumbItems = [
        { label: "Manajemen Akun", href: route("manajemen-akun.index") },
    ];

    return (
        <PageContent
            pageTitle="Kelola Data Akun Pengguna"
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <HeaderContent
                Icon={UserLock}
                title="Daftar Akun Pengguna"
                description="Pilih tipe akun untuk melihat dan mengelola pengguna yang terdaftar."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {accountTypes.map((account) => (
                    <CardContent
                        key={account.role}
                        href={route("manajemen-akun.show", {
                            role: account.role,
                        })}
                        icon={<account.IconComponent className="h-12 w-12" />}
                        title={account.title}
                        description={account.description}
                    />
                ))}
            </div>
        </PageContent>
    );
};

export default SelectAccount;

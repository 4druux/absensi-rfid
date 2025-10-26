import BreadcrumbNav from "@/Components/ui/breadcrumb-nav";

const PageContent = ({
    children,
    breadcrumbItems,
    pageTitle,
    pageClassName,
}) => {
    return (
        <div>
            <BreadcrumbNav items={breadcrumbItems} pageTitle={pageTitle} />
            <div className={`pb-10 ${pageClassName}`}>
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 md:p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PageContent;

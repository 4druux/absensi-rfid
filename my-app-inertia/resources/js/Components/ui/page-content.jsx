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
            <div className={`pb-6 lg:pb-4 ${pageClassName}`}>
                <div className="bg-white md:shadow-sm md:border border-gray-200 md:rounded-lg md:p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PageContent;

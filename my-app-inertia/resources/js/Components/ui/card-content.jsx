import { Link } from "@inertiajs/react";
import { clsx } from "clsx";
import { ArrowUpRight, Trash2 } from "lucide-react";

const CardContent = ({
    icon,
    title,
    subtitle,
    description,
    href,
    className,
    onDelete,
    ...props
}) => {
    const Component = href ? Link : "div";

    const cardProps = {
        className: clsx(
            "relative z-10 flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg",
            {
                "cursor-pointer": href,
            },
            className
        ),
        ...(href && { href }),
        ...props,
    };

    const cardHoverProps =
        "absolute inset-0 rounded-xl bg-indigo-200 opacity-0 transition-all duration-300 ease-in-out z-0 group-hover:opacity-100 group-hover:rotate-3";

    const cardHoverStyles = {
        filter: "drop-shadow(0 4px 8px 8px rgba(0, 0, 0, 0.8))",
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete();
    };

    return (
        <div className="relative group h-full">
            <div className={cardHoverProps} style={cardHoverStyles} />

            <Component {...cardProps}>
                <div className="flex flex-col items-center py-6">
                    {icon && <div className="text-indigo-500">{icon}</div>}
                    {title && (
                        <h3 className="text-lg font-medium text-indigo-600">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <h3 className="text-md text-gray-500">{subtitle}</h3>
                    )}
                    {description && (
                        <h3 className="text-sm text-gray-500 px-4 text-center">
                            {description}
                        </h3>
                    )}
                </div>

                <div className="mt-auto flex justify-end items-end gap-2 pr-4 pb-4">
                    {onDelete && (
                        <div
                            onClick={handleDeleteClick}
                            className="p-2 bg-red-100 md:bg-gray-100 rounded-full border-2 border-red-500 md:border-gray-200 md:group-hover:bg-red-100 group-hover:border-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                    )}

                    <div className="p-2 bg-indigo-100 md:bg-gray-100 rounded-full border-2 border-indigo-500 md:border-gray-200 group-hover:bg-indigo-100 group-hover:border-indigo-500">
                        <ArrowUpRight className="w-5 h-5 mx-auto text-indigo-600 md:text-gray-600 md:group-hover:text-indigo-600 rotate-45 md:rotate-0 md:group-hover:rotate-45 transition-transform duration-300 will-change-transform" />
                    </div>
                </div>
            </Component>
        </div>
    );
};

export default CardContent;

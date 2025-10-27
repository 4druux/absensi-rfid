import { Link } from "@inertiajs/react";
import { clsx } from "clsx";
import {
    ArrowUpRight,
    PenLine,
    Trash2,
    PlayCircle,
    XCircle,
} from "lucide-react";

const CardContent = ({
    icon,
    title,
    subtitle,
    description,
    href,
    className,
    onDelete,
    onEdit,
    onToggleActive,
    isActive,
    ...props
}) => {
    const Component = href ? Link : "div";

    const cardProps = {
        className: clsx(
            "relative z-10 flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg",
            isActive ? "border-emerald-300" : "border-gray-200",
            { "cursor-pointer": href },
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

    const handleEditClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit();
    };

    const handleToggleActiveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleActive();
    };

    return (
        <div className="relative group h-full">
            <div className={cardHoverProps} style={cardHoverStyles} />

            <Component {...cardProps}>
                {isActive && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                        AKTIF
                    </div>
                )}
                <div className="flex flex-col items-center py-6">
                    {icon && (
                        <div
                            className={clsx(
                                "mb-2",
                                isActive
                                    ? "text-emerald-500"
                                    : "text-indigo-500"
                            )}
                        >
                            {icon}
                        </div>
                    )}
                    {title && (
                        <h3
                            className={clsx(
                                "text-lg font-medium",
                                isActive
                                    ? "text-emerald-600"
                                    : "text-indigo-600"
                            )}
                        >
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
                    {onToggleActive && (
                        <div
                            onClick={handleToggleActiveClick}
                            title={
                                isActive ? "Nonaktifkan Sesi" : "Aktifkan Sesi"
                            }
                            className={clsx(
                                "p-2 rounded-full border-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer",
                                isActive
                                    ? "bg-red-100 border-red-500 md:bg-gray-100 md:border-gray-200 md:group-hover:bg-red-100 group-hover:border-red-500"
                                    : "bg-emerald-100 border-emerald-500 md:bg-gray-100 md:border-gray-200 md:group-hover:bg-emerald-100 group-hover:border-emerald-500"
                            )}
                        >
                            {isActive ? (
                                <XCircle className="w-5 h-5 text-red-600" />
                            ) : (
                                <PlayCircle className="w-5 h-5 text-emerald-600" />
                            )}
                        </div>
                    )}

                    {onEdit && (
                        <div
                            onClick={handleEditClick}
                            title="Edit"
                            className="p-2 bg-gray-100 md:bg-gray-100 rounded-full border-2 border-gray-500 md:border-gray-200 md:group-hover:bg-gray-100 group-hover:border-gray-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <PenLine className="w-5 h-5 text-gray-600" />
                        </div>
                    )}

                    {onDelete && (
                        <div
                            onClick={handleDeleteClick}
                            title="Hapus"
                            className="p-2 bg-red-100 md:bg-gray-100 rounded-full border-2 border-red-500 md:border-gray-200 md:group-hover:bg-red-100 group-hover:border-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                    )}

                    {href && (
                        <div className="p-2 bg-indigo-100 md:bg-gray-100 rounded-full border-2 border-indigo-500 md:border-gray-200 group-hover:bg-indigo-100 group-hover:border-indigo-500">
                            <ArrowUpRight className="w-5 h-5 mx-auto text-indigo-600 md:text-gray-600 md:group-hover:text-indigo-600 rotate-45 md:rotate-0 md:group-hover:rotate-45 transition-transform duration-300 will-change-transform" />
                        </div>
                    )}
                </div>
            </Component>
        </div>
    );
};

export default CardContent;

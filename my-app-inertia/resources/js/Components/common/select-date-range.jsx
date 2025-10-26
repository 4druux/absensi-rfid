import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { id as localeId } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import "react-day-picker/dist/style.css";
import { dropdownAnimation, useDropdown } from "@/Hooks/use-dropdown";
import { AnimatePresence, motion } from "framer-motion";

function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}

export default function SelectDateRange({
    id,
    label,
    value,
    onChange,
    error,
    mandatory = false,
    disabled = false,
    className,
}) {
    const { isOpen, setIsOpen, dropdownRef } = useDropdown();

    const hasValue = value?.from;

    const labelClasses = cn(
        "pointer-events-none absolute left-3 transform px-1 text-sm",
        "transition-all duration-200 ease-in-out",
        disabled ? "bg-gray-100" : "bg-white",
        hasValue || isOpen
            ? "top-0 -translate-y-1/2"
            : "top-1/2 -translate-y-1/2",
        error ? "text-red-500" : isOpen ? "text-indigo-500" : "text-gray-500"
    );

    const triggerClasses = cn(
        "flex items-center justify-between w-full rounded-lg border",
        "px-3 py-3 text-left text-sm",
        "focus:outline-none focus:ring-0",
        disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer",
        error
            ? "border-red-500"
            : isOpen
            ? "border-indigo-500"
            : "border-gray-300",
        className
    );

    const formattedValue = hasValue ? (
        value.to ? (
            <>
                {format(value.from, "d MMM yyyy", { locale: localeId })} -{" "}
                {format(value.to, "d MMM yyyy", { locale: localeId })}
            </>
        ) : (
            format(value.from, "d MMM yyyy", { locale: localeId })
        )
    ) : (
        <>&nbsp;</>
    );

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <button
                    type="button"
                    id={id}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={triggerClasses}
                >
                    <span className="flex items-center gap-2 text-gray-900">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        {formattedValue}
                    </span>
                    <div
                        className={cn(
                            "transform transition-transform",
                            isOpen && "rotate-180"
                        )}
                    >
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                </button>
                <label htmlFor={id} className={labelClasses}>
                    {label}
                    {mandatory && <span className="ml-1 text-red-600">*</span>}
                </label>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownAnimation.variants}
                        transition={dropdownAnimation.transition}
                        className="absolute z-20 mt-1 w-auto rounded-lg border border-gray-300 bg-white p-0 shadow-lg"
                    >
                        <DayPicker
                            locale={localeId}
                            mode="range"
                            selected={value}
                            onSelect={onChange}
                            defaultMonth={value?.from || new Date()}
                            numberOfMonths={1}
                            classNames={{
                                months: "flex flex-row gap-4 p-6",
                                caption_label: "text-sm font-medium",
                                head_cell:
                                    "text-gray-500 rounded-md font-normal text-[0.7rem]",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:!bg-indigo-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                                day: "p-0 font-normal text-xs relative",
                                day_selected:
                                    "!bg-indigo-600 text-white rounded-full transform scale-10",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { dropdownAnimation, useDropdown } from "@/Hooks/use-dropdown";

export function SelectTimePicker({
    id,
    label,
    mandatory = false,
    value,
    onChange,
    error = "",
    disabled = false,
    className,
}) {
    const { isOpen, setIsOpen, dropdownRef } = useDropdown();

    const [hour, minute] = useMemo(() => {
        if (!value) return [null, null];
        const parts = value.split(":");
        return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
    }, [value]);

    const handleHourChange = (newHour) => {
        const currentMinute = minute ?? 0;
        const formattedHour = String(newHour).padStart(2, "0");
        const formattedMinute = String(currentMinute).padStart(2, "0");
        onChange(`${formattedHour}:${formattedMinute}`);
    };

    const handleMinuteChange = (newMinute) => {
        const currentHour = hour ?? 0;
        const formattedHour = String(currentHour).padStart(2, "0");
        const formattedMinute = String(newMinute).padStart(2, "0");
        onChange(`${formattedHour}:${formattedMinute}`);
        setIsOpen(false);
    };

    const hourRef = useRef(null);
    const minuteRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (hourRef.current) {
                    hourRef.current.scrollIntoView({ block: "center" });
                }
                if (minuteRef.current) {
                    minuteRef.current.scrollIntoView({ block: "center" });
                }
            }, 100);
        }
    }, [isOpen, hour, minute]);

    const triggerClasses = [
        "flex items-center justify-between w-full rounded-lg border",
        "px-3 py-3 text-left text-sm",
        "focus:outline-none focus:ring-0",
        disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer",
        error
            ? "border-red-500"
            : isOpen
            ? "border-indigo-500"
            : "border-gray-300",
        className,
    ].join(" ");

    const labelClasses = [
        "pointer-events-none absolute left-3 transform px-1 text-sm",
        "transition-all duration-200 ease-in-out",
        disabled ? "bg-gray-100" : "bg-white",
        value || isOpen ? "top-0 -translate-y-1/2" : "top-1/2 -translate-y-1/2",
        error ? "text-red-500" : isOpen ? "text-indigo-500" : "text-gray-500",
    ].join(" ");

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
                    <span className="flex items-center gap-2 text-sm text-gray-900">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {value || <>&nbsp;</>}
                    </span>
                    <div
                        className={`transform transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
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
                        className="absolute z-20 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex h-64 w-1/2 flex-col">
                                <h4 className="flex-shrink-0 border-b border-gray-200 py-2 text-center text-sm font-medium text-gray-500">
                                    Jam
                                </h4>
                                <div className="overflow-y-auto">
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <div
                                            key={`hour-${i}`}
                                            ref={i === hour ? hourRef : null}
                                            onClick={() => handleHourChange(i)}
                                            className={`flex-shrink-0 cursor-pointer px-6 py-2 text-center text-sm transition-colors ${
                                                i === hour
                                                    ? "bg-indigo-500 text-white"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {String(i).padStart(2, "0")}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex h-64 w-1/2 flex-col">
                                <h4 className="flex-shrink-0 border-b border-gray-200 py-2 text-center text-sm font-medium text-gray-500">
                                    Menit
                                </h4>
                                <div className="overflow-y-auto">
                                    {Array.from({ length: 60 }, (_, i) => (
                                        <div
                                            key={`minute-${i}`}
                                            ref={
                                                i === minute ? minuteRef : null
                                            }
                                            onClick={() =>
                                                handleMinuteChange(i)
                                            }
                                            className={`flex-shrink-0 cursor-pointer px-6 py-2 text-center text-sm transition-colors ${
                                                i === minute
                                                    ? "bg-indigo-500 text-white"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {String(i).padStart(2, "0")}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

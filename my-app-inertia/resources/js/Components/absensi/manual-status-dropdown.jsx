import React, { useState } from "react";
import Button from "@/Components/ui/button";
import { Loader2, Menu, Check } from "lucide-react";

const ManualStatusDropdown = ({
    siswaId,
    currentStatus,
    onManualAttendance,
    isToggling,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const availableStatuses = [
        { label: "Hadir", value: "Hadir", variant: "primary" },
        { label: "Telat", value: "Telat", variant: "warning" },
        { label: "Sakit", value: "Sakit", variant: "info" },
        { label: "Izin", value: "Izin", variant: "secondary" },
        { label: "Bolos", value: "Bolos", variant: "danger" },
        {
            label: "Batalkan Absensi (Alfa)",
            value: "Alfa",
            variant: "outline-danger",
        },
    ];

    const handleAction = (statusValue) => {
        setIsOpen(false);
        onManualAttendance(siswaId, statusValue);
    };

    return (
        <div className="relative inline-block text-left">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isToggling === siswaId}
                iconLeft={
                    isToggling === siswaId ? (
                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                    ) : (
                        <Menu className="h-3.5 w-3.5" />
                    )
                }
            >
                {isToggling === siswaId ? "Memproses..." : "Ubah Status"}
            </Button>

            {isOpen && (
                <div
                    className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none right-0 xl:left-0"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    <div className="py-1" role="none">
                        {availableStatuses.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => handleAction(status.value)}
                                disabled={
                                    isToggling === siswaId ||
                                    currentStatus === status.value
                                }
                                className={`
                                    ${
                                        currentStatus === status.value
                                            ? "bg-slate-100 font-semibold"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                    group flex w-full items-center px-4 py-2 text-sm text-left
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                `}
                                role="menuitem"
                            >
                                {status.value === currentStatus && (
                                    <Check className="h-4 w-4 mr-2 text-emerald-500" />
                                )}
                                {status.value !== currentStatus && (
                                    <span className="h-4 w-4 mr-2" />
                                )}
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManualStatusDropdown;

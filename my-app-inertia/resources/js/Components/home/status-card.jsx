import { CreditCard, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

function StatusCard({ status, sessionActive }) {
    const isWaitingWithNoSession = status.type === "waiting" && !sessionActive;

    const getStatusStyles = () => {
        if (isWaitingWithNoSession) {
            return {
                container: "bg-white",
                border: "border-gray-300",
                icon: "bg-gray-500",
                iconComponent: (
                    <XCircle
                        className="w-10 h-10 md:w-16 md:h-16 text-white"
                        strokeWidth={2.5}
                    />
                ),
                text: "text-gray-700",
            };
        }

        switch (status.type) {
            case "success":
                return {
                    container:
                        "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300",
                    border: "border-emerald-300",
                    icon: "bg-emerald-600",
                    iconComponent: (
                        <CheckCircle2
                            className="w-10 h-10 md:w-16 md:h-16 text-white"
                            strokeWidth={2.5}
                        />
                    ),
                    text: "text-emerald-900",
                };
            case "duplicate":
                return {
                    container:
                        "bg-gradient-to-br from-amber-50 to-amber-200 border-amber-300",
                    border: "border-amber-300",
                    icon: "bg-amber-600",
                    iconComponent: (
                        <AlertCircle
                            className="w-10 h-10 md:w-16 md:h-16 text-white"
                            strokeWidth={2.5}
                        />
                    ),
                    text: "text-amber-900",
                };
            case "error":
                return {
                    container:
                        "bg-gradient-to-br from-red-50 to-red-100 border-red-300",
                    border: "border-red-300",
                    icon: "bg-red-600",
                    iconComponent: (
                        <XCircle
                            className="w-10 h-10 md:w-16 md:h-16 text-white"
                            strokeWidth={2.5}
                        />
                    ),
                    text: "text-red-900",
                };
            default:
                return {
                    container: "bg-white",
                    border: "border-gray-300",
                    icon: "bg-gray-600",
                    iconComponent: (
                        <CreditCard
                            className="w-10 h-10 md:w-16 md:h-16 text-white"
                            strokeWidth={2.5}
                        />
                    ),
                    text: "text-gray-700",
                    pulse: "animate-pulse",
                };
        }
    };

    const styles = getStatusStyles();

    let displayMessage = status.message;
    if (isWaitingWithNoSession) {
        displayMessage = (
            <>
                Tidak Ada Sesi Aktif
                <br />
                <p>Mulai sesi absensi dari halaman admin untuk scan.</p>
            </>
        );
    }

    return (
        <div
            className={`bg-white rounded-lg p-3 border md:py-9 ${styles.container} transition-all duration-300 ease-in-out`}
        >
            <div className="text-center">
                {status.type === "waiting" && sessionActive && (
                    <h2 className="text-lg md:text-xl text-gray-800 mb-4 font-medium">
                        Tempelkan Kartu Pelajar Anda
                    </h2>
                )}

                <div className="flex flex-col items-center gap-3 md:gap-6">
                    <div
                        className={`flex items-center justify-center w-20 h-20 md:w-32 md:h-32 ${styles.icon} rounded-full ${styles.pulse}`}
                    >
                        {styles.iconComponent}
                    </div>

                    <div className={styles.text}>
                        <p className="text-md md:text-lg font-medium text-center">
                            {displayMessage}
                        </p>
                    </div>
                </div>

                <div className={`mt-8 pt-8 border-t ${styles.border}`}>
                    <p className={`text-sm md:text-md ${styles.text}`}>
                        {isWaitingWithNoSession
                            ? "Monitor Absensi - Sesi Nonaktif"
                            : "Tempelkan kartu Anda untuk mencatat kehadiran"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StatusCard;

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({
    id,
    name,
    label,
    disabled = false,
    error,
    className,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const inputClasses = [
        "peer",
        "block",
        "w-full",
        "appearance-none",
        "rounded-lg",
        "border",
        "bg-transparent",
        "px-3",
        "py-3",
        "text-gray-900",
        "placeholder-transparent",
        "focus:outline-none",
        "focus:ring-0",
        "sm:text-sm",
        "pr-12",
        error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-indigo-500",
        disabled ? "cursor-not-allowed bg-gray-100" : "",
        className,
    ].join(" ");

    const labelClasses = [
        "pointer-events-none",
        "absolute",
        "left-3",
        "top-0",
        "-translate-y-1/2",
        "transform",
        "bg-white",
        "px-1",
        "text-sm",
        "transition-all",
        "duration-200",
        "ease-in-out",
        "peer-placeholder-shown:top-1/2",
        error ? "text-red-500" : "text-gray-500",
        error ? "peer-focus:text-red-500" : "peer-focus:text-indigo-500",
        "peer-focus:top-0",
    ].join(" ");

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    disabled={disabled}
                    placeholder=" "
                    className={inputClasses}
                    {...props}
                />
                <label htmlFor={id} className={labelClasses}>
                    {label}
                </label>
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                    aria-label={
                        showPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                    }
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default PasswordField;

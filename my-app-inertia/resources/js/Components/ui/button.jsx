import React from "react";
import { clsx } from "clsx";
import { Link } from "@inertiajs/react";

const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-3 text-sm",
    xl: "px-6 py-3.5 text-base",
};

const Button = ({
    children,
    as = "button",
    href = "",
    type = "button",
    variant = "primary",
    size = "lg",
    iconLeft,
    iconRight,
    className,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2";

    const variantStyles = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        outline:
            "border border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-100",
        danger: "border bg-red-50 border-red-600 text-red-600 hover:bg-red-100",
        success:
            "border bg-green-50 border-green-600 text-green-600 hover:bg-green-100",
        blue: "border bg-blue-50 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-100",
    };

    const getSizeClasses = () => {
        if (typeof size === "object") {
            const responsiveClasses = Object.entries(size).map(
                ([breakpoint, sizeValue]) => {
                    const styles = sizeStyles[sizeValue];
                    if (!styles) return "";
                    return breakpoint === "base"
                        ? styles
                        : styles
                              .split(" ")
                              .map((cls) => `${breakpoint}:${cls}`)
                              .join(" ");
                }
            );
            return responsiveClasses.join(" ");
        }
        return sizeStyles[size] || sizeStyles.lg;
    };

    const allProps = {
        className: clsx(
            baseStyles,
            variantStyles[variant],
            getSizeClasses(),
            className
        ),
        ...props,
    };

    if (as === "link") {
        return (
            <Link href={href} {...allProps}>
                {iconLeft}
                {children}
                {iconRight}
            </Link>
        );
    }

    return (
        <button type={type} {...allProps}>
            {iconLeft}
            {children}
            {iconRight}
        </button>
    );
};

export default Button;

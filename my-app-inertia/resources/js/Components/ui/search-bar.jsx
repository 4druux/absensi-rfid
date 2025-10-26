import { Search, X } from "lucide-react";
import React from "react";

const SearchBar = ({
    value,
    onChange,
    onClear,
    placeholder = "Cari...",
    className = "",
}) => {
    return (
        <div className={`group relative w-full ${className}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400 transition-colors duration-150 group-focus-within:text-indigo-500" />
                <div className="ml-2 h-5 border-l border-gray-300 transition-colors duration-150 group-focus-within:border-indigo-500" />
            </div>
            <input
                type="text"
                id="search"
                name="search"
                value={value}
                onChange={onChange}
                className="block w-full rounded-full border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-base text-gray-800 placeholder:text-sm placeholder:text-gray-500 transition duration-150 ease-in-out focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder={placeholder}
            />
            {value && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <button
                        type="button"
                        onClick={onClear}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                        aria-label="Hapus pencarian"
                    >
                        <X className="h-4 w-4 hover:rotate-180 transition-transform duration-500 ease-in-out" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;

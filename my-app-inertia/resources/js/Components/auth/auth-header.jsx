import React from "react";

export default function AuthHeader() {
    return (
        <div className="fixed top-10 w-full max-w-md px-4 md:px-0 z-10">
            <div className="flex items-center gap-4">
                Logo
                <div className="flex flex-col items-start">
                    <h2 className="text-md font-medium text-gray-800">
                        Absensi RFID
                    </h2>
                    <p className="text-sm text-gray-500">SMK Yapia Parung</p>
                </div>
            </div>
            <hr className="my-4" />
        </div>
    );
}

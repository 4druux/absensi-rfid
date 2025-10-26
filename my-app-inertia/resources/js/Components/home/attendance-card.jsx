import { School, Clock, List, Users } from "lucide-react";
import HeaderContent from "../ui/header-content";
import DataNotFound from "../ui/data-not-found";

const AttendanceCard = ({ records = [] }) => {
    const studentDetails = [{ icon: Users, label: `${records.length} Siswa` }];

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-3 md:p-6">
            <HeaderContent
                Icon={List}
                title="Daftar Absen Siswa"
                details={studentDetails}
            />

            {records.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 mt-4">
                    {records.map((record, index) => (
                        <div
                            key={record.id}
                            className="border rounded-xl border-gray-300"
                        >
                            <div className="p-4 flex items-start gap-3">
                                <p className="text-sm font-medium text-gray-700 pt-0.5">
                                    {index + 1}.
                                </p>

                                <div className="flex flex-col gap-2 w-full">
                                    <p className="text-base font-medium text-gray-700">
                                        {record.nama}
                                    </p>

                                    <div className="flex items-center gap-2 text-gray-700">
                                        <School className="w-4 h-4" />
                                        <div className="flex justify-between w-full text-sm">
                                            <span className="text-xs font-normal text-gray-500">
                                                Kelas:
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {record.kelas}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Clock className="w-4 h-4" />
                                        <div className="flex justify-between w-full text-sm">
                                            <span className="text-xs font-normal text-gray-500">
                                                Waktu Absen:
                                            </span>
                                            <span className="font-mono font-medium text-gray-800">
                                                {record.waktu}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <DataNotFound message="Belum ada siswa yang absen hari ini." />
            )}
        </div>
    );
};

export default AttendanceCard;

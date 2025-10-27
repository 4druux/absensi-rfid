import { List, Users } from "lucide-react";
import HeaderContent from "../ui/header-content";
import DataNotFound from "../ui/data-not-found";

const AttendanceTable = ({ records }) => {
    const studentDetails = [{ icon: Users, label: `${records.length} Siswa` }];

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-3 md:p-6">
            <HeaderContent
                Icon={List}
                title="Daftar Absen Siswa"
                details={studentDetails}
            />

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                            <th className="w-16 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                No.
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Nama Siswa
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Kelas
                            </th>
                            <th className="w-40 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Waktu Absen
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <tr
                                    key={record.id}
                                    className="even:bg-slate-50 hover:bg-slate-100"
                                >
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                        {index + 1}.
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                        {record.nama}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                                        {record.kelas}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">
                                        {record.waktu}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>
                                    <DataNotFound message="Belum ada siswa yang absen hari ini." />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceTable;

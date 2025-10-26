import { Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";
import InputField from "../common/input-field";

const InputSiswaTable = ({
    students,
    handleStudentChange,
    removeStudentRow,
    displayErrors,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            No
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            Nama Siswa <span className="text-red-600">*</span>
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            RFID <span className="text-red-600">*</span>
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            Jenis Kelamin
                            <span className="text-red-600">*</span>
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-center uppercase text-gray-500">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {students.map((student, index) => (
                        <tr
                            key={student.id}
                            className="even:bg-slate-50 hover:bg-slate-100"
                        >
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800">
                                {index + 1}.
                            </td>
                            <td className="px-6 py-4">
                                <InputField
                                    id={`student-nama-${index}`}
                                    name="nama"
                                    label="Nama Siswa"
                                    type="text"
                                    value={student.nama}
                                    onChange={(e) =>
                                        handleStudentChange(
                                            index,
                                            "nama",
                                            e.target.value
                                        )
                                    }
                                    error={
                                        displayErrors[`students.${index}.nama`]
                                    }
                                    required
                                />
                            </td>
                            <td className="px-6 py-4">
                                <InputField
                                    id={`student-rfid-${index}`}
                                    name="rfid"
                                    label="RFID"
                                    type="text"
                                    value={student.rfid}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            handleStudentChange(
                                                index,
                                                "rfid",
                                                value
                                            );
                                        }
                                    }}
                                    error={
                                        displayErrors[`students.${index}.rfid`]
                                    }
                                />
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`jenis_kelamin-${index}`}
                                            value="L"
                                            checked={
                                                student.jenis_kelamin === "L"
                                            }
                                            onChange={(e) =>
                                                handleStudentChange(
                                                    index,
                                                    "jenis_kelamin",
                                                    e.target.value
                                                )
                                            }
                                            className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                        />
                                        <span>L</span>
                                    </label>
                                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`jenis_kelamin-${index}`}
                                            value="P"
                                            checked={
                                                student.jenis_kelamin === "P"
                                            }
                                            onChange={(e) =>
                                                handleStudentChange(
                                                    index,
                                                    "jenis_kelamin",
                                                    e.target.value
                                                )
                                            }
                                            className="form-radio h-4 w-4 text-pink-600 border-slate-300 focus:ring-pink-500"
                                        />
                                        <span>P</span>
                                    </label>
                                </div>
                                {displayErrors[
                                    `students.${index}.jenis_kelamin`
                                ] && (
                                    <p className="mt-1 text-xs text-red-600">
                                        Wajib dipilih.
                                    </p>
                                )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <Button
                                    onClick={() => removeStudentRow(student.id)}
                                    variant="danger"
                                    size={{ base: "md" }}
                                    iconLeft={<Trash2 className="h-5 w-5" />}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InputSiswaTable;

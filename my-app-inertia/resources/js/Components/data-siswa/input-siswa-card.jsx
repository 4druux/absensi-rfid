import { Trash2 } from "lucide-react";
import Button from "@/Components/ui/button";
import InputField from "../common/input-field";

const InputSiswaCard = ({
    students,
    handleStudentChange,
    removeStudentRow,
    displayErrors,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {students.map((student, index) => (
                <div
                    key={student.id}
                    className="flex flex-col gap-3 p-4 border rounded-lg border-slate-300"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">
                            Siswa {index + 1}
                        </p>
                        <Button
                            onClick={() => removeStudentRow(student.id)}
                            variant="danger"
                            size={{ base: "sm" }}
                            iconLeft={<Trash2 className="h-5 w-5" />}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
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
                                error={displayErrors[`students.${index}.nama`]}
                                required
                            />
                        </div>
                        <div>
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
                                error={displayErrors[`students.${index}.rfid`]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jenis Kelamin{" "}
                                <span className="text-red-600">*</span>
                            </label>
                            <div className="flex items-center space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`jenis_kelamin-card-${index}`}
                                        value="L"
                                        checked={student.jenis_kelamin === "L"}
                                        onChange={(e) =>
                                            handleStudentChange(
                                                index,
                                                "jenis_kelamin",
                                                e.target.value
                                            )
                                        }
                                        className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                    />
                                    <span>Laki-laki</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`jenis_kelamin-card-${index}`}
                                        value="P"
                                        checked={student.jenis_kelamin === "P"}
                                        onChange={(e) =>
                                            handleStudentChange(
                                                index,
                                                "jenis_kelamin",
                                                e.target.value
                                            )
                                        }
                                        className="form-radio h-4 w-4 text-pink-600 border-slate-300 focus:ring-pink-500"
                                    />
                                    <span>Perempuan</span>
                                </label>
                            </div>
                            {displayErrors[
                                `students.${index}.jenis_kelamin`
                            ] && (
                                <p className="mt-1 text-xs text-red-600">
                                    Jenis kelamin wajib dipilih.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InputSiswaCard;

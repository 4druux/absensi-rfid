import {
    PenLine,
    Trash2,
    Save,
    X,
    Mars,
    Venus,
    Fingerprint,
} from "lucide-react";
import Button from "../ui/button";
import InputField from "../common/input-field";

const ShowSiswaCard = ({
    students,
    editingId,
    editData,
    editErrors,
    handleEditClick,
    handleUpdate,
    handleDelete,
    handleCancelEdit,
    handleInputChange,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {students.map((student, index) => (
                <div
                    key={student.id}
                    className="space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="flex items-start justify-between p-4">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-gray-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-800">
                                    {student.nama}
                                </p>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <Fingerprint className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            RFID:{" "}
                                        </span>
                                        {student.rfid}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800">
                                    {student.jenis_kelamin === "L" ? (
                                        <Mars className="w-5 h-5" />
                                    ) : (
                                        <Venus className="w-5 h-5" />
                                    )}

                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="font-normal">
                                            Jenis Kelamin:{" "}
                                        </span>
                                        {student.jenis_kelamin === "L"
                                            ? "Laki-laki"
                                            : "Perempuan"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 border-t rounded-b-xl border-slate-300 bg-gray-100">
                        {editingId === student.id ? (
                            <div className="flex flex-col gap-3">
                                <InputField
                                    id={`edit-nama-card-${student.id}`}
                                    key={`nama-card-${student.id}`}
                                    name="nama"
                                    label="Nama Siswa"
                                    type="text"
                                    value={editData.nama}
                                    onChange={handleInputChange}
                                    error={
                                        editErrors?.nama
                                            ? editErrors.nama[0]
                                            : undefined
                                    }
                                />

                                <InputField
                                    id={`edit-rfid-card-${student.id}`}
                                    key={`rfid-card-${student.id}`}
                                    name="rfid"
                                    label="RFID"
                                    type="text"
                                    value={editData.rfid}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    error={
                                        editErrors?.rfid
                                            ? editErrors.rfid[0]
                                            : undefined
                                    }
                                />

                                <div>
                                    <span className="text-xs text-gray-500">
                                        Jenis Kelamin
                                    </span>
                                    <div className="flex items-center space-x-6 mt-1">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                key={`jk-l-card-${student.id}`}
                                                type="radio"
                                                name={`jenis_kelamin_${student.id}`}
                                                value="L"
                                                checked={
                                                    editData.jenis_kelamin ===
                                                    "L"
                                                }
                                                onChange={(e) => {
                                                    const event = {
                                                        target: {
                                                            name: "jenis_kelamin",
                                                            value: e.target
                                                                .value,
                                                        },
                                                    };
                                                    handleInputChange(event);
                                                }}
                                                className="form-radio h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                            />
                                            <span>Laki-laki</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                key={`jk-p-card-${student.id}`}
                                                type="radio"
                                                name={`jenis_kelamin_${student.id}`}
                                                value="P"
                                                checked={
                                                    editData.jenis_kelamin ===
                                                    "P"
                                                }
                                                onChange={(e) => {
                                                    const event = {
                                                        target: {
                                                            name: "jenis_kelamin",
                                                            value: e.target
                                                                .value,
                                                        },
                                                    };
                                                    handleInputChange(event);
                                                }}
                                                className="form-radio h-4 w-4 text-pink-600 border-slate-300 focus:ring-pink-500"
                                            />
                                            <span>Perempuan</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        size="md"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        iconLeft={<X className="w-4 h-4" />}
                                    />
                                    <Button
                                        size="md"
                                        onClick={(e) =>
                                            handleUpdate(e, student.id)
                                        }
                                        iconLeft={<Save className="w-4 h-4" />}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="md"
                                    variant="outline"
                                    onClick={() => handleEditClick(student)}
                                    iconLeft={<PenLine className="w-4 h-4" />}
                                />
                                <Button
                                    size="md"
                                    variant="danger"
                                    onClick={(e) => handleDelete(e, student.id)}
                                    iconLeft={<Trash2 className="w-4 h-4" />}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowSiswaCard;

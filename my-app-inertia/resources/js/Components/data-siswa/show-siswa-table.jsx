import { PenLine, Trash2, Save, X } from "lucide-react";
import Button from "../ui/button";
import InputField from "../common/input-field";

const ShowSiswaTable = ({
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
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            No
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            Nama Siswa
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            RFID
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-gray-500">
                            Jenis Kelamin
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
                            <td className="px-6 py-4 whitespace-nowrap">
                                {editingId === student.id ? (
                                    <InputField
                                        id={`edit-nama-${student.id}`}
                                        key={`nama-${student.id}`}
                                        name="nama"
                                        label="Nama"
                                        type="text"
                                        value={editData.nama}
                                        onChange={handleInputChange}
                                        error={
                                            editErrors?.nama
                                                ? editErrors.nama[0]
                                                : undefined
                                        }
                                    />
                                ) : (
                                    <div className="text-sm font-medium text-gray-800">
                                        {student.nama}
                                    </div>
                                )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                {editingId === student.id ? (
                                    <InputField
                                        id={`edit-rfid-${student.id}`}
                                        key={`rfid-${student.id}`}
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
                                ) : (
                                    <div className="text-sm font-medium text-gray-800">
                                        {student.rfid}
                                    </div>
                                )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                {editingId === student.id ? (
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                                            <input
                                                key={`jk-l-${student.id}`}
                                                type="radio"
                                                name="jenis_kelamin"
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
                                            <span>L</span>
                                        </label>
                                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                                            <input
                                                key={`jk-p-${student.id}`}
                                                type="radio"
                                                name="jenis_kelamin"
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
                                            <span>P</span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="text-sm font-medium text-gray-800">
                                        {student.jenis_kelamin}
                                    </div>
                                )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                {editingId === student.id ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            iconLeft={<X className="w-4 h-4" />}
                                        />
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={(e) =>
                                                handleUpdate(e, student.id)
                                            }
                                            iconLeft={
                                                <Save className="w-4 h-4" />
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleEditClick(student)
                                            }
                                            iconLeft={
                                                <PenLine className="h-4 w-4" />
                                            }
                                        />

                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={(e) =>
                                                handleDelete(e, student.id)
                                            }
                                            iconLeft={
                                                <Trash2 className="h-4 w-4" />
                                            }
                                        />
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowSiswaTable;

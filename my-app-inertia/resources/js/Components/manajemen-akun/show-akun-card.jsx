import { LockKeyholeOpen, Mail, PenLine, Trash2 } from "lucide-react";
import React from "react";
import Button from "@/Components/ui/button";

const ShowAkunCard = ({
    users,
    type,
    onApprove,
    onReject,
    isProcessing,
    onOpenResetPasswordModal,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {users.map((user, index) => (
                <div
                    key={user.id}
                    className="space-y-3 border rounded-xl border-slate-300"
                >
                    <div className="p-4 flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <p className="text-sm font-medium text-gray-800">
                                {index + 1}.
                            </p>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-gray-800">
                                    {user.name}
                                </p>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <Mail className="w-5 h-5" />

                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="font-normal">
                                            Email
                                        </span>
                                        {user.email}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-800">
                                    <LockKeyholeOpen className="w-5 h-5" />
                                    <div className="flex flex-col text-sm font-medium">
                                        <span className="text-xs font-normal">
                                            Role:{" "}
                                        </span>
                                        {user.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 border-t rounded-b-xl border-slate-300 bg-gray-100">
                        <div className="flex justify-end gap-2">
                            {type === "pending" && (
                                <>
                                    <Button
                                        size="md"
                                        variant="danger"
                                        onClick={() => onReject(user.id)}
                                        disabled={isProcessing}
                                    >
                                        Tolak
                                    </Button>
                                    <Button
                                        size="md"
                                        variant="success"
                                        onClick={() => onApprove(user.id)}
                                        disabled={isProcessing}
                                    >
                                        Setujui
                                    </Button>
                                </>
                            )}
                            {type === "approved" && (
                                <>
                                    <Button
                                        size="md"
                                        variant="outline"
                                        onClick={() =>
                                            onOpenResetPasswordModal(user)
                                        }
                                        disabled={isProcessing}
                                        iconLeft={
                                            <PenLine className="h-4 w-4" />
                                        }
                                    />
                                    <Button
                                        size="md"
                                        variant="danger"
                                        onClick={() => onReject(user.id)}
                                        disabled={isProcessing}
                                        iconLeft={
                                            <Trash2 className="h-4 w-4" />
                                        }
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShowAkunCard;

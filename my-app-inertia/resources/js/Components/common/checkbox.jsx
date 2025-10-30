const CheckboxItem = ({ id, label, checked, onChange }) => (
    <label className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-0"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

export default CheckboxItem;

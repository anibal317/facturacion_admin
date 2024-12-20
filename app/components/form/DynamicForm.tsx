// components/DynamicForm.tsx
import React, { useState, useEffect } from 'react';

interface DynamicFormProps {
  data: any;
  onSave: (updatedData: any) => void;
  onCancel: () => void;
  disabledFields?: string[]; // Nueva prop para campos deshabilitados
}

const DynamicForm: React.FC<DynamicFormProps> = ({ data, onSave, onCancel, disabledFields = [] }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === 'true' ? true : value === 'false' ? false : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {Object.keys(data).map((key) => (
        <div key={key}>
          <label htmlFor={key} className="block font-medium text-gray-700 text-sm">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          {typeof data[key] === 'boolean' ? (
            <select
              name={key}
              id={key}
              value={formData[key] ? 'true' : 'false'}
              onChange={handleChange}
              disabled={disabledFields.includes(key)} // Deshabilita el campo si está en disabledFields
              className="block border-gray-300 focus:ring-opacity-50 shadow-sm mt-1 border rounded-md focus:ring w-full"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : (
            <input
              type={typeof data[key] === 'number' ? 'number' : 'text'}
              name={key}
              id={key}
              value={formData[key] || ''}
              onChange={handleChange}
              disabled={disabledFields.includes(key)} // Deshabilita el campo si está en disabledFields
              className="block border-gray-300 focus:ring-opacity-50 shadow-sm mt-1 border rounded-md focus:ring w-full"
              required={key === 'name'} // Por ejemplo, hacer que el campo 'name' sea obligatorio
            />
          )}
        </div>
      ))}
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded font-bold text-white">
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-bold text-white">
          Save
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
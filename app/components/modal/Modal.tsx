import React, { useEffect, useState } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import Button from '@mui/material/Button';
import DynamicForm from '../form/DynamicForm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  onSave: (data: any) => void; // Cambia la firma para recibir datos
  onDelete: () => void;
  title: string;
  content: any; // Cambia a 'any' para que sea más flexible
  showButtons?: boolean;
  mode: 'edit' | 'delete' | 'view' | 'add';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onAdd, onClose, onSave, onDelete, title, content, showButtons = false, mode }) => {
  const [formData, setFormData] = useState<any>(content); // Estado para almacenar los datos del formulario

  useEffect(() => {
    setFormData(content); // Actualiza el estado del formulario cuando el contenido cambia
  }, [content]);

  if (!isOpen) return null;

  const handleSave = () => {
    console.log(formData); // Aquí se imprimen los datos del formulario
    onSave(formData); // Llama a onSave con los datos del formulario
    onClose(); // Cierra el modal
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white shadow-xl mx-4 rounded-lg w-full max-w-lg text-black">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="font-semibold text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {mode === 'add' || mode === 'edit' ? (
            <DynamicForm
              data={formData} // Pasa el estado del formulario
              onSave={(updatedData) => setFormData(updatedData)} // Actualiza el estado con los datos guardados
              disabledFields={['id']}
              hide={['planfeature']}
            />
          ) : (
            content
          )}
        </div>
        {showButtons && (
          <div className="flex justify-end space-x-4 p-6 border-t">
            {(mode === 'edit' || mode === 'add') && (
              <Button onClick={handleSave} color="success" className='flex items-center gap-2'>
                <Save /> Save
              </Button>
            )}
            {mode === 'delete' && (
              <Button onClick={onDelete} color="error" className='flex items-center gap-2'>
                <Trash2 /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Modal;
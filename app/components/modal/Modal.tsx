import React, { useEffect, useState } from 'react';
import { Save, Trash2, X } from 'lucide-react';
import Button from '@mui/material/Button';
import DynamicForm from '../form/DynamicForm';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  onSave: (data: any) => void; // Cambia la firma para recibir datos
  onDelete: () => void;
  title: string;
  content: any; // Cambia a 'any' para que sea más flexible
  showButtons?: boolean;
  mode: 'edit' | 'delete' | 'view' | 'add';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onAdd, onClose, onSave, onDelete, title, content, showButtons = false, mode }) => {
  const [formData, setFormData] = useState<any>(content); // Estado para almacenar los datos del formulario
  const [originalData, setOriginalData] = useState<any>(content); // Estado para los datos originales

  useEffect(() => {
    setOriginalData(content); // Actualiza los datos originales al abrir el modal
    setFormData(content); // Sincroniza los datos del formulario
  }, [content]);

  if (!isOpen) return null;


  const handleSave = () => {
    if (mode === 'add') {
      onAdd(formData)
    } else {
      onSave(formData)
    };
    onClose(); // Cierra el modal
  };

  const handleCancel = () => {
    setFormData(originalData); // Restaura los datos originales
    onClose(); // Cierra el modal
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white shadow-xl mx-4 rounded-lg w-full max-w-lg text-black">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="font-semibold text-xl">{title}</h3>
          <button
            onClick={handleCancel}
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
            <Button onClick={handleCancel} color="inherit" className="flex items-center gap-2">
              Cancel
            </Button>
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
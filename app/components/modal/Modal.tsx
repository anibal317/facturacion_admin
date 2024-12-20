import React from 'react';
import { Save, Trash2, X } from 'lucide-react';
import Button from '@mui/material/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  onSave: () => void;
  onDelete: () => void;
  title: string;
  content: React.ReactNode; // Cambia a React.ReactNode para aceptar JSX
  showButtons?: boolean;
  mode: 'edit' | 'delete' | 'view' | 'add';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onAdd, onClose, onSave, onDelete, title, content, showButtons = false, mode }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    onSave();
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleAdd = () => {
    onAdd();
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
          {content} {/* Renderiza el contenido directamente */}
        </div>
        {showButtons && (
          <div className="flex justify-end space-x-4 p-6 border-t">
            {mode === 'edit' ? (
              <Button onClick={handleSave} color="success" className='flex items-center gap-2'>
                <Save /> Save
              </Button>
            ) : mode === 'add' ? (
              <Button onClick={handleAdd} color="success" className='flex items-center gap-2'>
                <Save /> Save
              </Button>
            ) : mode === 'delete' ? (
              <Button onClick={handleDelete} color="error" className='flex items-center gap-2'>
                <Trash2 /> Delete
              </Button>
            ) : (
              <Button onClick={onClose} color="primary" className='flex items-center gap-2'>
                Close
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
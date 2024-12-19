// components/DataTable.tsx
'use client';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
} from '@mui/material';
import { ToggleRight, ToggleLeft, Eye, Edit, Trash2 } from 'lucide-react';
import { User } from '@/types/types'; // Asegúrate de que la ruta sea correcta
import Modal from "@/app/components/modal/Modal";

interface DataTableProps {
  initialData: User[];
  onDataChange: (data: User[]) => void; // Callback para manejar cambios en los datos
}

const DataTable: React.FC<DataTableProps> = ({ initialData, onDataChange }) => {
  const [data, setData] = useState<User[]>(initialData);
  const [recordsToShow, setRecordsToShow] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleToggleActive = (index: number) => {
    const updatedData = data.map((item, i) => (i === index ? { ...item, active: !item.active } : item));
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setOpenEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setOpenDeleteModal(true);
  };

  const handleViewUser = (user: User) => {
    setCurrentUser(user);
    setOpenViewModal(true);
  };

  const handleSaveEdit = (user: User) => {
    const updatedData = data.map((item) => (item.id === user.id ? user : item));
    setData(updatedData);
    onDataChange(updatedData);
    setOpenEditModal(false);
    setCurrentUser(null);
  };

  const handleConfirmDelete = (user: User) => {
    const updatedData = data.filter((item) => item.id !== user.id);
    setData(updatedData);
    onDataChange(updatedData);
    setOpenDeleteModal(false);
    setCurrentUser(null);
  };

  const totalPages = Math.ceil(data.length / recordsToShow);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * recordsToShow;
  const endIndex = startIndex + recordsToShow;
  const currentData = data.slice(startIndex, endIndex);
  const headers = Object.keys(data[0] || {});

  return (
    <div>
      <FormControl variant="outlined" style={{ marginBottom: '16px' }}>
        <InputLabel>Cantidad de registros</InputLabel>
        <Select
          value={recordsToShow}
          onChange={(e) => {
            setRecordsToShow(Number(e.target.value));
            setCurrentPage(1);
          }}
          label="Cantidad de registros"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={data.length}>Todos</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row, index) => (
              <TableRow key={row.id}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    {header === 'active' ? (row[header] ? 'Active' : 'Inactive') : row[header]}
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleEditUser(row)}><Edit /></Button>
                  <Button onClick={() => handleDeleteUser(row)}><Trash2 className='text-red-600' /></Button>
                  <Button onClick={() => handleViewUser(row)}><Eye /></Button>
                  <Button onClick={() => handleToggleActive(startIndex + index)}>
                    {row.active ? <ToggleLeft className='text-green-600' /> : <ToggleRight className='text-red-600' />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
      />

      <Modal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title="Editar usuario"
        content={"contenido"}
        showButtons={true}
        mode="edit"
      />
      <Modal
        isOpen={openViewModal}
        onClose={() => setOpenViewModal(false)}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title="Ver usuario"
        content={"contenido"}
        showButtons={true}
        mode="view"
      />
      <Modal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title="Eliminar usuario"
        content={"contenido"}
        showButtons={true}
        mode="delete"
      />

    </div>
  );
};

export default DataTable;
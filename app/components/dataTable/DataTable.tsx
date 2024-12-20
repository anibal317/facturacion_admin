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
import { ToggleRight, ToggleLeft, Eye, Edit, Trash2, Plus } from 'lucide-react';
import Modal from "../modal/Modal";
import DynamicForm from "../form/DynamicForm";
import * as LucideIcons from 'lucide-react';
interface DataTableProps {
  initialData: any[];
  sectionTitle: string;
}

const DataTable: React.FC<DataTableProps> = ({ initialData, sectionTitle }) => {
  const [recordsToShow, setRecordsToShow] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [data, setCurrentData] = useState<any | null>([]);


  const handleToggleActive = (index: number) => {
    console.log(index);
  };

  const handleAddUser = () => {
    // Inicializa un objeto vacío o con valores predeterminados para el nuevo registro
    // setCurrentData({ id: '', name: '', img: '', link: '', active: true, ordering: 1 });
    setCurrentData({ ...headers.reduce((acc, key) => ({ ...acc, [key]: '' }), {}), ordering: 1 });
    setOpenAddModal(true);
  };

  const handleEditUser = (userData: any) => {
    setCurrentData(userData); // Establece los datos del usuario en el estado
    setOpenEditModal(true);
  };

  const handleDeleteUser = (data: any) => {
    setCurrentData(data);
    setOpenDeleteModal(true);
  };

  const handleViewUser = (data: any) => {
    setCurrentData(data);
    setOpenViewModal(true);
  };

  const handleSaveEdit = (editedData: any) => {
    const updatedData = initialData.map((item: any) => (item.id === editedData.id ? editedData : item));
    setCurrentData(updatedData);
    setOpenEditModal(false);
  };


  const handleConfirmDelete = (userData: any) => {
    const updatedData = initialData.filter((item: any) => item.id !== userData.id);
    setCurrentData(updatedData); // Actualiza el estado con los datos restantes
    setOpenDeleteModal(false);
  };

  const isLucideIcon = (icon: any): icon is React.ComponentType<React.SVGProps<SVGSVGElement>> => {
    return typeof icon === 'function' || (typeof icon === 'object' && icon.$$typeof);
  };

  type LucideIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type LucideIconsType = Record<string, LucideIconComponent>;
  const SafeLucideIcons = LucideIcons as unknown as LucideIconsType;

  const totalPages = Math.ceil(initialData.length / recordsToShow);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * recordsToShow;
  const endIndex = startIndex + recordsToShow;
  const currentData = initialData.slice(startIndex, endIndex);
  const headers = Object.keys(initialData[0] || {});

  const renderContent = (content: any, action: string, disabledFields?: string[]) => {

    return (<>
      {action === 'view' ? (
        <div className="flex flex-col items-center">
          {content.img && (
            <img
              src={'https://facturacionale.netlify.app' + content.img}
              alt={content.name}
              className="border-2 border-gray-600 mb-4 p-1 w-[50%] h-auto object-cover"
            />
          )}
          {Object.keys(content).map((key) => {
            if (key === 'icon' && typeof content[key] === 'string') {
              const iconName = content[key];
              return (
                <div key={key} className="text-gray-600">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  {iconName in SafeLucideIcons &&
                    isLucideIcon(SafeLucideIcons[iconName]) ? (
                    React.createElement(SafeLucideIcons[iconName])
                  ) : (
                    <span>Icon not found</span>
                  )}
                </div>
              );
            }
            return (
              <div key={key} className="text-gray-600">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                {typeof content[key] === 'boolean'
                  ? content[key] ? 'true' : 'false'
                  : content[key]}
              </div>
            );
          })}
          {content.link && (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-blue-500 hover:underline"
            >
              Visit Website
            </a>
          )}
        </div>
      ) : action === "add" ? (<>
        <DynamicForm data={content} onSave={handleSaveEdit} onCancel={() => setOpenEditModal(false)} disabledFields={disabledFields} />
      </>) : action === "edit" ? (<>
        <DynamicForm data={content} onSave={handleSaveEdit} onCancel={() => setOpenEditModal(false)} disabledFields={disabledFields} />
      </>) : <>Otro</>}

    </>
    )
  }

  return (
    <div >
      <div className='flex items-center gap-2 mb-4'>
        <FormControl variant="outlined" className='mb-4 w-1/12'>
          <InputLabel>Cantidad</InputLabel>
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
            <MenuItem value={initialData.length}>Todos</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <Button onClick={() => handleAddUser()} className='flex items-center' variant="contained" color="primary">
            <Plus /> Agregar
          </Button>
        </FormControl>
      </div>
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
                    {header === 'icon' && typeof row[header] === 'string' && row[header] in SafeLucideIcons ? (
                      <div className="relative group">
                        {React.createElement(SafeLucideIcons[row[header]], { className: 'w-8 h-8' })}
                        <div className="group-hover:block top-10 left-1/2 z-10 absolute border-gray-300 hidden bg-white shadow-lg p-2 border rounded transform -translate-x-1/2">
                          {React.createElement(SafeLucideIcons[row[header]], { className: 'w-16 h-16' })}
                        </div>
                      </div>
                    ) : header === 'img' && row[header] ? (
                      <div className="relative group">
                        <img
                          src={'https://facturacionale.netlify.app' + row[header]}
                          alt={row.name || 'Image'}
                          className="rounded w-14 h-auto object-cover"
                        />
                        <div className="group-hover:block -top-20 -left-10 z-50 absolute hidden mt-2 transform -translate-x-1/2">
                          <img
                            src={'https://facturacionale.netlify.app' + row[header]}
                            alt={row.name || 'Image'}
                            className="shadow-lg rounded min-w-52 h-auto object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      header === 'active'
                        ? row[header] ? 'Active' : 'Inactive'
                        : row[header]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleEditUser(row)}><Edit /></Button>
                  <Button onClick={() => handleDeleteUser(row)}><Trash2 className='text-red-600' /></Button>
                  <Button onClick={() => handleViewUser(row)}><Eye /></Button>
                  <Button onClick={() => handleToggleActive(row)}>
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
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={() => handleAddUser}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title={`Agregar ${sectionTitle}`}
        content={data ? renderContent(data, 'add') : "No hay datos para mostrar."}
        showButtons={true}
        mode="add"
      />
      <Modal
        isOpen={openEditModal}
        onAdd={() => handleAddUser}
        onClose={() => setOpenEditModal(false)}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title={`Editar ${sectionTitle}`}
        content={data ? renderContent(data, 'edit', ['id']) : "No hay datos para mostrar."}
        showButtons={true}
        mode="edit"
      />

      <Modal
        isOpen={openViewModal}
        onAdd={() => handleAddUser}
        onClose={() => setOpenViewModal(false)}
        onSave={() => handleSaveEdit(data)} // Asegúrate de pasar los datos correctos
        onDelete={() => handleConfirmDelete(data)} // Asegúrate de pasar los datos correctos
        title={`Ver ${sectionTitle}`}
        content={data ? renderContent(data, 'view') : "No hay datos para mostrar."} // Manejo de datos nulos
        showButtons={true} // Tal vez no necesites botones en el modo de vista
        mode="view"
      />

      <Modal
        isOpen={openDeleteModal}
        onAdd={() => handleAddUser}
        onClose={() => setOpenDeleteModal(false)}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title={`Eliminar ${sectionTitle}`}
        content={
          <>
            ¿Estás seguro de que deseas eliminar este cliente <strong>{data.name}</strong>?
          </>
        }
        showButtons={true}
        mode="delete"
      />

    </div>
  );
};

export default DataTable;
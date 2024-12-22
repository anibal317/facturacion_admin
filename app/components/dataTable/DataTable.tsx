// components/DataTable.tsx
'use client';
import React, { useState, useMemo } from 'react';
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
import { ToggleRight, ToggleLeft, Eye, Edit, Trash2, Plus, Info } from 'lucide-react';
import Modal from "../modal/Modal";
import DynamicForm from "../form/DynamicForm";
import * as LucideIcons from 'lucide-react';

interface DataTableProps {
  initialData: any[];
  sectionTitle: string;
  excludedHeaders?: string[]
}

interface FlexibleObject {
  [key: string]: any;
}


const DataTable: React.FC<DataTableProps> = ({ initialData, sectionTitle, excludedHeaders = [] }) => {
  const [recordsToShow, setRecordsToShow] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openPlanModal, setOpenPlanModal] = useState<boolean>(false);
  const [data, setCurrentData] = useState<any | null>([]);
  const [openFeaturesModal, setOpenFeaturesModal] = useState<boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = useState<FlexibleObject[] | null>(null);
  const [selectedPlan, setSelectedPlans] = useState<FlexibleObject[] | null>(null);

  const handleShowFeatures = (features: FlexibleObject[] | FlexibleObject) => {
    const featureArray = Array.isArray(features) ? features : [features];
    setSelectedFeatures(featureArray);
    setOpenFeaturesModal(true);
  };
  const handleShowPlans = (plan: FlexibleObject[] | FlexibleObject) => {
    const planArray = Array.isArray(plan) ? plan : [plan];
    setSelectedPlans(planArray);
    setOpenPlanModal(true);
  };

  const headers = useMemo(() => {
    if (initialData.length === 0) return [];

    const firstItem = initialData[0];
    const keys = Object.keys(firstItem);

    return keys.filter(key => !excludedHeaders.includes(key));
  }, [initialData]);

  const handleToggleActive = (index: number) => {
    console.log(index);
  };

  const handleAdd = () => {
    // Inicializa un objeto vacío o con valores predeterminados para el nuevo registro
    // setCurrentData({ id: '', name: '', img: '', link: '', active: true, ordering: 1 });
    setCurrentData({ ...headers.reduce((acc, key) => ({ ...acc, [key]: '' }), {}), ordering: 1 });
    setOpenAddModal(true);
  };

  const handleEdit = (userData: any) => {
    setCurrentData(userData); // Establece los datos del usuario en el estado
    setOpenEditModal(true);
  };

  const handleDelete = (data: any) => {
    setCurrentData(data);
    setOpenDeleteModal(true);
  };

  const handleView = (data: any) => {
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
 
  const renderContent = (content: any, action: string, disabledFields?: string[]) => {
    const handleShowDetailedInfo = (key: string, value: any) => {
      setSelectedFeatures([{ key, value }]);
      setOpenFeaturesModal(true);
    };

    return (
      <>
        {action === 'view' ? (
          <div className="flex flex-col space-y-2">
            {Object.keys(content).map((key) => {
              const value = content[key];

              // Omitir campos definidos en excludedHeaders o valores nulos/vacíos
              if (excludedHeaders.includes(key) || value == null || value === '') {
                return (
                  <div key={key} className="text-gray-600">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                    <span className="ml-2">N/A</span>
                  </div>
                );
              }

              return (
                <div key={key} className="flex justify-between items-center text-gray-600">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <span>
                    {typeof value === 'object' ? (
                      <span
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() => handleShowDetailedInfo(key, value)}
                      >
                        (Ver Detalle)
                      </span>
                    ) : (
                      value.toString()
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ) : action === 'add' || action === 'edit' ? (
          <DynamicForm
            data={content}
            onSave={handleSaveEdit}
            onCancel={() => setOpenEditModal(false)}
            disabledFields={disabledFields}
          />
        ) : (
          <>Otro</>
        )}
      </>
    );
  };



  const renderFeatureContent = (features: FlexibleObject[] | null) => {
    if (!features) return null;
    return (
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            {feature.isPremium !== undefined && (
              <span className={feature.isPremium ? "text-green-500" : "text-red-500"}>
                {feature.isPremium ? "✓" : "✗"}
              </span>
            )}
            <span>{feature.text || ''}</span>
            {feature.hasInfo && (
              <span className="text-blue-500 text-sm">(Additional info available)</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPlan = (plan: FlexibleObject[] | null) => {
    if (!plan) return null;
    return (
      <div className="space-y-2">
        {plan.map((item, index) => (
          <div key={item.id} className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="font-semibold">{item.title}</h3>
            <h4 className="font-semibold">{item.subtitle}</h4>
            <p><strong>ID del Plan:</strong> {item.id}</p>
            <p><strong>Precio Original:</strong> ${item.originalPrice}</p>
            <p><strong>Precio de Descuento:</strong> ${item.discountPrice || 0}</p>
            <p><strong>Meses gratis?:</strong> {item.freeMonth || 'No'}</p>
            <p><strong>Es recomendado:</strong> ${item.isRecommended}</p>
            <p><strong>Puntos de Compra:</strong> {item.purchasePoints}</p>
            <p><strong>Activo:</strong> {item.active ? 'Sí' : 'No'}</p>
            <p><strong>Ubicación:</strong> {item.ordering}</p>
          </div>
        ))}
      </div>
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
          <Button onClick={() => handleAdd()} className='flex items-center' variant="contained" color="primary">
            <Plus /> Agregar
          </Button>
        </FormControl>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header: any) => (
                <TableCell key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((item: FlexibleObject, index) => (
              <TableRow key={index} className='hover:bg-gray-100'>
                {headers.map((header: any) => (
                  <TableCell key={header}>
                    {typeof item[header] === 'boolean' ? (item[header] ? 'Yes' : 'No') : String(item[header] || '')}
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleEdit(item)}><Edit /></Button>
                  <Button onClick={() => handleDelete(item)}><Trash2 className='text-red-600' /></Button>
                  <Button onClick={() => handleView(item)}><Eye /></Button>
                  {item.active !== undefined && (
                    <Button onClick={() => handleToggleActive(item.id)}>
                      {item.active ? <ToggleLeft className='text-green-600' /> : <ToggleRight className='text-red-600' />}
                    </Button>
                  )}
                  {item.planfeature && (
                    <Button onClick={() => handleShowFeatures(item.planfeature)}>
                      <Info />
                    </Button>
                  )}
                  {item.plan && (
                    <Button onClick={() => handleShowPlans(item.plan)}>
                      <Info />
                    </Button>
                  )}
                  {item.plan && (
                    <Button onClick={() => handleShowPlans(item.plan)}>
                      <Info />
                    </Button>
                  )}
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
        onAdd={() => handleAdd}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title={`Agregar ${sectionTitle}`}
        content={data ? renderContent(data, 'add') : "No hay datos para mostrar."}
        showButtons={true}
        mode="add"
      />
      <Modal
        isOpen={openEditModal}
        onAdd={() => handleAdd}
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
        onAdd={() => handleAdd}
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
        onAdd={() => handleAdd}
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
      <Modal
        isOpen={openFeaturesModal}
        onClose={() => setOpenFeaturesModal(false)}
        onAdd={() => { }}
        onSave={() => { }}
        onDelete={() => { }}
        title="Features"
        content={renderFeatureContent(selectedFeatures)}
        showButtons={true}
        mode="view"
      />
      <Modal
        isOpen={openPlanModal}
        onClose={() => setOpenPlanModal(false)}
        onAdd={() => { }}
        onSave={() => { }}
        onDelete={() => { }}
        title="Features"
        content={renderPlan(selectedPlan)}
        showButtons={true}
        mode="view"
      />
    </div>
  );
};

export default DataTable;
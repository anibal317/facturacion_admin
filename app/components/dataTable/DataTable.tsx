// components/DataTable.tsx
'use client';
import React, { useState, useMemo, useEffect } from 'react';
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
  TextField,
} from '@mui/material';
import { ToggleRight, ToggleLeft, Eye, Edit, Trash2, Plus, Info, Search, FilterX } from 'lucide-react';
import Modal from "../modal/Modal";
import * as LucideIcons from 'lucide-react';
import Swal from 'sweetalert2'

interface DataTableProps {
  initialData: any[];
  sectionTitle: string;
  endpoint?: string;
  excludedHeaders?: string[]
}

interface FlexibleObject {
  [key: string]: any;
}


const DataTable: React.FC<DataTableProps> = ({ initialData, sectionTitle, excludedHeaders = [], endpoint }) => {
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
  const [filterValue, setFilterValue] = useState<string>(''); // Valor a filtrar
  const [filteredData, setFilteredData] = useState(initialData); // Datos filtrados
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete' | 'view'>('add');

  if (!Array.isArray(initialData)) {
    console.error("initialData debe ser un array.");
    return null;
  }


  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

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
  }, [initialData, excludedHeaders]);

  const [selectedColumn, setSelectedColumn] = useState<string>(headers[0] || ''); // Columna seleccionada

  const handleFilter = () => {
    if (selectedColumn && filterValue) {
      const filtered = initialData.filter(item =>
        String(item[selectedColumn]).toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reinicia la paginación al filtrar
    } else {
      setFilteredData(initialData); // Restaura los datos originales si no hay filtro
    }
  };
  const handleResetFilter = () => {
    setFilterValue(''); // Restablece el valor del filtro
    setFilteredData(initialData); // Restaura los datos filtrados a los datos originales
    setCurrentPage(1); // Reinicia la paginación
  };

  const handleToggleActive = async (index: number) => {
    const idABuscar = index;

    for (let i = 0; i < currentData.length; i++) {
      if (currentData[i].id === idABuscar) {
        // Almacena el estado anterior
        const previousActiveState = currentData[i].active;

        // Cambia el estado de 'active'
        currentData[i].active = !currentData[i].active;

        // Muestra el spinner de carga
        Swal.fire({
          title: 'Cargando...',
          html: 'Por favor, espera mientras se actualiza el estado.',
          allowOutsideClick: false,
        });

        // Muestra el loading spinner
        Swal.showLoading();

        try {
          let res;
          if (!currentData[i].active) {
            res = await fetch(`/api/${endpoint}?id=${index}`, { method: "DELETE" });
          } else {
            res = await fetch(`/api/${endpoint}?id=${index}`, { method: "PATCH" });
          }

          if (!res.ok) {
            // Si la respuesta no es ok, lanza un error
            const errorData = await res.json(); // Puedes obtener más información del error
            throw new Error(errorData.message || 'Error desconocido');
          }

          // Cierra el spinner de carga
          Swal.close();

          Swal.fire({
            title: 'OK',
            text: 'El beneficio fue actualizado correctamente',
            icon: 'success',
          });
        } catch (error: any) {
          console.error(error);
          // Revertir el estado al anterior en caso de error
          currentData[i].active = previousActiveState;

          // Cierra el spinner de carga
          Swal.close();

          Swal.fire({
            title: 'Error!',
            text: error.message || 'Hubo un error al cambiar el estado del beneficio',
            icon: 'error',
          });
        }

        // Actualiza el estado de currentData
        setCurrentData([...currentData]); // Asegúrate de crear una nueva referencia para que React detecte el cambio
        break; // Salimos del bucle una vez que encontramos el elemento
      }
    }
  };

  const handleAdd = () => {
    // Inicializa un objeto vacío o con valores predeterminados para el nuevo registro
    // setCurrentData({ id: '', name: '', img: '', link: '', active: true, ordering: 1 });
    setCurrentData({ ...headers.reduce((acc, key) => ({ ...acc, [key]: '' }), {}), ordering: 1 });
    setOpenAddModal(true);
  };

  const handleSaveAdd = async (newData: any) => {
    // Muestra el spinner de carga
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor, espera mientras se agrega el nuevo registro.',
      allowOutsideClick: false,
    });
    Swal.showLoading();
  
    try {
      // Asegúrate de que active sea un booleano y ordering sea un número
      const formattedData = {
        ...newData,
        active: Boolean(newData.active), // Convierte a booleano
        ordering: Number(newData.ordering), // Convierte a número
      };
  
      // Realiza la llamada a la API para agregar el nuevo registro
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST', // Asegúrate de que este sea el método correcto
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData), // Envía los datos del nuevo registro
      });
  
      if (!res.ok) {
        // Si la respuesta no es ok, lanza un error
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData.error) || 'Error desconocido');
      }
  
      const addedRecord = await res.json(); // Obtén los datos del nuevo registro
  
      // Actualiza el estado de los datos filtrados
      setFilteredData((prevData) => {
        if (!Array.isArray(prevData)) {
          console.error("prevData no es un array");
          return [addedRecord]; // Retorna un nuevo array con el nuevo registro
        }
        return [...prevData, addedRecord]; // Agrega el nuevo registro a los datos filtrados
      });
  
      // Actualiza el estado de currentData
      setCurrentData((prevData:any) => {
        if (!Array.isArray(prevData)) {
          console.error("prevData no es un array");
          return [addedRecord]; // Retorna un nuevo array con el nuevo registro
        }
        return [...prevData, addedRecord]; // Agrega el nuevo registro a currentData
      });
  
      // Cierra el modal de agregar
      setOpenAddModal(false);
  
      // Cierra el spinner de carga
      Swal.close();
  
      // Muestra un mensaje de éxito
      Swal.fire({
        title: 'Éxito!',
        text: 'El nuevo registro se ha agregado correctamente.',
        icon: 'success',
      });
    } catch (error: any) {
      console.error(error);
  
      // Cierra el spinner de carga
      Swal.close();
  
      // Construye un mensaje de error si hay un array de errores
      let errorMessage = 'Hubo un error al agregar el nuevo registro.';
      if (error.message) {
        try {
          const errorArray = JSON.parse(error.message);
          if (Array.isArray(errorArray)) {
            // Muestra cada mensaje de error en una nueva línea
            errorMessage = errorArray.map(err => `${err.message} (Path: ${err.path.join(' -> ')})`).join('\n');
          }
        } catch (e) {
          // Si no se puede parsear, manten el mensaje original
        }
      }
  
      // Muestra un mensaje de error
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
   icon: 'error',
      });
    }
  };;

  const handleEdit = (userData: any) => {
    setCurrentData(userData); // Establece los datos del usuario en el estado
    setModalMode('edit'); // Establece el modo de edición
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

  const handleSaveEdit = async (editedData: any) => {
    // Muestra el spinner de carga
    Swal.fire({
      title: 'Cargando...',
      html: 'Por favor, espera mientras se actualizan los datos.',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    try {
      // Realiza la llamada a la API para actualizar los datos
      const res = await fetch(`/api/${endpoint}`, {
        method: 'PUT', // Asegúrate de que este sea el método correcto
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData), // Envía los datos editados
      });

      if (!res.ok) {
        // Si la respuesta no es ok, lanza un error
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error desconocido');
      }

      const updatedUser = await res.json(); // Obtén los datos actualizados

      // Actualiza el estado de los datos filtrados
      const updatedData = filteredData.map((item) =>
        item.id === updatedUser.id ? updatedUser : item
      );

      setFilteredData(updatedData); // Actualiza los datos filtrados
      setCurrentData(updatedData); // Sincroniza el estado principal

      // Cierra el modal de edición
      setOpenEditModal(false);

      // Cierra el spinner de carga
      Swal.close();

      // Muestra un mensaje de éxito
      Swal.fire({
        title: 'Éxito!',
        text: 'Los datos del usuario se han actualizado correctamente.',
        icon: 'success',
      });
    } catch (error: any) {
      console.error(error);

      // Cierra el spinner de carga
      Swal.close();

      // Muestra un mensaje de error
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Hubo un error al actualizar los datos del usuario.',
        icon: 'error',
      });
    }
  };

  const handleConfirmDelete = (userData: any) => {
    const updatedData = initialData.filter((item: any) => item.id !== userData.id);
    setCurrentData(updatedData); // Actualiza el estado con los datos restantes
    setOpenDeleteModal(false);
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
  // const currentData = initialData.slice(startIndex, endIndex);
  const currentData = filteredData.slice(startIndex, endIndex);

  const renderContent = (content: any, action: string, disabledFields?: string[]) => {
    const handleShowDetailedInfo = (key: string, value: any) => {
      setSelectedFeatures([{ key, value }]);
      setOpenFeaturesModal(true);
    };
    return (
      <>
        {action === 'view' ? (
          <div className="flex flex-col space-y-2">
            {/* Mostrar imagen si es cliente y existe el campo img */}
            {endpoint === 'clients' && content.img && (
              <div className="flex justify-center mb-4">
                <img
                  src={`https://bolivarsoftware.com${content.img}`}
                  alt={content.name || 'Imagen'}
                  style={{ maxWidth: 120, maxHeight: 120, borderRadius: 12, boxShadow: "0 2px 8px #0002" }}
                />
              </div>
            )}
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
        <div className="flex items-center gap-4 mb-4">
          <FormControl variant="outlined" className="w-1/4">
            <InputLabel>Columna</InputLabel>
            <Select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              label="Columna"
            >
              {headers.map((header) => (
                <MenuItem key={header} value={header}>
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            className="w-1/4"
            label="Valor"
            variant="outlined"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleFilter}>
            <Search />
            Filtrar
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResetFilter}>
            <FilterX />
            Restablecer Filtro
          </Button>
        </div>
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
        onAdd={handleSaveAdd}
        onSave={() => handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title={`Agregar ${sectionTitle}`}
        content={data}
        showButtons={true}
        mode="add"
      />

      <Modal
        isOpen={openEditModal}
        onAdd={handleAdd}
        onClose={() => setOpenEditModal(false)}
        onSave={handleSaveEdit}
        onDelete={() => handleConfirmDelete}
        title={`Editar ${sectionTitle}`}
        content={data}
        showButtons={true}
        mode={modalMode}
      />

      <Modal
        isOpen={openViewModal}
        onAdd={() => handleAdd}
        onClose={() => setOpenViewModal(false)}
        onSave={() => handleSaveEdit} // Asegúrate de pasar los datos correctos
        onDelete={() => handleConfirmDelete(data)} // Asegúrate de pasar los datos correctos
        title={
          endpoint === 'clients' && data && data.name
            ? `Ver ${sectionTitle}: ${data.name}`
            : `Ver ${sectionTitle}`
        }
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
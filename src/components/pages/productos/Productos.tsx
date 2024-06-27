import { useEffect, useState } from 'react';

import TablaProductos from '../../element/tabla/TablaProductos';
import { Empresas, getEmpresas } from '../../../service/ServiceEmpresa';
import { Sucursal, getSucursal } from '../../../service/ServiceSucursal';

import { Button, Select } from 'antd';

import FormularioProducto from '../../element/formularios/FormularioProducto';

const { Option } = Select;

export default function Productos() {
  const [showFormularioProducto, setShowFormularioProducto] = useState(false);
  const [empresas, setEmpresas] = useState<Empresas[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [selectedSucursal, setSelectedSucursal] = useState('');

  useEffect(() => {
    const fetchEmpresas = async () => {
      const empresasData = await getEmpresas();
      setEmpresas(empresasData);
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    const fetchSucursales = async () => {
      if (selectedEmpresa) {
        const sucursalesData = await getSucursal(selectedEmpresa);
        setSucursales(sucursalesData);
      }
    };

    fetchSucursales();
  }, [selectedEmpresa]);

  const handleOpenFormularioProducto = () => {
    setShowFormularioProducto(true);
  };

  const closeFormularioProducto = () => {
    setShowFormularioProducto(false);
  };

  const handleFormSubmit = (values: any) => {
    // Implementa la lógica para manejar el envío del formulario
    console.log(values);
    closeFormularioProducto();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <h1>Productos</h1>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: '20px', margin: '10px 0' }}>
          <Select
            placeholder="Seleccione una empresa"
            style={{ width: 200 }}
            onChange={(value) => setSelectedEmpresa(value)}
          >
            {empresas.map((empresa) => (
              <Option key={empresa.id} value={empresa.id}>{empresa.nombre}</Option>
            ))}
          </Select>
          <Select
            placeholder="Seleccione una sucursal"
            style={{ width: 200 }}
            disabled={!selectedEmpresa}
            onChange={(value) => setSelectedSucursal(value)}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</Option>
            ))}
          </Select>
        </div>

        {selectedEmpresa && selectedSucursal && (
          <Button type="primary" onClick={handleOpenFormularioProducto}>
            Agregar Producto
          </Button>
        )}
      </div>
     
        <FormularioProducto
          visible={showFormularioProducto}
          onClose={closeFormularioProducto}
          onSubmit={handleFormSubmit}
          initialValues={null}
          sucursalId={selectedSucursal}
        />
 
      <div>
        {selectedSucursal ? (
          <TablaProductos empresaId={selectedEmpresa} sucursalId={selectedSucursal} />
        ) : (
          <p>Por favor, seleccione la sucursal para ver los productos.</p>
        )}
      </div>
    </div>
  );
}

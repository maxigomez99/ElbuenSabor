import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import FormularioAgregarEmpresa from '../formularios/FormularioAgregarEmpresa';
import FormularioAgregarSucursal from '../formularios/FormularioAgregarSucursal';

export default function Home() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const showForm = () => {
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const renderForm = () => {
    if (id) {
      return <FormularioAgregarSucursal onClose={handleCancel} />;
    } else if (location.pathname === '/empresas') {
      return <FormularioAgregarEmpresa onClose={handleCancel} />;
    }
  };
  
  let buttonText = 'Agregar Empresa'; // Default text

  if (location.pathname.includes('/sucursal/')) {
    buttonText = 'Agregar Sucursal';
  } 

  return (
    <div>
      <Card
        style={{ width: 300, height: 300, display: 'flex', flexDirection: 'column' }}
        onClick={showForm}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '30%' }}>
          <PlusOutlined style={{ fontSize: '48px' }} />
          <div style={{ textAlign: 'center' }}>{buttonText}</div>
        </div>
      </Card>
      {isFormVisible && renderForm()}
    </div>
  );
}
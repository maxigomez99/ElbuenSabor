import  { useState } from 'react';
import { Modal, Input, Form } from 'antd';
import { agregarStockId } from '../../../service/ServiceInsumos';


interface FormularioInsumoProps {
  onClose: () => void;
  id: number;
  visible: boolean;
}

const FormularioStock: React.FC<FormularioInsumoProps> = ({ onClose, id, visible }) => {
  const [cantidad, setCantidad] = useState<number>(0);
  const [nuevoPrecioVenta, setNuevoPrecioVenta] = useState<number>(0);
  const [nuevoPrecioCompra, setNuevoPrecioCompra] = useState<number>(0);

  const handleOk = async () => {
    try {
      const formData = {
        cantidad,
        nuevoPrecioVenta,
        nuevoPrecioCompra
      };

      await agregarStockId(formData, id);
      onClose();
    } catch (error) {
      console.error('Error al agregar stock:', error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Agregar Stock"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form layout="vertical">
        <Form.Item label="Cantidad">
          <Input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
        </Form.Item>
        <Form.Item label="Nuevo Precio de Venta">
          <Input
            type="number"
            value={nuevoPrecioVenta}
            onChange={(e) => setNuevoPrecioVenta(Number(e.target.value))}
          />
        </Form.Item>
        <Form.Item label="Nuevo Precio de Compra">
          <Input
            type="number"
            value={nuevoPrecioCompra}
            onChange={(e) => setNuevoPrecioCompra(Number(e.target.value))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormularioStock;

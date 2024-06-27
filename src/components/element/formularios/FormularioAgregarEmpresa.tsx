import  { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    Modal,
    Upload,
} from 'antd';
import { crearEmpresa } from '../../../service/ServiceEmpresa';

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

interface FormularioAgregarEmpresaProps {
    onClose: () => void;
}

const FormularioAgregarEmpresa: React.FC<FormularioAgregarEmpresaProps> = ({ onClose }) => {
    const [componentDisabled] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);

    const handleOk = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleSubmit = async (values: any) => {
        const formData = {
            nombre: values.nombre,
            razonSocial: values.razonSocial,
            cuil: values.cuil,
        };
        await crearEmpresa(formData);
        handleOk();
        window.location.reload();
    };

    return (
        <Modal title="Agregar Empresa" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <Form
                layout="vertical"
                disabled={componentDisabled}
                style={{ maxWidth: 600 }}
                onFinish={handleSubmit}
            >
                <Form.Item label="Nombre" name="nombre">
                    <Input />
                </Form.Item>
                <Form.Item label="Razón Social" name="razonSocial">
                    <Input />
                </Form.Item>
                <Form.Item label="Cuit" name="cuil">
                    <Input />
                </Form.Item>
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload action="/upload.do" listType="picture-card">
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.Item style={{ textAlign: 'right' }}>
                    <Button type="default" style={{ marginRight: '10px' }} onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Agregar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormularioAgregarEmpresa;
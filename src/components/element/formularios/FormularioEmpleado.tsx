
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Upload,
    UploadFile,
    notification,
} from "antd";

import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    initialValues: any;
    sucursalId?: string;
}

const FormularioEmpleado: React.FC<Props> = ({
    visible,
    onClose,
    initialValues,
    sucursalId,
}) => {

    const handleButtonClick = async (values: any) => {
        console.log('Received values of form: ', values);
        const formattedValues = { ...values };
        let promises: Promise<{ url: string }>[] = [];

        formattedValues.sucursal = {
            id: sucursalId,
            denominacion: "" // You might want to fill this with actual data if available
        };

        if (values.imagenes) {
            const files: UploadFile[] = values.imagenes;

            promises = files.map((file) => {
                return new Promise<{ url: string }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
                        resolve({ url: base64String });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file.originFileObj as File);
                });
            });
        }

        try {
            const imagenes = await Promise.all(promises);
            formattedValues.imagenes = imagenes;

            // Realizar la petición POST a la API
            const response = await fetch('http://localhost:8080/api/empleado/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedValues),
            });

            if (response.ok) {
                notification.open({
                    message: (
                        <span>
                            <CheckCircleOutlined style={{ color: 'green' }} /> Agregado correctamente
                        </span>
                    ),
                });
                form.resetFields();
                onClose();
            } else {
                throw new Error('Error en la solicitud');
            }
        } catch (error) {
            console.error('Error: ', error);
            notification.error({
                message: 'Error',
                description: 'Hubo un problema al agregar el empleado.',
            });
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList.map((file: any) => {
            if (file.originFileObj) {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onloadend = () => {
                    file.url = reader.result as string;
                };
            }
            return file;
        });
    };

    const [form] = Form.useForm();

    return (
        <Modal
            visible={visible}
            title="Agregar Empleado"
            onCancel={onClose}
            footer={null}
            width={1000}
        >
            <Form
                form={form}
                initialValues={initialValues}
                onFinish={handleButtonClick}
                layout="vertical"
            >
                <div>
                    <Form.Item
                        label="Nombre:"
                        name="nombre"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa el Nombre",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Apellido:"
                        name="apellido"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa el apellido",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Email:"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa un email",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Telefono:"
                        name="telefono"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa un telefono",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Rol:"
                        name="rol"
                        rules={[
                            {
                                required: true,
                                message: "Por favor selecciona un rol",
                            },
                        ]}
                    >
                        <Select style={{ width: "100%" }}>
                            <Select.Option value="EMPLEADO_REPARTIDOR">EMPLEADO_REPARTIDOR</Select.Option>
                            <Select.Option value="EMPLEADO_COCINA">EMPLEADO_COCINA</Select.Option>
                            <Select.Option value="CLIENTE">CLIENTE</Select.Option>
                            <Select.Option value="ADMINISTRADOR">ADMINISTRADOR</Select.Option>
                            <Select.Option value="EMPLEADO_CAJA">EMPLEADO_CAJA</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Foto"
                        name="imagenes"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload action="/upload.do" listType="picture-card" beforeUpload={() => false}>
                            <button style={{ border: 0, background: 'none' }} type="button">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Foto</div>
                            </button>
                        </Upload>
                    </Form.Item>
                </div>
                <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" onClick={() => form.submit()}>
                        Cargar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormularioEmpleado;

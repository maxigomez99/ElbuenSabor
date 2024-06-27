
import {
    Modal,
    Form,
    Input,
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
    empleadoId?: string;
}

const FormularioEmpleado: React.FC<Props> = ({
    visible,
    onClose,
    initialValues,
    sucursalId,
    empleadoId,
}) => {
    const [form] = Form.useForm();

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
    
            let url = `http://localhost:8080/api/empleado/`;
            let method = 'POST';
            if (empleadoId) {
                url = `http://localhost:8080/api/empleado/${empleadoId}`;
                method = 'PUT';
            }
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedValues)
            });
    
            if (!response.ok) {
                throw new Error('Error al modificar el empleado');
            }
    
            form.resetFields();
            onClose();
            notification.open({
                message: (
                    <span>
                        <CheckCircleOutlined style={{ color: 'green' }} /> Empleado actualizado correctamente
                    </span>
                ),
            });
        } catch (error) {
            console.error('Error: ', error);
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

    return (
        <Modal
            visible={visible}
            title="Modificar Empleado"
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
                                message: "Por favor ingresa un rol",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
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

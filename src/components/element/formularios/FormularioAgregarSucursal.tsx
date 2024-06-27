import { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    TimePicker,
    Upload,
    notification,
    Select,
} from 'antd';
import { useParams } from 'react-router-dom';
import { Sucursal, crearSucursal } from '../../../service/ServiceSucursal';
import { getLocalidad, getPais, getProvincia } from '../../../service/ServiceUbicacion';

import { Pais, Provincia, Localidad } from '../../../service/ServiceUbicacion';
const { Option } = Select;
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

interface FormularioAgregarEmpresaProps {
    onClose: () => void;
}

const FormularioAgregarSucursal: React.FC<FormularioAgregarEmpresaProps> = ({ onClose }) => {
    const [componentDisabled] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm(); // Usar el hook useForm

    const [paises, setPaises] = useState<Pais[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);

    useEffect(() => {
        getPais().then((data: Pais[]) => setPaises(data));
        getProvincia().then((data: Provincia[]) => setProvincias(data));
        getLocalidad().then((data: Localidad[]) => setLocalidades(data));
    }, []);

    const handleOk = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        onClose();
    };

    const handleSubmit = async (values: any) => {
        console.log("Form submitted with values:", values); // Add log to check form values
        try {
            const { horaApertura, horaCierre, ...rest } = values;
            const sucursal: Sucursal = {
                ...rest,
                empresa: { id },
                horaApertura: horaApertura.format('HH:mm'), // Formatear la hora de apertura
                horaCierre: horaCierre.format('HH:mm'), // Formatear la hora de cierre
                idEmpresa: id, // Ensure idEmpresa is set correctly
                file: values.fileList?.[0]?.originFileObj || null, // Handle the file input
            };
            console.log("Sucursal to create:", sucursal); // Log the sucursal object

            await crearSucursal(sucursal); // Llamar a la función crearSucursal
            notification.success({
                message: 'Sucursal agregada',
                description: 'Sucursal agregada correctamente',
            });
            handleOk();
            window.location.reload();
        } catch (error) {
            console.error("Error creating sucursal:", error); // Log the error
            notification.error({
                message: 'Error',
                description: 'La sucursal no fue agregada, revise los datos',
            });
        }
    };

    return (
        <Modal
            title="Agregar Sucursal"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800} // Aumentar el ancho del modal
        >
            <Form
                form={form} // Pasar la instancia del formulario al componente Form
                layout="vertical"
                disabled={componentDisabled}
                initialValues={{ empresa: { id } }}
                onFinish={handleSubmit} // Manejar el evento de envío del formulario
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Horario de Apertura" name="horaApertura" rules={[{ required: true, message: 'Por favor ingrese el horario de apertura' }]}>
                                    <TimePicker format='HH:mm' />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Horario de Cierre" name="horaCierre" rules={[{ required: true, message: 'Por favor ingrese el horario de cierre' }]}>
                                    <TimePicker format='HH:mm' />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="País" name="pais" rules={[{ required: true, message: 'Por favor ingrese el país' }]}>
                            <Select
                                showSearch
                                filterOption={(input, option:any) =>
                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {paises.map((pais) => (
                                    <Option key={pais.id} value={String(pais.id)}>{pais.nombre}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Provincia" name="provincia" rules={[{ required: true, message: 'Por favor ingrese la provincia' }]}>
                            <Select
                                showSearch
                                filterOption={(input, option:any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {provincias.map((provincia) => (
                                    <Option key={provincia.id} value={String(provincia.id)}>{provincia.nombre}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Localidad" name="localidad" rules={[{ required: true, message: 'Por favor ingrese la localidad' }]}>
                            <Select
                                showSearch
                                filterOption={(input, option:any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {localidades.map((localidad) => (
                                    <Option key={localidad.id} value={String(localidad.id)}>{localidad.nombre}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Calle" name="calle" rules={[{ required: true, message: 'Por favor ingrese la calle' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={4}>
                        <Form.Item label="Número" name="numero" rules={[{ required: true, message: 'Por favor ingrese el número' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Código Postal" name="cp" rules={[{ required: true, message: 'Por favor ingrese el código postal' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                   
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                            <Upload listType="picture-card">
                                <button style={{ border: 0, background: 'none' }} type="button">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
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

export default FormularioAgregarSucursal;

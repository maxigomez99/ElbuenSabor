import { useEffect, useRef, useState } from 'react';
import { SearchOutlined,  EditOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Switch, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

import { activarProductoXId, deleteProductoXId } from '../../../service/ServiceProducto';
import { getProductoXSucursal } from '../../../service/ServiceProducto';
import FormularioActualizarProducto from '../formularios/FormularioProductoActualizar';

interface DataType {
  id: number;
  codigo: string;
  imagen: string;
  denominacion: string;
  precioVenta: number;
  descripcion: string;
  tiempoEstimadoCocina: string;
  eliminado: boolean;
}

type DataIndex = keyof DataType;

interface Props {
  empresaId: string;
  sucursalId: string;
}

const App: React.FC<Props> = ({ sucursalId }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [data, setData] = useState<DataType[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<DataType | null>(null);
  const [showFormularioProducto, setShowFormularioProducto] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setData([]); // Clear the data before fetching new products
      try {
        const data = await getProductoXSucursal(sucursalId); // Use sucursalId from props
        setData(data);
      } catch (error) {
        console.error("Error al obtener los productos por sucursal:", error);
      }
    };

    fetchData();
  }, [sucursalId]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  const handleSwitchChange = async (checked: boolean, record: DataType) => {
    try {
      if (checked) {
        await activarProductoXId(record.id.toString());
      } else {
        await deleteProductoXId(record.id.toString());
      }
      // Actualizar los datos después de cambiar el estado
      const updatedData = await getProductoXSucursal(sucursalId);
      setData(updatedData);
    } catch (error) {
      console.error('Error al actualizar el estado del insumo:', error);
    }
  };

  const handleEdit = (record: DataType) => {
    if (record.id) {
      setSelectedProducto(record);
      setShowFormularioProducto(true);
    } else {
      console.error("El ID del insumo es nulo o no está definido.");
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Codigo',
      dataIndex: 'codigo',
      key: 'codigo',
      ...getColumnSearchProps('codigo'),
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Imagen',
      dataIndex: 'url',
      key: 'image',
      render: (_text, record) => (
        <img src={record.imagen ? `http://localhost:8080/images/${record.imagen}` : `http://localhost:8080/images/sin-imagen.jpg`} style={{ width: '50px' }} alt="Imagen" />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'denominacion',
      key: 'denominacion',
      ...getColumnSearchProps('denominacion'),
      sorter: (a, b) => a.denominacion.localeCompare(b.denominacion),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Precio',
      dataIndex: 'precioVenta',
      key: 'precioVenta',
      ...getColumnSearchProps('precioVenta'),
      sorter: (a, b) => a.precioVenta - b.precioVenta,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Descripcion',
      dataIndex: 'descripcion',
      key: 'descripcion',
      ...getColumnSearchProps('descripcion'),
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Tiempo Estimado Minutos',
      dataIndex: 'tiempoEstimadoCocina',
      key: 'tiempoEstimadoCocina',
      ...getColumnSearchProps('tiempoEstimadoCocina'),
      sorter: (a, b) => a.tiempoEstimadoCocina.localeCompare(b.tiempoEstimadoCocina),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_text: string, record: DataType) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}><EditOutlined /></a>
          <Switch
            checked={!record.eliminado}
            onChange={(checked) => handleSwitchChange(checked, record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSizeOptions: ['5', '10', '20', '30', '50', '100'], showSizeChanger: true }} 
      />
      {showFormularioProducto && selectedProducto && (
        <FormularioActualizarProducto
          visible={showFormularioProducto}
          onClose={() => setShowFormularioProducto(false)}
          onSubmit={(values) => {
            // Handle the submit action
            console.log('Submitted values:', values);
            setShowFormularioProducto(false);
          }}
          initialValues={selectedProducto}
          sucursalId={sucursalId}
          productoId={selectedProducto.id.toString()}
        />
      )}
    </>
  );
};

export default App;

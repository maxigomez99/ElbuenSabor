import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import TarjetaAgregar from "../../element/tarjeta/TarjetaAgregar";
import {
  getEmpresas,
  Empresas as EmpresasInterface,
} from "../../../service/ServiceEmpresa";
import imagenEmpresa from "../../../util/empresa.jpeg";

import { useSelector, useDispatch } from "react-redux";
import { EmpresaSlice } from "../../../redux/slice/EmpresaRedux"; // Corrected import
const { Meta } = Card;

const Empresa = () => {
  const { empresa } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("estado global: ", empresa);
  }, [empresa]);

  const [empresas, setEmpresas] = useState<EmpresasInterface[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getEmpresas().then(setEmpresas);
  }, []);

  return (
    <div>
      <h1>Empresa</h1>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {empresas.map((empresa) => (
          <Card
            key={empresa.id}
            style={{ width: 300, margin: "10px" }}
            onClick={() => {
              dispatch(EmpresaSlice.actions.setIdEmpresa(empresa.id || null));
              navigate(`/sucursal/${empresa.id}`);
            }} // Fixed dispatch
            cover={<img alt={empresa.nombre} src={imagenEmpresa} />}
            actions={[
              <DeleteOutlined key="delete" />,
              <EditOutlined key="edit" />,
            ]}
          >
            <Meta title={empresa.nombre} description={empresa.razonSocial} />
          </Card>
        ))}
        <TarjetaAgregar />
      </div>
    </div>
  );
};
export default Empresa;

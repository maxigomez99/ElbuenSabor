import { Route, Routes } from "react-router-dom";
import Login from "../components/pages/login-crear/login";
import RegistroCliente from "../components/pages/login-crear/CrearUsuarioCliente";

const RutasSinSidebar: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
    </Routes>
  );
};
export default RutasSinSidebar;

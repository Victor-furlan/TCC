import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/login/Login';
import { CriarConta } from '../pages/criarConta/CriarConta';
import { RedefinirSenha } from '../pages/redefinirSenha/RedefinirSenha';
import { Principal } from '../components/layout/Principal';
import { DashBoard } from '../pages/dashBoard/DashBoard';
import { Assinaturas } from '../pages/assinaturas/Assinaturas';
import { Despesas } from '../pages/despesas/Despesas';
import { Relatorios } from '../pages/relatorios/Relatorios';
import { Simulador } from '../pages/simulador/Simulador';
import { Configuracoes } from '../pages/configuracoes/Configuracoes';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="criarConta" element={<CriarConta/>}/>
        <Route path="redefinirSenha" element={<RedefinirSenha/>}/>

        <Route element={<Principal />}>
          <Route path="dashboard" element={<DashBoard/>}/>
          <Route path="assinaturas" element={<Assinaturas/>}/>
          <Route path="despesas" element={<Despesas/>}/>
          <Route path="relatorios" element={<Relatorios/>}/>
          <Route path="simulador" element={<Simulador/>}/>
          <Route path="configuracoes" element={<Configuracoes/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

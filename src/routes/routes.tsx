import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/login/Login';
import { CriarConta } from '../pages/criarConta/CriarConta';
import { RedefinirSenha } from '../pages/redefinirSenha/RedefinirSenha';
import { Principal } from '../components/layout/Principal';
import { DashBoard } from '../pages/dashBoard/DashBoard';
import { Assinaturas } from '../pages/assinaturas/Assinaturas';
import { RegistrarAssinatura } from '../pages/assinaturas/RegistrarAssinatura';
import { EditarAssinatura } from '../pages/assinaturas/EditarAssinatura';
import { AssinaturasProvider } from '../contexts/AssinaturasContexto';
import { Despesas } from '../pages/despesas/Despesas';
import { RegistrarDespesa } from '../pages/despesas/RegistrarDespesa'
import { EditarDespesa } from '../pages/despesas/EditarDespesa';
import { DespesasProvider } from '../contexts/DespesasContexto';
import { Relatorios } from '../pages/relatorios/Relatorios';
import { Simulador } from '../pages/simulador/Simulador';
import { Configuracoes } from '../pages/configuracoes/Configuracoes';
import { Perfil } from '../pages/perfil/Perfil';
import { TemaProvider } from '../contexts/TemaContexto';
import { UsuarioProvider } from '../contexts/UsuarioContexto';
import { BaseFinanceiraProvider } from '../contexts/BaseFinanceiraContexto';

export function AppRoutes() {
  return (
    <TemaProvider>
      <UsuarioProvider>
        <BaseFinanceiraProvider>
          <AssinaturasProvider>
            <DespesasProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="criarConta" element={<CriarConta/>}/>
                  <Route path="redefinirSenha" element={<RedefinirSenha/>}/>

                  <Route element={<Principal />}>
                    <Route path="dashboard" element={<DashBoard/>}/>
                    <Route path="assinaturas" element={<Assinaturas/>}/>
                    <Route path='assinaturas/nova' element={<RegistrarAssinatura/>}></Route>
                    <Route path='assinaturas/editar/:id' element={<EditarAssinatura />} />
                    <Route path="despesas" element={<Despesas/>}/>
                    <Route path="despesas/nova" element={<RegistrarDespesa/>}/>
                    <Route path="despesas/editar/:id" element={<EditarDespesa/>}/>
                    <Route path="relatorios" element={<Relatorios/>}/>
                    <Route path="simulador" element={<Simulador/>}/>
                    <Route path="configuracoes" element={<Configuracoes/>}/>
                    <Route path='perfil' element={<Perfil/>}/>
                  </Route>
                </Routes>
              </BrowserRouter>
            </DespesasProvider>
          </AssinaturasProvider>
        </BaseFinanceiraProvider>
      </UsuarioProvider>
    </TemaProvider>
  );
}
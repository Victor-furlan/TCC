import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { CriarConta } from '../pages/CriarConta/CriarConta';
import { RedefinirSenha } from '../pages/RedefinirSenha/RedefinirSenha';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="criarConta" element={<CriarConta/>}/>
        <Route path="redefinirSenha" element={<RedefinirSenha/>}/>
      </Routes>
    </BrowserRouter>
  );
}

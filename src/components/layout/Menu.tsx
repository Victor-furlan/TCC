import estilos from './Menu.module.css'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/imagens/logo_completa_mindcash.png'
import { MdDashboard, MdCreditCard, MdShoppingCart, MdBarChart, MdSettings, MdLogout } from 'react-icons/md'
import { IoMdCalculator  } from "react-icons/io";


export function Menu(){

    const location = useLocation()

    return(
        <aside className={estilos.conteiner}>

            <img src={logo} className={estilos.logo} />

            <nav className={estilos.itemConteiner}>

                <Link
                    className={estilos.item}
                    style={{
                        color: location.pathname === '/dashboard'
                               ? 'var(--cor-primaria)'
                               : 'var(--cor-texto-secundario)'
                    }}
                    to='/dashboard'
                >
                    <MdDashboard size={28} />
                    <span className={estilos.rotulo}>Dashboard</span>
                </Link>

                <Link
                    className={estilos.item}
                    style={{
                        color: location.pathname === '/assinaturas'
                               ? 'var(--cor-primaria)'
                               : 'var(--cor-texto-secundario)'
                    }}
                    to='/assinaturas'
                >
                    <MdCreditCard size={28} />
                    <span className={estilos.rotulo}>Assinaturas</span>
                </Link>

                <Link
                    className={estilos.item}
                    style={{
                        color: location.pathname === '/despesas'
                               ? 'var(--cor-primaria)'
                               : 'var(--cor-texto-secundario)'
                    }}
                    to='/despesas'
                >
                    <MdShoppingCart size={28} />
                    <span className={estilos.rotulo}>Gastos Variáveis</span>
                </Link>

                <Link
                    className={estilos.item}
                    style={{
                        color: location.pathname === '/relatorios'
                               ? 'var(--cor-primaria)'
                               : 'var(--cor-texto-secundario)'
                    }}
                    to='/relatorios'
                >
                    <MdBarChart size={28} />
                    <span className={estilos.rotulo}>Relatórios</span>
                </Link>

                <Link
                    className={estilos.item}
                    style={{
                        color: location.pathname === '/simulador'
                               ? 'var(--cor-primaria)'
                               : 'var(--cor-texto-secundario)'
                    }}
                    to='/simulador'
                >
                    <IoMdCalculator  size={28} />
                    <span className={estilos.rotulo}>Simulador</span>
                </Link>

                <Link
                    className={estilos.item}
                    style={{
                        color: location.pathname === '/configuracoes'
                               ? 'var(--cor-primaria)'
                               : 'var(--cor-texto-secundario)'
                    }}
                    to='/configuracoes'
                >
                    <MdSettings size={28} />
                    <span className={estilos.rotulo}>Configurações</span>
                </Link>

            </nav>
        </aside>
    )
}
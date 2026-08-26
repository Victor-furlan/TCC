import styles from './Principal.module.css'
import { Cabecalho } from './Cabecalho'
import { Menu } from './Menu'
import { Outlet } from 'react-router-dom'
import { useCoresCategorias } from '../../hooks/useCoresCategorias'

export function Principal(){
    useCoresCategorias()
    return(
        <div className={styles.gridConteiner}>
            <Cabecalho />
            <Menu />
            <div className={styles.conteudo}>
                <Outlet />
            </div>
        </div>
    )
}
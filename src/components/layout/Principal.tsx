import styles from './Principal.module.css'
import { Cabecalho } from './Cabecalho'
import { Menu } from './Menu'
import { Outlet } from 'react-router-dom'

export function Principal(){
    return(
        <div className={styles.gridConteiner}>
            <Cabecalho nomeUsuario={'teste'}/>
            <Menu />
            <div className={styles.conteudo}>
                <Outlet />
            </div>
        </div>
    )
}
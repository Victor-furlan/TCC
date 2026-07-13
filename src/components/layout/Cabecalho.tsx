import styles from './Cabecalho.module.css'
import { MdAccountCircle, MdPerson, MdLogout } from 'react-icons/md'
import { IoMdNotifications } from "react-icons/io"
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UsuarioContexto } from '../../contexts/UsuarioContexto'

export function Cabecalho(){

    const [dropdownContaAberto, setDropdownContaAberto] = useState(false)

    const { nomeUsuarioContexto, emailUsuarioContexto } = useContext(UsuarioContexto)
    const usuarioExibicao = nomeUsuarioContexto || emailUsuarioContexto

    const navegacao = useNavigate()

    const fazerLogout = () => {
        setDropdownContaAberto(false)
        navegacao('/')
    }

    return(
        <div className={styles.gridConteiner}>

            <p className={styles.nomeUsuario}>Olá, {usuarioExibicao}</p>

            <div className={styles.acoes}>
                <button className={styles.botaoIcone}>
                    <IoMdNotifications size={30} />
                </button>

                <div className={styles.dropdownConteiner}>
                    <button
                        className={styles.botaoIcone}
                        onClick={() => setDropdownContaAberto(!dropdownContaAberto)}
                    >
                        <MdAccountCircle size={30} />
                    </button>

                    {dropdownContaAberto && (
                        <div className={styles.listaDropdown}>
                            <p className={styles.tituloDropdown}>Minha Conta</p>

                            <Link
                                className={styles.itemDropdown}
                                to='/perfil'
                                onClick={() => setDropdownContaAberto(false)}
                            >
                                <MdPerson size={18} />
                                Perfil
                            </Link>

                            <button
                                className={styles.itemDropdown}
                                onClick={fazerLogout}
                            >
                                <MdLogout size={18} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
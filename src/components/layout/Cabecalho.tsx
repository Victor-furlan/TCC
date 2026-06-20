import styles from './Cabecalho.module.css'
import { MdAccountCircle, MdPerson, MdLogout } from 'react-icons/md'
import { IoMdNotifications } from "react-icons/io"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface CabecalhoProps {
    nomeUsuario: string
}

export function Cabecalho({ nomeUsuario }: CabecalhoProps){

    const [dropdownContaAberto, setDropdownContaAberto] = useState(false)

    const navegacao = useNavigate()

    const fazerLogout = () => {
        setDropdownContaAberto(false)
        navegacao('/')
    }

    return(
        <div className={styles.gridConteiner}>

            <p className={styles.nomeUsuario}>Olá, {nomeUsuario}</p>

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

                            <button className={styles.itemDropdown}>
                                <MdPerson size={18} />
                                Perfil
                            </button>

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
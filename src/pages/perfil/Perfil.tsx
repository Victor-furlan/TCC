import styles from './Perfil.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdEdit, MdLogout } from 'react-icons/md'
import { useContext } from 'react'
import { UsuarioContexto } from '../../contexts/UsuarioContexto'

export function Perfil() {

    const navegacao = useNavigate()
    const { nomeUsuarioContexto, emailUsuarioContexto } = useContext(UsuarioContexto)

    const nomeExibido = nomeUsuarioContexto || emailUsuarioContexto || 'Usuário'
    const emailExibido = emailUsuarioContexto || 'usuario@email.com'
    const inicial = nomeExibido.charAt(0).toUpperCase()

    const fazerLogout = () => {
        navegacao('/')
    }

    return(
        <div className={styles.conteiner}>
            <div className={styles.areaConteudo}>

                <div className={styles.cabecalho}>
                    <Link className={styles.botaoVoltar} to='/dashboard'>
                        <MdArrowBack size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.titulo}>Meu Perfil</h1>
                        <p className={styles.subtitulo}>Informações da sua conta</p>
                    </div>
                </div>

                <div className={styles.cardPerfil}>

                    <p className={styles.tituloSecao}>Dados pessoais</p>

                    <div className={styles.linhaAvatar}>
                        <div className={styles.avatar}>{inicial}</div>
                        <div>
                            <p className={styles.nomeUsuario}>{nomeExibido}</p>
                            <p className={styles.emailUsuario}>{emailExibido}</p>
                        </div>
                    </div>

                    <div className={styles.divisoria} />

                    <div className={styles.infoCampo}>
                        <p className={styles.rotuloInfo}>Nome</p>
                        <p className={styles.valorInfo}>{nomeExibido}</p>
                    </div>

                    <div className={styles.infoCampo}>
                        <p className={styles.rotuloInfo}>E-mail</p>
                        <p className={styles.valorInfo}>{emailExibido}</p>
                    </div>

                    <Link className={styles.botaoEditar} to='/perfil/editar'>
                        <MdEdit size={18} />
                        Editar perfil
                    </Link>

                    <button className={styles.botaoSair} onClick={fazerLogout}>
                        <MdLogout size={18} />
                        Sair
                    </button>

                </div>

            </div>
        </div>
    )
}
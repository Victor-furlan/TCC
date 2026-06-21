import styles from './Perfil.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdEdit, MdLogout } from 'react-icons/md'

export function Perfil() {

    const navegacao = useNavigate()

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
                        <div className={styles.avatar}>U</div>
                        <div>
                            <p className={styles.nomeUsuario}>Usuário</p>
                            <p className={styles.emailUsuario}>usuario@email.com</p>
                        </div>
                    </div>

                    <div className={styles.divisoria} />

                    <div className={styles.infoCampo}>
                        <p className={styles.rotuloInfo}>Nome</p>
                        <p className={styles.valorInfo}>Usuário</p>
                    </div>

                    <div className={styles.infoCampo}>
                        <p className={styles.rotuloInfo}>E-mail</p>
                        <p className={styles.valorInfo}>usuario@email.com</p>
                    </div>

                    <Link className={styles.botaoEditar} to='/configuracoes'>
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
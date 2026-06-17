import styles from './RedefinirSenha.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/imagens/logo.png";

export function RedefinirSenha() {
  return (
    <div className={styles.container}>
        <div className={styles.formConteiner}>
          
          <img src={logo} className={styles.logo} />
          <h1 className={styles.titulo}>Esqueceu sua senha?</h1>
          <p className={styles.subtitulo}>Digite seu e-mail e enviaremos um link para redefinir sua senha</p>

          <form className={styles.formulario}>

            <div className={styles.conteinerCampo}>
                <p className={styles.tituloCampo}>E-mail</p>
                <input className={styles.campo} placeholder='E-mail' />
            </div>

          </form>

            <button className={styles.redefinir}>
              Redefinir Senha
            </button>
            <div className={styles.conteinerVoltar}>
              <Link
                className={styles.logar}
                to={'/'}
              >
                Voltar para o login
              </Link>
            </div>
        </div>
    </div>
  );
}

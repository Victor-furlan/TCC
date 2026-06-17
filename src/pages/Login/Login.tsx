import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/imagens/logo_completa_mindcash.png";

export function Login() {
  return (
    <div className={styles.container}>
        <div className={styles.formConteiner}>
          <img src={logo} className={styles.logo} />
          <h1 className={styles.titulo}>Bem vindo</h1>
          <p className={styles.subtitulo}>Faça login para gerenciar suas despesas</p>

          <form className={styles.formulario}>

            <div className={styles.conteinerCampo}>
              <p className={styles.tituloCampo}>E-mail</p>
              <input className={styles.campo} placeholder='E-mail' />
            </div>


          <div className={styles.conteinerCampo}>
            <Link
              className={styles.esqueceuSenha}
              to={"redefinirSenha"}
            >
              Esqueceu a senha?
            </Link>
            
            <p className={styles.tituloCampo}>Senha</p>
            <input className={styles.campo} placeholder='Senha' />
          </div>

    
          </form>

            <button className={styles.login}>
              Login
            </button>
            <div className={styles.conteinerCriarConta}>
              <p className={styles.semConta}>Não tem uma conta?</p>
              <Link
                className={styles.criarConta}
                to={'criarConta'}
              >
                Crie uma aqui
              </Link>
            </div>
        </div>
    </div>
  );
}

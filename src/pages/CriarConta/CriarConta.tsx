import styles from './CriarConta.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/imagens/logo.png";

export function CriarConta() {
  return (
    <div className={styles.container}>
        <div className={styles.formConteiner}>
          
          <img src={logo} className={styles.logo} />
          <h1 className={styles.titulo}>Criar Conta</h1>
          <p className={styles.subtitulo}>Começe já a gerenciar suas despesas</p>

          <form className={styles.formulario}>

            <div className={styles.conteinerCampo}>
                <p className={styles.tituloCampo}>Nome Completo</p>
                <input className={styles.campo} placeholder='Nome Completo' />
            </div>


            <div className={styles.conteinerCampo}>
                <p className={styles.tituloCampo}>E-mail</p>
                <input className={styles.campo} placeholder='E-mail' />
            </div>


            <div className={styles.conteinerCampo}>
                <p className={styles.tituloCampo}>Senha</p>
                <input className={styles.campo} placeholder='Sua senha' />
            </div>

        <div className={styles.conteinerCampo}>
            <p className={styles.tituloCampo}>Confirmar Senha</p>
            <input className={styles.campo} placeholder='Sua senha' />
          </div>

    
          </form>

            <button className={styles.Criar}>
              Criar Conta
            </button>
            <div className={styles.conteinerLogin}>
              <p className={styles.comConta}>Já tem uma conta?</p>
              <Link
                className={styles.logar}
                to={'/'}
              >
                Logue aqui
              </Link>
            </div>
        </div>
    </div>
  );
}

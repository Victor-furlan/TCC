import styles from './Login.module.css';
import logo from "../../assets/imagens/logo_completa_mindcash.png";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useState } from 'react';
import { MdEmail, MdLock } from 'react-icons/md';
import { ModalMensagem } from '../../components/ModalMensagem';
import { UsuarioContexto } from '../../contexts/UsuarioContexto';


type FormValues = {
  email: string;
  senha: string;
};

const loginSchema = z.object({
  email: z.string().email({message: 'Informe um email valido'}),
  senha: z.string().min(6, {message: 'A senha deve ter no mínimo 6 caracteres'}),
})

export function Login() {

  const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
  const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
  const [modalMensagemTexto, setModalMensagemTexto] = useState('')

  const { setEmailUsuarioContexto } = useContext(UsuarioContexto)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });

  const navegacao = useNavigate();

  const autenticarUsuario = (data: FormValues) => {
    setEmailUsuarioContexto(data.email)
    setModalMensagemTexto('Seja bem vindo ao MindCash!')
    exibirModal()
  }

  const exibirModal = () => {
    setModalMensagemTitulo('Login')
    setModalMensagemVisivel(true)
  }

  const ocultarModal = () => {
    setModalMensagemVisivel(false)
    navegacao('dashBoard')
  }

  return (
    <div className={styles.container}>

        <div className={styles.painelMarca}>
          <svg className={styles.marcadores} viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="210" cy="210" r="180" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
            <circle cx="210" cy="210" r="140" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
            <circle cx="210" cy="210" r="100" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
            <line x1="210" y1="30" x2="210" y2="55" stroke="white" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
            <line x1="210" y1="30" x2="210" y2="120" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" transform="rotate(60 210 210)" />
            <line x1="210" y1="30" x2="210" y2="90" stroke="white" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" transform="rotate(150 210 210)" />
          </svg>

          <p className={styles.fraseDestaque}>
            Cada gasto tem um preço em <span className={styles.fraseDestaqueAccent}>horas</span> e uma <span className={styles.fraseDestaqueAccent}>emoção</span> por trás.
          </p>
          <p className={styles.legendaMarca}>
            O MindCash converte seus gastos em tempo de vida e revela os padrões emocionais por trás de cada decisão.
          </p>
        </div>

        <div className={styles.painelFormulario}>
          <div className={styles.formConteiner}>
            <img src={logo} className={styles.logo} />

            <h1 className={styles.titulo}>Bem vindo</h1>
            <p className={styles.subtitulo}>Faça login para gerenciar suas despesas</p>

            <form className={styles.formulario} onSubmit={handleSubmit(autenticarUsuario)}>

              <div className={styles.conteinerCampo}>
                <p className={styles.tituloCampo}>E-mail</p>
                <div className={styles.campoComIcone}>
                  <MdEmail size={17} className={styles.iconeCampo} />
                  <input
                    {...register('email')} 
                    className={styles.campo}
                    placeholder='E-mail'
                  />
                </div>
                {errors.email && <p className={styles.erro}>{errors.email.message}</p>}
              </div>


            <div className={styles.conteinerCampo}>
              <Link
                className={styles.esqueceuSenha}
                to={"redefinirSenha"}
              >
                Esqueceu a senha?
              </Link>
              
              <p className={styles.tituloCampo}>Senha</p>
              <div className={styles.campoComIcone}>
                <MdLock size={17} className={styles.iconeCampo} />
                <input
                  {...register('senha')}
                  className={styles.campo}
                  placeholder='Senha'
                  type='password'
                />
              </div>
              {errors.senha && <p className={styles.erro}>{errors.senha.message}</p>}         
            </div>

              <button className={styles.login} type='submit'>
                Login
              </button>
            </form>

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

        <ModalMensagem 
          exibir={modalMensagemVisivel}
          ocultar={() => ocultarModal()}
          titulo={modalMensagemTitulo}
          texto={modalMensagemTexto}
        />
        
    </div>
  );
}
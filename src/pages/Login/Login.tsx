import styles from './Login.module.css';
import logo from "../../assets/imagens/logo_completa_mindcash.png";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react';
import { ModalMensagem } from '../../components/ModalMensagem';


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

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });

  const navegacao = useNavigate();

  const autenticarUsuario = (data: FormValues) => {
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
        <div className={styles.formConteiner}>
          <img src={logo} className={styles.logo} />
          <h1 className={styles.titulo}>Bem vindo</h1>
          <p className={styles.subtitulo}>Faça login para gerenciar suas despesas</p>

          <form className={styles.formulario} onSubmit={handleSubmit(autenticarUsuario)}>

            <div className={styles.conteinerCampo}>
              <p className={styles.tituloCampo}>E-mail</p>
              <input
                {...register('email')} 
                className={styles.campo}
                placeholder='E-mail'
              />
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
            <input
              {...register('senha')}
              className={styles.campo}
              placeholder='Senha'
              type='password'
            />
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

        <ModalMensagem 
          exibir={modalMensagemVisivel}
          ocultar={() => ocultarModal()}
          titulo={modalMensagemTitulo}
          texto={modalMensagemTexto}
        />
        
    </div>
  );
}

import styles from './RedefinirSenha.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/imagens/logo.png";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ModalMensagem } from '../../components/ModalMensagem';

type FormValues = {
  email: string;
};

const redefinirSenhaSchema = z.object({
  email: z.string().email({ message: 'Informe um e-mail válido.' }),
});

export function RedefinirSenha() {

  const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
  const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
  const [modalMensagemTexto, setModalMensagemTexto] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(redefinirSenhaSchema),
  });

  const navegacao = useNavigate();

  const enviarRedefinicao = (data: FormValues) => {
    setModalMensagemTexto(`Enviamos um link de redefinição para ${data.email}!`)
    exibirModal()
  };

  const exibirModal = () => {
    setModalMensagemTitulo('Redefinir Senha')
    setModalMensagemVisivel(true)
  }

  const ocultarModal = () => {
    setModalMensagemVisivel(false)
    navegacao('/')
  }

  return (
    <div className={styles.container}>
      <div className={styles.formConteiner}>

        <img src={logo} className={styles.logo} />
        <h1 className={styles.titulo}>Esqueceu sua senha?</h1>
        <p className={styles.subtitulo}>Digite seu e-mail e enviaremos um link para redefinir sua senha</p>

        <form className={styles.formulario} onSubmit={handleSubmit(enviarRedefinicao)}>

          <div className={styles.conteinerCampo}>
            <p className={styles.tituloCampo}>E-mail</p>
            <input
              {...register('email')}
              className={styles.campo}
              placeholder='E-mail'
            />
            {errors.email && <p className={styles.erro}>{errors.email.message}</p>}
          </div>

          <button className={styles.redefinir} type='submit'>
            Redefinir Senha
          </button>

        </form>

        <div className={styles.conteinerVoltar}>
          <Link
            className={styles.logar}
            to={'/'}
          >
            Voltar para o login
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
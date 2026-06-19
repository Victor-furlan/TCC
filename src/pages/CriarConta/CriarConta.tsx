import styles from './CriarConta.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/imagens/logo.png";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ModalMensagem } from '../../components/ModalMensagem';

type FormValues = {
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

const criarContaSchema = z.object({
  nomeCompleto: z.string()
    .min(1, { message: 'Informe seu nome completo.' })
    .refine((valor) => valor.trim().split(/\s+/).length >= 2, {
      message: 'Informe nome e sobrenome.',
    }),
  email: z.string().email({ message: 'Informe um e-mail válido.' }),
  senha: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
  confirmarSenha: z.string().min(6, { message: 'Confirme sua senha.' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem.',
  path: ['confirmarSenha'],
});

export function CriarConta() {

  const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
  const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
  const [modalMensagemTexto, setModalMensagemTexto] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(criarContaSchema),
  });

  const navegacao = useNavigate();

  const criarUsuario = (data: FormValues) => {
    setModalMensagemTexto(`Conta criada com sucesso, ${data.nomeCompleto}!`)
    exibirModal()
  };

  const exibirModal = () => {
    setModalMensagemTitulo('Criar Conta')
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
        <h1 className={styles.titulo}>Criar Conta</h1>
        <p className={styles.subtitulo}>Começe já a gerenciar suas despesas</p>

        <form className={styles.formulario} onSubmit={handleSubmit(criarUsuario)}>

          <div className={styles.conteinerCampo}>
            <p className={styles.tituloCampo}>Nome Completo</p>
            <input
              {...register('nomeCompleto')}
              className={styles.campo}
              placeholder='Nome Completo'
            />
            {errors.nomeCompleto && <p className={styles.erro}>{errors.nomeCompleto.message}</p>}
          </div>

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
            <p className={styles.tituloCampo}>Senha</p>
            <input
              {...register('senha')}
              className={styles.campo}
              placeholder='Sua senha'
              type='password'
            />
            {errors.senha && <p className={styles.erro}>{errors.senha.message}</p>}
          </div>

          <div className={styles.conteinerCampo}>
            <p className={styles.tituloCampo}>Confirmar Senha</p>
            <input
              {...register('confirmarSenha')}
              className={styles.campo}
              placeholder='Sua senha'
              type='password'
            />
            {errors.confirmarSenha && <p className={styles.erro}>{errors.confirmarSenha.message}</p>}
          </div>

          <button className={styles.Criar} type='submit'>
            Criar Conta
          </button>

        </form>

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

      <ModalMensagem 
        exibir={modalMensagemVisivel}
        ocultar={() => ocultarModal()}
        titulo={modalMensagemTitulo}
        texto={modalMensagemTexto}
      />
    </div>
  );
}
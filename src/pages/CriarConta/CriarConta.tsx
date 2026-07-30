import styles from './CriarConta.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/imagens/logo.png";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useState } from 'react';
import { ModalMensagem } from '../../components/ModalMensagem';
import { MdPerson, MdEmail, MdLock, MdSchedule, MdMood, MdBarChart } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

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

const beneficios = [
  { icone: <MdSchedule size={19} />, texto: 'Veja o quanto cada gasto custa em horas de vida' },
  { icone: <MdMood size={19} />, texto: 'Entenda as emoções por trás das suas decisões' },
  { icone: <MdBarChart size={19} />, texto: 'Simule cenários e descubra quanto pode economizar' },
]

export function CriarConta() {

  const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
  const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
  const [modalMensagemTexto, setModalMensagemTexto] = useState('')


  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(criarContaSchema),
  });

  const {criarAuthUsuario} = useAuth()

  const navegacao = useNavigate();

  const criarUsuario = async (data: FormValues) => {
    const resultado = await criarAuthUsuario(data.nomeCompleto, data.email, data.senha)

    if (resultado !== 'sucesso') {
      setModalMensagemTitulo('Erro')
      setModalMensagemTexto(resultado)
      exibirModal()
      return
    }

    setModalMensagemTexto(`Conta criada com sucesso, ${data.nomeCompleto}!`)
    setModalMensagemTitulo('Criar Conta')
    exibirModal()
  };

  const exibirModal = () => {
    setModalMensagemVisivel(true)
  }

  const ocultarModal = () => {
    setModalMensagemVisivel(false)
    navegacao('/')
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

        <h2 className={styles.tituloMarca}>Sua relação com o dinheiro, <span className={styles.fraseDestaqueAccent}>reinventada.</span></h2>
        <p className={styles.legendaMarca}>Tudo que você precisa pra gastar com mais consciência.</p>

        <div className={styles.listaBeneficios}>
          {beneficios.map((beneficio, indice) => (
            <div key={indice} className={styles.itemBeneficio}>
              <span className={styles.iconeBeneficio}>{beneficio.icone}</span>
              <p className={styles.textoBeneficio}>{beneficio.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.painelFormulario}>
        <div className={styles.formConteiner}>

          <img src={logo} className={styles.logo} />
          <h1 className={styles.titulo}>Comece sua jornada</h1>
          <p className={styles.subtitulo}>Crie sua conta e assuma o controle das suas finanças</p>

          <form className={styles.formulario} onSubmit={handleSubmit(criarUsuario)}>

            <div className={styles.conteinerCampo}>
              <p className={styles.tituloCampo}>Nome Completo</p>
              <div className={styles.campoComIcone}>
                <MdPerson size={17} className={styles.iconeCampo} />
                <input
                  {...register('nomeCompleto')}
                  className={styles.campo}
                  placeholder='Nome Completo'
                />
              </div>
              {errors.nomeCompleto && <p className={styles.erro}>{errors.nomeCompleto.message}</p>}
            </div>

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
              <p className={styles.tituloCampo}>Senha</p>
              <div className={styles.campoComIcone}>
                <MdLock size={17} className={styles.iconeCampo} />
                <input
                  {...register('senha')}
                  className={styles.campo}
                  placeholder='Sua senha'
                  type='password'
                />
              </div>
              {errors.senha && <p className={styles.erro}>{errors.senha.message}</p>}
            </div>

            <div className={styles.conteinerCampo}>
              <p className={styles.tituloCampo}>Confirmar Senha</p>
              <div className={styles.campoComIcone}>
                <MdLock size={17} className={styles.iconeCampo} />
                <input
                  {...register('confirmarSenha')}
                  className={styles.campo}
                  placeholder='Sua senha'
                  type='password'
                />
              </div>
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
import styles from './NovaSenha.module.css';
import { Link } from 'react-router-dom';
import logoClara from "../../assets/imagens/logo.svg";
import logoEscura from "../../assets/imagens/logo_dark_mode.svg";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useContext, useEffect } from 'react';
import { MdLock } from 'react-icons/md';
import { ModalMensagem } from '../../components/ModalMensagem';
import { TemaContexto } from '../../contexts/TemaContexto';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';

type FormValues = {
    senha: string;
    confirmarSenha: string;
};

const novaSenhaSchema = z.object({
    senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
    confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
})

export function NovaSenha() {

    const { tema } = useContext(TemaContexto)
    const { atualizarSenhaAuth, logOutAuth } = useAuth()

    const [modalVisivel, setModalVisivel] = useState(false)
    const [modalTitulo, setModalTitulo] = useState('')
    const [modalTexto, setModalTexto] = useState('')
    const [modalStatus, setModalStatus] = useState<'sucesso' | 'erro'>('sucesso')
    const [carregando, setCarregando] = useState(false)
    const [sessaoValida, setSessaoValida] = useState(false)

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') setSessaoValida(true)
        })
        return () => subscription.unsubscribe()
    }, [])

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(novaSenhaSchema),
    });

    const salvarNovaSenha = async (data: FormValues) => {
        setCarregando(true)
        const resultado = await atualizarSenhaAuth(data.senha)
        setCarregando(false)

        if (resultado === 'same_password') {
            setModalTitulo('Senha igual à anterior')
            setModalTexto('A nova senha não pode ser igual à senha atual. Escolha uma senha diferente.')
            setModalStatus('erro')
        } else if (resultado !== 'sucesso') {
            setModalTitulo('Erro')
            setModalTexto('Não foi possível atualizar a senha. O link pode ter expirado.')
            setModalStatus('erro')
        } else {
            setModalTitulo('Senha atualizada!')
            setModalTexto('Sua senha foi redefinida com sucesso. Faça login com a nova senha.')
            setModalStatus('sucesso')
        }

        setModalVisivel(true)
    }

    const fecharModal = async () => {
        setModalVisivel(false)
        if (modalStatus === 'sucesso') await logOutAuth()
    }

    if (!sessaoValida) {
        return (
            <div className={styles.container}>
                <div className={styles.formConteiner}>
                    <img src={tema === 'escuro' ? logoEscura : logoClara} className={styles.logo} />
                    <h1 className={styles.titulo}>Link inválido</h1>
                    <p className={styles.subtitulo}>Este link expirou ou já foi utilizado.</p>
                    <Link className={styles.logar} to={'/'}>Voltar para o login</Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.formConteiner}>

                <img src={tema === 'escuro' ? logoEscura : logoClara} className={styles.logo} />
                <h1 className={styles.titulo}>Nova senha</h1>
                <p className={styles.subtitulo}>Escolha uma nova senha para sua conta</p>

                <form className={styles.formulario} onSubmit={handleSubmit(salvarNovaSenha)}>

                    <div className={styles.conteinerCampo}>
                        <p className={styles.tituloCampo}>Nova senha</p>
                        <div className={styles.campoComIcone}>
                            <MdLock size={17} className={styles.iconeCampo} />
                            <input
                                {...register('senha')}
                                className={styles.campo}
                                type='password'
                                placeholder='Nova senha'
                            />
                        </div>
                        {errors.senha && <p className={styles.erro}>{errors.senha.message}</p>}
                    </div>

                    <div className={styles.conteinerCampo}>
                        <p className={styles.tituloCampo}>Confirmar senha</p>
                        <div className={styles.campoComIcone}>
                            <MdLock size={17} className={styles.iconeCampo} />
                            <input
                                {...register('confirmarSenha')}
                                className={styles.campo}
                                type='password'
                                placeholder='Confirmar senha'
                            />
                        </div>
                        {errors.confirmarSenha && <p className={styles.erro}>{errors.confirmarSenha.message}</p>}
                    </div>

                    <button className={styles.redefinir} type='submit' disabled={carregando}>
                        {carregando ? 'Salvando...' : 'Salvar Nova Senha'}
                    </button>

                </form>

                <div className={styles.conteinerVoltar}>
                    <Link className={styles.logar} to={'/'}>
                        Voltar para o login
                    </Link>
                </div>
            </div>

            <ModalMensagem
                exibir={modalVisivel}
                ocultar={fecharModal}
                titulo={modalTitulo}
                texto={modalTexto}
            />
        </div>
    );
}
import styles from './EditarPerfil.module.css'
import { Link } from 'react-router-dom'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MdArrowBack } from 'react-icons/md'
import { ModalMensagem } from '../../components/ModalMensagem'
import { UsuarioContexto } from '../../contexts/UsuarioContexto'
import { useAuth } from '../../hooks/useAuth'

type AbaEditar = 'pessoal' | 'seguranca'

type PessoalFormValues = {
    novoNome: string
    email: string
}

type SegurancaFormValues = {
    novaSenha: string
    confirmarNovaSenha: string
}

const pessoalSchema = z.object({
    novoNome: z.string()
        .min(1, { message: 'Informe o novo nome.' })
        .refine((valor) => valor.trim().split(/\s+/).length >= 2, {
            message: 'Informe nome e sobrenome.',
        }),
    email: z.string().email({ message: 'Informe um e-mail válido.' }),
})

const segurancaSchema = z.object({
    novaSenha: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
    confirmarNovaSenha: z.string().min(6, { message: 'Confirme sua nova senha.' }),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarNovaSenha'],
})

export function EditarPerfil() {

    const [abaAtiva, setAbaAtiva] = useState<AbaEditar>('pessoal')
    const [modalVisivel, setModalVisivel] = useState(false)
    const [modalTitulo, setModalTitulo] = useState('')

    const { nomeUsuarioContexto, emailUsuarioContexto } = useContext(UsuarioContexto)
    const nomeAtual = nomeUsuarioContexto

    const {atualizarPerfilAuth, atualizarSenhaAuth} = useAuth()

    const formPessoal = useForm<PessoalFormValues>({ resolver: zodResolver(pessoalSchema) })
    const formSeguranca = useForm<SegurancaFormValues>({ resolver: zodResolver(segurancaSchema) })

    const exibirModal = (titulo: string) => {
        setModalTitulo(titulo)
        setModalVisivel(true)
    }

    const salvarPessoal = async (data: PessoalFormValues) => {
        const resultado = await atualizarPerfilAuth(data.novoNome, data.email)

        if (resultado !== 'sucesso') {
            exibirModal('Erro')
            return
        }

        exibirModal('Dados Pessoais')
    }

    const salvarSeguranca = async (data: SegurancaFormValues) => {
        const resultado = await atualizarSenhaAuth(data.novaSenha)

        if (resultado !== 'sucesso') {
            exibirModal('Erro')
            return
        }

        exibirModal('Segurança')
    }

    return(
        <div className={styles.conteiner}>
            <div className={styles.areaConteudo}>

                <div className={styles.cabecalho}>
                    <Link className={styles.botaoVoltar} to='/perfil'>
                        <MdArrowBack size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.titulo}>Editar Perfil</h1>
                        <p className={styles.subtitulo}>Atualize suas informações</p>
                    </div>
                </div>

                <div className={styles.abas}>
                    <button
                        className={abaAtiva === 'pessoal' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('pessoal')}
                    >
                        Dados Pessoais
                    </button>
                    <button
                        className={abaAtiva === 'seguranca' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('seguranca')}
                    >
                        Segurança
                    </button>
                </div>

                {abaAtiva === 'pessoal' && (
                    <form className={styles.cardConteudo} onSubmit={formPessoal.handleSubmit(salvarPessoal)}>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Seu nome atual:</p>
                            <p className={styles.nomeAtual}>{nomeAtual}</p>
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Seu e-mail atual:</p>
                            <p className={styles.nomeAtual}>{emailUsuarioContexto}</p>
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Novo nome:</p>
                            <input
                                {...formPessoal.register('novoNome')}
                                className={styles.input}
                                placeholder='ex. João Silva'
                            />
                            {formPessoal.formState.errors.novoNome && (
                                <p className={styles.erro}>{formPessoal.formState.errors.novoNome.message}</p>
                            )}
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>E-mail:</p>
                            <input
                                {...formPessoal.register('email')}
                                className={styles.input}
                                placeholder='ex. joao@email.com'
                            />
                            {formPessoal.formState.errors.email && (
                                <p className={styles.erro}>{formPessoal.formState.errors.email.message}</p>
                            )}
                        </div>

                        <button type='submit' className={styles.botaoSalvar}>Salvar Alterações</button>

                    </form>
                )}

                {abaAtiva === 'seguranca' && (
                    <form className={styles.cardConteudo} onSubmit={formSeguranca.handleSubmit(salvarSeguranca)}>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Nova senha:</p>
                            <input
                                {...formSeguranca.register('novaSenha')}
                                className={styles.input}
                                placeholder='Mínimo 6 caracteres'
                                type='password'
                            />
                            {formSeguranca.formState.errors.novaSenha && (
                                <p className={styles.erro}>{formSeguranca.formState.errors.novaSenha.message}</p>
                            )}
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Confirmar nova senha:</p>
                            <input
                                {...formSeguranca.register('confirmarNovaSenha')}
                                className={styles.input}
                                placeholder='Repita a nova senha'
                                type='password'
                            />
                            {formSeguranca.formState.errors.confirmarNovaSenha && (
                                <p className={styles.erro}>{formSeguranca.formState.errors.confirmarNovaSenha.message}</p>
                            )}
                        </div>

                        <button type='submit' className={styles.botaoSalvar}>Salvar Alterações</button>

                    </form>
                )}

            </div>

            <ModalMensagem
                exibir={modalVisivel}
                ocultar={() => setModalVisivel(false)}
                titulo={modalTitulo}
                texto='Alterações salvas com sucesso!'
            />
        </div>
    )
}
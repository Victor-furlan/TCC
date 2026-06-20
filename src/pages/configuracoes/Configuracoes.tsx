import styles from './Configuracoes.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    MdLanguage,
    MdAccessibility,
    MdLightMode,
    MdDarkMode,
    MdSettingsBrightness,
    MdExpandMore,
    MdCheck,
} from 'react-icons/md'

type AbaConfiguracao = 'private' | 'security' | 'preferences' | 'financial' | 'about'

type PrivateFormValues = {
    novoNome: string
    email: string
}

const privateSchema = z.object({
    novoNome: z.string()
        .min(1, { message: 'Informe o novo nome.' })
        .refine((valor) => valor.trim().split(/\s+/).length >= 2, {
            message: 'Informe nome e sobrenome.',
        }),
    email: z.string().email({ message: 'Informe um e-mail válido.' }),
})

type SecurityFormValues = {
    novaSenha: string
    confirmarNovaSenha: string
    emailRecuperacao: string
}

const securitySchema = z.object({
    novaSenha: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
    confirmarNovaSenha: z.string().min(6, { message: 'Confirme sua nova senha.' }),
    emailRecuperacao: z.string().email({ message: 'Informe um e-mail válido.' }),
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarNovaSenha'],
})

type FinancialFormValues = {
    rendaMensal: string
    horasTrabalhadas: string
}

const financialSchema = z.object({
    rendaMensal: z.string().min(1, { message: 'Informe sua renda mensal.' }),
    horasTrabalhadas: z.string().min(1, { message: 'Informe sua carga horária mensal.' }),
})

const categorias = [
    { nome: 'Entertainment', cor: '#FFC1C1' },
    { nome: 'Software', cor: '#FFFBC1' },
    { nome: 'Shopping', cor: '#AEFFB3' },
    { nome: 'Utilities', cor: '#FFD4AE' },
    { nome: 'Food', cor: '#AED1FF' },
    { nome: 'Health', cor: '#FFAEF4' },
    { nome: 'Education', cor: '#D8AEFF' },
]

const integrantes = [
    { nome: 'Victor Canissaris Furlan' },
    { nome: 'Pérola Evellyn Daltro Figueiredo' },
    { nome: 'Klayton Harlen Mendes Souza' },
]

const opcoesTema = [
    { valor: 'light' as const, rotulo: 'Light', icone: <MdLightMode size={18} /> },
    { valor: 'dark' as const, rotulo: 'Dark', icone: <MdDarkMode size={18} /> },
    { valor: 'system' as const, rotulo: 'System', icone: <MdSettingsBrightness size={18} /> },
]

const opcoesIdioma = [
    { valor: 'pt' as const, rotulo: 'Português' },
    { valor: 'en' as const, rotulo: 'English' },
]

export function Configuracoes() {

    const [abaAtiva, setAbaAtiva] = useState<AbaConfiguracao>('private')
    const [vlibrasAtivo, setVlibrasAtivo] = useState(false)

    const [temaSelecionado, setTemaSelecionado] = useState<'light' | 'dark' | 'system'>('light')
    const [dropdownTemaAberto, setDropdownTemaAberto] = useState(false)

    const [idiomaSelecionado, setIdiomaSelecionado] = useState<'pt' | 'en'>('en')
    const [dropdownIdiomaAberto, setDropdownIdiomaAberto] = useState(false)

    const formPrivate = useForm<PrivateFormValues>({ resolver: zodResolver(privateSchema) })
    const formSecurity = useForm<SecurityFormValues>({ resolver: zodResolver(securitySchema) })
    const formFinancial = useForm<FinancialFormValues>({ resolver: zodResolver(financialSchema) })

    const salvarPrivate = (data: PrivateFormValues) => {
        console.log(data)
    }

    const salvarSecurity = (data: SecurityFormValues) => {
        console.log(data)
    }

    const salvarFinancial = (data: FinancialFormValues) => {
        console.log(data)
    }

    const tituloAba: Record<AbaConfiguracao, string> = {
        private: 'Profile',
        security: 'Security',
        preferences: 'Preferences',
        financial: 'Financial',
        about: 'About',
    }

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <h1 className={styles.titulo}>Settings</h1>
                <p className={styles.subtitulo}>{tituloAba[abaAtiva]}</p>
            </section>

            <div className={styles.abas}>
                <button
                    className={abaAtiva === 'private' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                    onClick={() => setAbaAtiva('private')}
                >
                    Private
                </button>
                <button
                    className={abaAtiva === 'security' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                    onClick={() => setAbaAtiva('security')}
                >
                    Security
                </button>
                <button
                    className={abaAtiva === 'preferences' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                    onClick={() => setAbaAtiva('preferences')}
                >
                    Preferences
                </button>
                <button
                    className={abaAtiva === 'financial' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                    onClick={() => setAbaAtiva('financial')}
                >
                    Financial
                </button>
                <button
                    className={abaAtiva === 'about' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                    onClick={() => setAbaAtiva('about')}
                >
                    About
                </button>
            </div>

            {abaAtiva === 'private' && (
                <form className={styles.cardConteudo} onSubmit={formPrivate.handleSubmit(salvarPrivate)}>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Your name:</p>
                        <input className={styles.input} placeholder='ex. teste da silva' disabled />
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>New name:</p>
                        <input
                            {...formPrivate.register('novoNome')}
                            className={styles.input}
                            placeholder='ex. teste123'
                        />
                        {formPrivate.formState.errors.novoNome && (
                            <p className={styles.erro}>{formPrivate.formState.errors.novoNome.message}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>E-Mail:</p>
                        <input
                            {...formPrivate.register('email')}
                            className={styles.input}
                            placeholder='ex. teste@gmail.com'
                        />
                        {formPrivate.formState.errors.email && (
                            <p className={styles.erro}>{formPrivate.formState.errors.email.message}</p>
                        )}
                    </div>

                    <button type='submit' className={styles.botaoSalvar}>Save Changes</button>

                </form>
            )}

            {abaAtiva === 'security' && (
                <form className={styles.cardConteudo} onSubmit={formSecurity.handleSubmit(salvarSecurity)}>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Your password:</p>
                        <input className={styles.input} placeholder='ex. ****************' type='password' disabled />
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>New password:</p>
                        <input
                            {...formSecurity.register('novaSenha')}
                            className={styles.input}
                            placeholder='ex. **************'
                            type='password'
                        />
                        {formSecurity.formState.errors.novaSenha && (
                            <p className={styles.erro}>{formSecurity.formState.errors.novaSenha.message}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Confirm new password:</p>
                        <input
                            {...formSecurity.register('confirmarNovaSenha')}
                            className={styles.input}
                            placeholder='ex. **************'
                            type='password'
                        />
                        {formSecurity.formState.errors.confirmarNovaSenha && (
                            <p className={styles.erro}>{formSecurity.formState.errors.confirmarNovaSenha.message}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Recovery e-mail:</p>
                        <input
                            {...formSecurity.register('emailRecuperacao')}
                            className={styles.input}
                            placeholder='ex. teste@gmail.com'
                        />
                        {formSecurity.formState.errors.emailRecuperacao && (
                            <p className={styles.erro}>{formSecurity.formState.errors.emailRecuperacao.message}</p>
                        )}
                    </div>

                    <button type='submit' className={styles.botaoSalvar}>Save Changes</button>

                </form>
            )}

            {abaAtiva === 'preferences' && (
                <div className={styles.cardConteudo}>
                    <div className={styles.gridPreferencias}>

                        <div className={styles.colunaCategorias}>
                            <p className={styles.rotuloCampo}>Color class:</p>
                            <div className={styles.listaCategorias}>
                                {categorias.map((categoria) => (
                                    <div key={categoria.nome} className={styles.itemCategoria}>
                                        <span className={styles.amostraCor} style={{ backgroundColor: categoria.cor }} />
                                        <p className={styles.nomeCategoria}>{categoria.nome}</p>
                                        <p className={styles.hexCategoria}>{categoria.cor}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.colunaOpcoes}>

                            <div className={styles.campo}>
                                <p className={styles.rotuloCampo}>Language:</p>
                                <div className={styles.dropdownConteiner}>
                                    <button
                                        type='button'
                                        className={styles.selectFalso}
                                        onClick={() => setDropdownIdiomaAberto(!dropdownIdiomaAberto)}
                                    >
                                        <MdLanguage size={18} />
                                        {opcoesIdioma.find((opcao) => opcao.valor === idiomaSelecionado)?.rotulo}
                                        <MdExpandMore size={18} className={styles.iconeExpandir} />
                                    </button>

                                    {dropdownIdiomaAberto && (
                                        <div className={styles.listaDropdown}>
                                            {opcoesIdioma.map((opcao) => (
                                                <button
                                                    key={opcao.valor}
                                                    type='button'
                                                    className={styles.itemDropdown}
                                                    onClick={() => {
                                                        setIdiomaSelecionado(opcao.valor)
                                                        setDropdownIdiomaAberto(false)
                                                    }}
                                                >
                                                    {opcao.rotulo}
                                                    {idiomaSelecionado === opcao.valor && <MdCheck size={16} className={styles.iconeCheck} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.campo}>
                                <p className={styles.rotuloCampo}>VLibras:</p>
                                <button
                                    type='button'
                                    className={vlibrasAtivo ? `${styles.toggle} ${styles.toggleAtivo}` : styles.toggle}
                                    onClick={() => setVlibrasAtivo(!vlibrasAtivo)}
                                >
                                    <MdAccessibility size={16} />
                                    {vlibrasAtivo ? 'Ativado' : 'Desativado'}
                                    <span className={styles.bolinhaToggle} />
                                </button>
                            </div>

                            <div className={styles.campo}>
                                <p className={styles.rotuloCampo}>Theme:</p>
                                <div className={styles.dropdownConteiner}>
                                    <button
                                        type='button'
                                        className={styles.selectFalso}
                                        onClick={() => setDropdownTemaAberto(!dropdownTemaAberto)}
                                    >
                                        {opcoesTema.find((opcao) => opcao.valor === temaSelecionado)?.icone}
                                        {opcoesTema.find((opcao) => opcao.valor === temaSelecionado)?.rotulo}
                                        <MdExpandMore size={18} className={styles.iconeExpandir} />
                                    </button>

                                    {dropdownTemaAberto && (
                                        <div className={styles.listaDropdown}>
                                            {opcoesTema.map((opcao) => (
                                                <button
                                                    key={opcao.valor}
                                                    type='button'
                                                    className={styles.itemDropdown}
                                                    onClick={() => {
                                                        setTemaSelecionado(opcao.valor)
                                                        setDropdownTemaAberto(false)
                                                    }}
                                                >
                                                    {opcao.icone}
                                                    {opcao.rotulo}
                                                    {temaSelecionado === opcao.valor && <MdCheck size={16} className={styles.iconeCheck} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            )}

            {abaAtiva === 'financial' && (
                <form className={styles.cardConteudo} onSubmit={formFinancial.handleSubmit(salvarFinancial)}>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Monthly Income:</p>
                        <input
                            {...formFinancial.register('rendaMensal')}
                            className={styles.input}
                            placeholder='ex. R$ 4200,17'
                        />
                        {formFinancial.formState.errors.rendaMensal && (
                            <p className={styles.erro}>{formFinancial.formState.errors.rendaMensal.message}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Work Hours per Month:</p>
                        <input
                            {...formFinancial.register('horasTrabalhadas')}
                            className={styles.input}
                            placeholder='ex. 160'
                        />
                        {formFinancial.formState.errors.horasTrabalhadas && (
                            <p className={styles.erro}>{formFinancial.formState.errors.horasTrabalhadas.message}</p>
                        )}
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Currency type:</p>
                        <div className={styles.selectFalso}>R$</div>
                    </div>

                    <button type='submit' className={styles.botaoSalvar}>Save Changes</button>

                </form>
            )}

            {abaAtiva === 'about' && (
                <div className={styles.cardConteudo}>

                    <p className={styles.descricaoSobre}>
                        MindCash é um aplicativo de controle financeiro pessoal que integra análise emocional
                        e a percepção do dinheiro como tempo de vida, desenvolvido como Trabalho de Conclusão
                        de Curso (TCC) do Técnico em Desenvolvimento de Sistemas da Etec de Hortolândia.
                    </p>

                    <div className={styles.listaIntegrantes}>
                        {integrantes.map((integrante) => (
                            <div key={integrante.nome} className={styles.itemIntegrante}>
                                <div className={styles.avatarPlaceholder} />
                                <p className={styles.nomeIntegrante}>{integrante.nome}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.infoVersao}>
                        <p className={styles.rotuloVersao}>Version:</p>
                        <p className={styles.valorVersao}>1.0.0</p>
                    </div>

                </div>
            )}

        </div>
    )
}
import styles from './Configuracoes.module.css'
import fotoVictor from '../../assets/imagens/victor.jpeg'
import fotoPerola from '../../assets/imagens/perola.jpeg'
import fotoKlayton from '../../assets/imagens/klayton.jpeg'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TemaContexto } from '../../contexts/TemaContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import {
    MdLanguage,
    MdAccessibility,
    MdLightMode,
    MdDarkMode,
    MdExpandMore,
    MdCheck,
} from 'react-icons/md'
import { ModalMensagem } from '../../components/ModalMensagem'

type AbaConfiguracao = 'preferences' | 'financial' | 'about'

type FinancialFormValues = {
    rendaMensal: string
    horasTrabalhadas: string
}

const versao = import.meta.env.PACKAGE_VERSION

const financialSchema = z.object({
    rendaMensal: z.string().min(1, { message: 'Informe sua renda mensal.' }),
    horasTrabalhadas: z.string().min(1, { message: 'Informe sua carga horária mensal.' }),
})

const categorias = [
    { nome: 'Entretenimento', cor: 'var(--categoria-entretenimento)' },
    { nome: 'Software', cor: 'var(--categoria-software)' },
    { nome: 'Compras', cor: 'var(--categoria-compras)' },
    { nome: 'Utilidades', cor: 'var(--categoria-utilidades)' },
    { nome: 'Alimentação', cor: 'var(--categoria-alimentacao)' },
    { nome: 'Saúde', cor: 'var(--categoria-saude)' },
    { nome: 'Educação', cor: 'var(--categoria-educacao)' },
]

const integrantes = [
    { nome: 'Victor Canissaris Furlan', foto: fotoVictor },
    { nome: 'Pérola Evellyn Daltro Figueiredo', foto: fotoPerola },
    { nome: 'Klayton Harlen Mendes Souza', foto: fotoKlayton },
]

const opcoesTema = [
    { valor: 'claro' as const, rotulo: 'Claro', icone: <MdLightMode size={18} /> },
    { valor: 'escuro' as const, rotulo: 'Escuro', icone: <MdDarkMode size={18} /> },
]

const opcoesIdioma = [
    { valor: 'pt' as const, rotulo: 'Português' },
    { valor: 'en' as const, rotulo: 'Inglês' },
]

export function Configuracoes() {

    const { tema, alterarTema } = useContext(TemaContexto)
    const { rendaMensalContexto, cargaHorariaContexto, setRendaMensalContexto, setCargaHorariaContexto } = useContext(BaseFinanceiraContexto)

    const [abaAtiva, setAbaAtiva] = useState<AbaConfiguracao>('financial')
    const [vlibrasAtivo, setVlibrasAtivo] = useState(false)

    const [temaSelecionado, setTemaSelecionado] = useState(tema)
    const [dropdownTemaAberto, setDropdownTemaAberto] = useState(false)

    const [idiomaSelecionado, setIdiomaSelecionado] = useState<'pt' | 'en'>('en')
    const [dropdownIdiomaAberto, setDropdownIdiomaAberto] = useState(false)

    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')

    const formFinancial = useForm<FinancialFormValues>({
        resolver: zodResolver(financialSchema),
        defaultValues: {
            rendaMensal: rendaMensalContexto > 0 ? String(rendaMensalContexto) : '',
            horasTrabalhadas: cargaHorariaContexto > 0 ? String(cargaHorariaContexto) : '',
        },
    })

    const exibirModal = (titulo: string) => {
        setModalMensagemTitulo(titulo)
        setModalMensagemTexto('Alterações salvas com sucesso!')
        setModalMensagemVisivel(true)
    }

    const ocultarModal = () => {
        setModalMensagemVisivel(false)
    }

    const salvarFinancial = (data: FinancialFormValues) => {
        setRendaMensalContexto(Number(data.rendaMensal))
        setCargaHorariaContexto(Number(data.horasTrabalhadas))
        exibirModal('Financeiro')
    }

    const tituloAba: Record<AbaConfiguracao, string> = {
        preferences: 'Preferências',
        financial: 'Financeiro',
        about: 'Sobre',
    }

    return(
        <div className={styles.conteiner}>
            <div className={styles.areaConteudo}>

                <section className={styles.cabecalho}>
                    <h1 className={styles.titulo}>Configurações</h1>
                    <p className={styles.subtitulo}>{tituloAba[abaAtiva]}</p>
                </section>

                <div className={styles.abas}>
                    <button
                        className={abaAtiva === 'financial' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('financial')}
                    >
                        Financeiro
                    </button>
                    <button
                        className={abaAtiva === 'preferences' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('preferences')}
                    >
                        Preferências
                    </button>
                    <button
                        className={abaAtiva === 'about' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('about')}
                    >
                        Sobre
                    </button>
                </div>

                {abaAtiva === 'preferences' && (
                    <div className={styles.cardConteudo}>
                        <div className={styles.gridPreferencias}>

                            <div className={styles.colunaCategorias}>
                                <p className={styles.rotuloCampo}>Cores das categorias:</p>
                                <div className={styles.listaCategorias}>
                                    {categorias.map((categoria) => (
                                        <div key={categoria.nome} className={styles.itemCategoria}>
                                            <span className={styles.amostraCor} style={{ backgroundColor: categoria.cor }} />
                                            <p className={styles.nomeCategoria}>{categoria.nome}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.colunaOpcoes}>

                                <div className={styles.campo}>
                                    <p className={styles.rotuloCampo}>Idioma:</p>
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
                                    <p className={styles.rotuloCampo}>Tema:</p>
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
                                                            if (opcao.valor !== tema) {
                                                                alterarTema()
                                                            }
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
                            <p className={styles.rotuloCampo}>Renda Mensal:</p>
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
                            <p className={styles.rotuloCampo}>Horas de Trabalho por Mês:</p>
                            <input
                                {...formFinancial.register('horasTrabalhadas')}
                                className={styles.input}
                                placeholder='ex. 160'
                            />
                            {formFinancial.formState.errors.horasTrabalhadas && (
                                <p className={styles.erro}>{formFinancial.formState.errors.horasTrabalhadas.message}</p>
                            )}
                        </div>

                        <button type='submit' className={styles.botaoSalvar}>Salvar Alterações</button>

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
                                    <img
                                        src={integrante.foto}
                                        className={styles.avatarFoto}
                                        style={integrante.nome.includes('Victor') ? { objectPosition: 'center 30%' } : undefined}
                                        alt={integrante.nome}
                                    />
                                    <p className={styles.nomeIntegrante}>{integrante.nome}</p>
                                </div>
                            ))}
                        </div>

                        <div className={styles.infoVersao}>
                            <p className={styles.rotuloVersao}>Versão:</p>
                            <p className={styles.valorVersao}>{versao}</p>
                        </div>

                    </div>
                )}

            </div>

            <ModalMensagem
                exibir={modalMensagemVisivel}
                ocultar={() => ocultarModal()}
                titulo={modalMensagemTitulo}
                texto={modalMensagemTexto}
            />

        </div>
    )
}
import styles from './Configuracoes.module.css'
import fotoVictor from '../../assets/imagens/victor.jpeg'
import fotoPerola from '../../assets/imagens/perola.jpeg'
import fotoKlayton from '../../assets/imagens/klayton.jpeg'
import { useContext, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TemaContexto } from '../../contexts/TemaContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { UsuarioContexto, type CorHSL } from '../../contexts/UsuarioContexto'
import { HslColorPicker } from 'react-colorful'
import {
    MdLanguage,
    MdAccessibility,
    MdLightMode,
    MdDarkMode,
    MdExpandMore,
    MdCheck,
} from 'react-icons/md'
import { ModalMensagem } from '../../components/ModalMensagem'

declare global {
    interface Window {
        VLibras: {
            Widget: new (url: string) => void
        }
    }
}

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

const variavelCSS: Record<string, string> = {
    'Entretenimento': '--categoria-entretenimento',
    'Software': '--categoria-software',
    'Compras': '--categoria-compras',
    'Utilidades': '--categoria-utilidades',
    'Alimentação': '--categoria-alimentacao',
    'Saúde': '--categoria-saude',
    'Educação': '--categoria-educacao',
}

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
    const { coresCategorias, atualizarCorCategoria } = useContext(UsuarioContexto)

    const [abaAtiva, setAbaAtiva] = useState<AbaConfiguracao>('financial')
    const [vlibrasAtivo, setVlibrasAtivo] = useState(() => localStorage.getItem('vlibras') === 'true')
    const [temaSelecionado, setTemaSelecionado] = useState(tema)
    const [dropdownTemaAberto, setDropdownTemaAberto] = useState(false)
    const [idiomaSelecionado, setIdiomaSelecionado] = useState<'pt' | 'en'>('pt')
    const [dropdownIdiomaAberto, setDropdownIdiomaAberto] = useState(false)
    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')
    const [modalMensagemTipo, setModalMensagemTipo] = useState<'sucesso' | 'erro'>('sucesso')
    const [categoriaEditando, setCategoriaEditando] = useState<string | null>(null)
    const [corTemp, setCorTemp] = useState<CorHSL>({ h: 0, s: 100, l: 88 })

    useEffect(() => {
        localStorage.setItem('vlibras', String(vlibrasAtivo))
        const widget = document.getElementById('vlibras-widget')
        if (widget) widget.style.display = vlibrasAtivo ? 'block' : 'none'
        const wrapper = document.getElementById('vlibras-access-wrapper')
        if (wrapper) wrapper.style.display = vlibrasAtivo ? 'block' : 'none'
    }, [vlibrasAtivo])

    const formFinancial = useForm<FinancialFormValues>({
        resolver: zodResolver(financialSchema),
        defaultValues: {
            rendaMensal: rendaMensalContexto > 0 ? String(rendaMensalContexto) : '',
            horasTrabalhadas: cargaHorariaContexto > 0 ? String(cargaHorariaContexto) : '',
        },
    })

    const ocultarModal = () => setModalMensagemVisivel(false)

    const salvarFinancial = async (data: FinancialFormValues) => {
        try {
            await setRendaMensalContexto(Number(data.rendaMensal))
            await setCargaHorariaContexto(Number(data.horasTrabalhadas))
            setModalMensagemTipo('sucesso')
            setModalMensagemTexto('Alterações salvas com sucesso!')
        } catch {
            setModalMensagemTipo('erro')
            setModalMensagemTexto('Erro ao salvar. Tente novamente.')
        }
        setModalMensagemTitulo('Financeiro')
        setModalMensagemVisivel(true)
    }

    const abrirEditor = (categoria: string) => {
        setCategoriaEditando(categoria)
        setCorTemp(coresCategorias[categoria])
    }

    const cancelarEdicao = () => setCategoriaEditando(null)

    const salvarEdicao = async () => {
        if (!categoriaEditando) return
        await atualizarCorCategoria(categoriaEditando, corTemp)
        setCategoriaEditando(null)
    }

    const tituloAba: Record<AbaConfiguracao, string> = {
        preferences: 'Preferências',
        financial: 'Financeiro',
        about: 'Sobre',
    }

    //função criada apenas para avisar pro usuario que a função de idiomas ainda não funciona, depois que estiver funcionando ela será apagada
    const modalNaoFunciona = () => {
        setModalMensagemTexto("Desculpe\n Esta funcionalidade ainda está em desenvolvimento")
        setModalMensagemTitulo("Ainda em desenvolvimento")
        setModalMensagemTipo('erro')
        setModalMensagemVisivel(true)
    }

    return (
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
                                    {Object.keys(variavelCSS).map((categoria) => (
                                        <div key={categoria} className={styles.itemCategoria}>
                                            <button
                                                className={styles.amostraCor}
                                                style={{ backgroundColor: `var(${variavelCSS[categoria]})` }}
                                                onClick={() => abrirEditor(categoria)}
                                            />
                                            <p className={styles.nomeCategoria}>{categoria}</p>

                                            {categoriaEditando === categoria && (
                                                <div className={styles.popoverCor}>
                                                    <HslColorPicker
                                                        color={corTemp}
                                                        onChange={setCorTemp}
                                                    />
                                                    <div className={styles.botoesPopover}>
                                                        <button className={styles.botaoCancelarCor} onClick={cancelarEdicao}>
                                                            Cancelar
                                                        </button>
                                                        <button className={styles.botaoSalvarCor} onClick={salvarEdicao}>
                                                            Salvar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
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
                                            {opcoesIdioma.find((o) => o.valor === idiomaSelecionado)?.rotulo}
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
                                                            //a linha de baixo volta quando a opção de idiomas estiver funcionando
                                                            //setIdiomaSelecionado(opcao.valor)
                                                            modalNaoFunciona()
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
                                            {opcoesTema.find((o) => o.valor === temaSelecionado)?.icone}
                                            {opcoesTema.find((o) => o.valor === temaSelecionado)?.rotulo}
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
                                                            if (opcao.valor !== tema) alterarTema()
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
                ocultar={ocultarModal}
                titulo={modalMensagemTitulo}
                texto={modalMensagemTexto}
                tipo={modalMensagemTipo}
            />

        </div>
    )
}
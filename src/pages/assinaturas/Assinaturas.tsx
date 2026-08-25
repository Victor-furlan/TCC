import styles from './Assinaturas.module.css'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import {
    MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdCheck,
    MdSchedule, MdFolder, MdFolderOpen, MdCheckBox, MdCheckBoxOutlineBlank,
    MdIndeterminateCheckBox, MdClose, MdDriveFileMove
} from 'react-icons/md'
import { AssinaturasContexto } from '../../contexts/AssinaturasContexto'
import { PastasContexto } from '../../contexts/PastasContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { calcularHorasDeVida } from '../../utils/CalcularHorasDeVida'
import { ModalCriarPasta } from '../../components/pastas/ModalCriarPasta'
import { ModalMoverPasta } from '../../components/pastas/ModalMoverPasta'

const coresCategorias: Record<string, string> = {
    'Entretenimento': 'var(--categoria-entretenimento)',
    'Software': 'var(--categoria-software)',
    'Compras': 'var(--categoria-compras)',
    'Utilidades': 'var(--categoria-utilidades)',
    'Alimentação': 'var(--categoria-alimentacao)',
    'Saúde': 'var(--categoria-saude)',
    'Educação': 'var(--categoria-educacao)',
}

const corPadrao = '#E9F6FF'
const categorias = ['Entretenimento', 'Software', 'Compras', 'Utilidades', 'Alimentação', 'Saúde', 'Educação']

export function Assinaturas() {

    const { assinaturas, removerAssinatura, moverParaPasta, liberarAssinaturasDaPasta } = useContext(AssinaturasContexto)
    const { pastas, removerPasta } = useContext(PastasContexto)
    const { rendaMensalContexto, cargaHorariaContexto } = useContext(BaseFinanceiraContexto)

    const [busca, setBusca] = useState('')
    const [categoriaFiltro, setCategoriaFiltro] = useState('')
    const [dropdownFiltroAberto, setDropdownFiltroAberto] = useState(false)
    const [idsSelecionados, setIdsSelecionados] = useState<Set<string>>(new Set())
    const [pastasAbertas, setPastasAbertas] = useState<Set<string>>(new Set())
    const [modalCriarPastaAberto, setModalCriarPastaAberto] = useState(false)
    const [modalMoverPastaAberto, setModalMoverPastaAberto] = useState(false)

    const assinaturasFiltradas = assinaturas.filter((a) => {
        const buscaOk = a.nome.toLowerCase().includes(busca.toLowerCase())
        const categoriaOk = categoriaFiltro === '' || a.categoria === categoriaFiltro
        return buscaOk && categoriaOk
    })

    const custoMensalTotal = assinaturas.reduce((soma, a) => {
        if (a.periodicidade === 'anual') return soma + (a.valor / 12)
        if (a.periodicidade === 'semanal') return soma + (a.valor * 4)
        return soma + a.valor
    }, 0)

    const custoAnual = custoMensalTotal * 12
    const baseFinanceiraPreenchida = rendaMensalContexto > 0 && cargaHorariaContexto > 0

    const formatarMoeda = (valor: number) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const formatarHoras = (horas: number) => {
        if (horas < 1) return `≈ ${Math.round(horas * 60)} min`
        return `≈ ${horas.toFixed(1)}h`
    }

    const formatarData = (data: string) => {
        if (!data) return ''
        const [ano, mes, dia] = data.split('-')
        return `${dia}/${mes}/${ano}`
    }

    const escolherCategoria = (categoria: string) => {
        setCategoriaFiltro(categoria === categoriaFiltro ? '' : categoria)
        setDropdownFiltroAberto(false)
    }

    const toggleSelecionado = (id: string) => {
        setIdsSelecionados((atual) => {
            const novo = new Set(atual)
            if (novo.has(id)) novo.delete(id)
            else novo.add(id)
            return novo
        })
    }

    const toggleTodos = () => {
        if (idsSelecionados.size === assinaturasFiltradas.length) {
            setIdsSelecionados(new Set())
        } else {
            setIdsSelecionados(new Set(assinaturasFiltradas.map((a) => a.id)))
        }
    }

    const togglePasta = (pastaId: string) => {
        setPastasAbertas((atual) => {
            const novo = new Set(atual)
            if (novo.has(pastaId)) novo.delete(pastaId)
            else novo.add(pastaId)
            return novo
        })
    }

    const limparSelecao = () => setIdsSelecionados(new Set())

    const excluirSelecionados = async () => {
        for (const id of idsSelecionados) {
            await removerAssinatura(id)
        }
        limparSelecao()
    }

    const handleMover = async (pastaId: string | null) => {
        for (const id of idsSelecionados) {
            await moverParaPasta(id, pastaId)
        }
        setModalMoverPastaAberto(false)
        limparSelecao()
    }

    const algumSelecionadoTemPasta = Array.from(idsSelecionados).some(
        (id) => assinaturas.find((a) => a.id === id)?.pastaId != null
    )

    const estadoCheckboxGeral =
        idsSelecionados.size === 0 ? 'vazio' :
        idsSelecionados.size === assinaturasFiltradas.length ? 'cheio' : 'indeterminado'

    const assinaturasSemPasta = assinaturasFiltradas.filter((a) => !a.pastaId)

    return (
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Assinaturas</h1>
                    <p className={styles.subtitulo}>Gerencie suas despesas recorrentes</p>
                </div>
                <div className={styles.botoesHeader}>
                    <button className={styles.botaoNovaPasta} onClick={() => setModalCriarPastaAberto(true)}>
                        <MdFolder size={18} />
                        Nova Pasta
                    </button>
                    <Link className={styles.botaoAdicionar} to='/assinaturas/nova'>
                        <MdAdd size={20} />
                        Adicionar Assinatura
                    </Link>
                </div>
            </section>

            <section className={styles.cardBusca}>
                <div className={styles.campoBusca}>
                    <MdSearch size={20} className={styles.iconeBusca} />
                    <input
                        className={styles.input}
                        placeholder='Buscar assinaturas...'
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
                <div className={styles.dropdownFiltroConteiner}>
                    <button
                        className={`${styles.botaoFiltro} ${categoriaFiltro ? styles.botaoFiltroAtivo : ''}`}
                        onClick={() => setDropdownFiltroAberto(!dropdownFiltroAberto)}
                    >
                        <MdFilterList size={18} />
                        {categoriaFiltro || 'Todas as Categorias'}
                    </button>
                    {dropdownFiltroAberto && (
                        <div className={styles.listaDropdownFiltro}>
                            <p className={styles.tituloDropdownFiltro}>Categorias</p>
                            <button className={styles.itemDropdownFiltro} onClick={() => escolherCategoria('')}>
                                Todas
                                {categoriaFiltro === '' && <MdCheck size={16} className={styles.iconeCheck} />}
                            </button>
                            {categorias.map((cat) => (
                                <button key={cat} className={styles.itemDropdownFiltro} onClick={() => escolherCategoria(cat)}>
                                    {cat}
                                    {categoriaFiltro === cat && <MdCheck size={16} className={styles.iconeCheck} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.cardsMetricas}>
                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Assinaturas Ativas</p>
                    <p className={styles.valorMetrica}>{assinaturas.length}</p>
                </div>
                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Custo Mensal Total</p>
                    <p className={styles.valorMetrica}>{formatarMoeda(custoMensalTotal)}</p>
                </div>
                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Custo Anual</p>
                    <p className={styles.valorMetrica}>{formatarMoeda(custoAnual)}</p>
                </div>
            </section>

            <section className={styles.cardLista}>

                <div className={styles.cabecalhoLista}>
                    <div className={styles.ladoEsquerdoCabecalho}>
                        <button className={styles.botaoCheckbox} onClick={toggleTodos}>
                            {estadoCheckboxGeral === 'cheio' && <MdCheckBox size={20} className={styles.iconeCheckboxAtivo} />}
                            {estadoCheckboxGeral === 'indeterminado' && <MdIndeterminateCheckBox size={20} className={styles.iconeCheckboxAtivo} />}
                            {estadoCheckboxGeral === 'vazio' && <MdCheckBoxOutlineBlank size={20} />}
                        </button>
                        <p className={styles.tituloSecao}>Suas Assinaturas</p>
                    </div>

                    {idsSelecionados.size > 0 && (
                        <div className={styles.barraAcoes}>
                            <span className={styles.contadorSelecionados}>{idsSelecionados.size} selecionada{idsSelecionados.size > 1 ? 's' : ''}</span>
                            <button className={styles.botaoAcao} onClick={() => setModalMoverPastaAberto(true)}>
                                <MdDriveFileMove size={18} />
                                Mover
                            </button>
                            {algumSelecionadoTemPasta && (
                                <button className={styles.botaoAcao} onClick={() => handleMover(null)}>
                                    <MdFolderOpen size={18} />
                                    Remover da pasta
                                </button>
                            )}
                            <button className={`${styles.botaoAcao} ${styles.botaoAcaoExcluir}`} onClick={excluirSelecionados}>
                                <MdDelete size={18} />
                                Excluir
                            </button>
                            <button className={styles.botaoAcao} onClick={limparSelecao}>
                                <MdClose size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {assinaturas.length === 0 ? (
                    <p className={styles.textoVazio}>Nenhuma assinatura cadastrada ainda.</p>
                ) : assinaturasFiltradas.length === 0 ? (
                    <p className={styles.textoVazio}>Nenhuma assinatura encontrada para essa busca.</p>
                ) : (
                    <div className={styles.listaAssinaturas}>

                        {pastas.map((pasta) => {
                            const assinaturasDaPasta = assinaturasFiltradas.filter((a) => a.pastaId === pasta.id)
                            const aberta = pastasAbertas.has(pasta.id)

                            return (
                                <div key={pasta.id} className={styles.grupoPasta}>
                                    <div className={styles.cabecalhoPasta}>
                                        <button className={styles.botaoPasta} onClick={() => togglePasta(pasta.id)}>
                                            {aberta
                                                ? <MdFolderOpen size={20} style={{ color: pasta.cor, flexShrink: 0 }} />
                                                : <MdFolder size={20} style={{ color: pasta.cor, flexShrink: 0 }} />
                                            }
                                            <span className={styles.nomePasta}>{pasta.nome}</span>
                                            <span className={styles.contadorPasta}>{assinaturasDaPasta.length}</span>
                                        </button>
                                        <button
                                            className={styles.botaoExcluirPasta}
                                            onClick={() => removerPasta(pasta.id, liberarAssinaturasDaPasta)}
                                            title='Excluir pasta'
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    </div>

                                    {aberta && assinaturasDaPasta.length > 0 && (
                                        <div className={styles.assinaturasDaPasta}>
                                            {assinaturasDaPasta.map((assinatura) => (
                                                <ItemAssinatura
                                                    key={assinatura.id}
                                                    assinatura={assinatura}
                                                    selecionado={idsSelecionados.has(assinatura.id)}
                                                    onToggle={() => toggleSelecionado(assinatura.id)}
                                                    onRemover={() => removerAssinatura(assinatura.id)}
                                                    baseFinanceiraPreenchida={baseFinanceiraPreenchida}
                                                    rendaMensal={rendaMensalContexto}
                                                    cargaHoraria={cargaHorariaContexto}
                                                    formatarMoeda={formatarMoeda}
                                                    formatarHoras={formatarHoras}
                                                    formatarData={formatarData}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {assinaturasSemPasta.length > 0 && (
                            <div className={styles.grupoSemPasta}>
                                {pastas.length > 0 && (
                                    <p className={styles.labelSemPasta}>Sem pasta</p>
                                )}
                                {assinaturasSemPasta.map((assinatura) => (
                                    <ItemAssinatura
                                        key={assinatura.id}
                                        assinatura={assinatura}
                                        selecionado={idsSelecionados.has(assinatura.id)}
                                        onToggle={() => toggleSelecionado(assinatura.id)}
                                        onRemover={() => removerAssinatura(assinatura.id)}
                                        baseFinanceiraPreenchida={baseFinanceiraPreenchida}
                                        rendaMensal={rendaMensalContexto}
                                        cargaHoraria={cargaHorariaContexto}
                                        formatarMoeda={formatarMoeda}
                                        formatarHoras={formatarHoras}
                                        formatarData={formatarData}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                )}
            </section>

            {modalCriarPastaAberto && (
                <ModalCriarPasta onFechar={() => setModalCriarPastaAberto(false)} />
            )}

            {modalMoverPastaAberto && (
                <ModalMoverPasta
                    idsSelecionados={Array.from(idsSelecionados)}
                    onFechar={() => setModalMoverPastaAberto(false)}
                    onMover={handleMover}
                    onAbrirCriarPasta={() => {
                        setModalMoverPastaAberto(false)
                        setModalCriarPastaAberto(true)
                    }}
                />
            )}

        </div>
    )
}

// ─── Componente interno ────────────────────────────────────────────────────────

interface ItemAssinaturaProps {
    assinatura: {
        id: string
        nome: string
        valor: number
        periodicidade: string
        categoria: string
        proximaCobranca: string
    }
    selecionado: boolean
    onToggle: () => void
    onRemover: () => void
    baseFinanceiraPreenchida: boolean
    rendaMensal: number
    cargaHoraria: number
    formatarMoeda: (v: number) => string
    formatarHoras: (v: number) => string
    formatarData: (v: string) => string
}

function ItemAssinatura({
    assinatura, selecionado, onToggle, onRemover,
    baseFinanceiraPreenchida, rendaMensal, cargaHoraria,
    formatarMoeda, formatarHoras, formatarData
}: ItemAssinaturaProps) {
    return (
        <div className={`${styles.itemAssinatura} ${selecionado ? styles.itemSelecionado : ''}`}>
            <button className={styles.botaoCheckbox} onClick={onToggle}>
                {selecionado
                    ? <MdCheckBox size={20} className={styles.iconeCheckboxAtivo} />
                    : <MdCheckBoxOutlineBlank size={20} />
                }
            </button>

            <div
                className={styles.iconeInicial}
                style={{ backgroundColor: coresCategorias[assinatura.categoria] || corPadrao }}
            >
                {assinatura.nome.charAt(0).toUpperCase()}
            </div>

            <div className={styles.infoAssinatura}>
                <div className={styles.linhaNomeCategoria}>
                    <p className={styles.nomeAssinatura}>{assinatura.nome}</p>
                    <span className={styles.tagCategoria}>{assinatura.categoria}</span>
                </div>
                <p className={styles.proximaCobranca}>
                    Próxima cobrança: {formatarData(assinatura.proximaCobranca)}
                </p>
            </div>

            <div className={styles.valorPeriodicidade}>
                <p className={styles.valorAssinatura}>{formatarMoeda(assinatura.valor)}</p>
                <p className={styles.periodicidadeAssinatura}>{assinatura.periodicidade}</p>
                {baseFinanceiraPreenchida && (
                    <p className={styles.horasDeVida}>
                        <MdSchedule size={14} />
                        {formatarHoras(calcularHorasDeVida(assinatura.valor, rendaMensal, cargaHoraria))}
                    </p>
                )}
            </div>

            <div className={styles.acoesAssinatura}>
                <Link className={styles.botaoIcone} to={`/assinaturas/editar/${assinatura.id}`}>
                    <MdEdit size={18} />
                </Link>
                <button className={styles.botaoIcone} onClick={onRemover}>
                    <MdDelete size={18} />
                </button>
            </div>
        </div>
    )
}
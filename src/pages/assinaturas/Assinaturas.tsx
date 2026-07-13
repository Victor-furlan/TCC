import styles from './Assinaturas.module.css'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdCheck, MdSchedule } from 'react-icons/md'
import { AssinaturasContexto } from '../../contexts/AssinaturasContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { calcularHorasDeVida } from '../../utils/CalcularHorasDeVida'

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

    const { assinaturas, removerAssinatura } = useContext(AssinaturasContexto)
    const { rendaMensalContexto, cargaHorariaContexto } = useContext(BaseFinanceiraContexto)

    const [busca, setBusca] = useState('')
    const [categoriaFiltro, setCategoriaFiltro] = useState('')
    const [dropdownFiltroAberto, setDropdownFiltroAberto] = useState(false)

    const assinaturasFiltradas = assinaturas.filter((assinatura) => {
        const buscaOk = assinatura.nome.toLowerCase().includes(busca.toLowerCase())
        const categoriaOk = categoriaFiltro === '' || assinatura.categoria === categoriaFiltro
        return buscaOk && categoriaOk
    })

    const custoMensalTotal = assinaturas.reduce((soma, assinatura) => {
        if (assinatura.periodicidade === 'Anual') return soma + (assinatura.valor / 12)
        if (assinatura.periodicidade === 'Semanal') return soma + (assinatura.valor * 4)
        return soma + assinatura.valor
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

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Assinaturas</h1>
                    <p className={styles.subtitulo}>Gerencie suas despesas recorrentes</p>
                </div>

                <Link className={styles.botaoAdicionar} to='/assinaturas/nova'>
                    <MdAdd size={20} />
                    Adicionar Assinatura
                </Link>
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
                            <button
                                className={styles.itemDropdownFiltro}
                                onClick={() => escolherCategoria('')}
                            >
                                Todas
                                {categoriaFiltro === '' && <MdCheck size={16} className={styles.iconeCheck} />}
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat}
                                    className={styles.itemDropdownFiltro}
                                    onClick={() => escolherCategoria(cat)}
                                >
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
                <p className={styles.tituloSecao}>Suas Assinaturas</p>

                {assinaturas.length === 0 ? (
                    <p className={styles.textoVazio}>Nenhuma assinatura cadastrada ainda.</p>
                ) : assinaturasFiltradas.length === 0 ? (
                    <p className={styles.textoVazio}>Nenhuma assinatura encontrada para essa busca.</p>
                ) : (
                    <div className={styles.listaAssinaturas}>
                        {assinaturasFiltradas.map((assinatura) => (
                            <div key={assinatura.id} className={styles.itemAssinatura}>

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
                                            {formatarHoras(calcularHorasDeVida(assinatura.valor, rendaMensalContexto, cargaHorariaContexto))}
                                        </p>
                                    )}
                                </div>

                                <div className={styles.acoesAssinatura}>
                                    <Link className={styles.botaoIcone} to={`/assinaturas/editar/${assinatura.id}`}>
                                        <MdEdit size={18} />
                                    </Link>
                                    <button
                                        className={styles.botaoIcone}
                                        onClick={() => removerAssinatura(assinatura.id)}
                                    >
                                        <MdDelete size={18} />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}
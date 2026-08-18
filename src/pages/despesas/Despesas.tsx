import styles from './Despesas.module.css'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { MdAdd, MdShoppingBag, MdEdit, MdDelete, MdSchedule, MdChevronLeft, MdChevronRight, MdCalendarMonth, MdVisibility } from 'react-icons/md'
import { DespesasContexto } from '../../contexts/DespesasContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { calcularHorasDeVida } from '../../utils/CalcularHorasDeVida'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

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

export function Despesas() {

    const { despesas, removerDespesa } = useContext(DespesasContexto)
    const { rendaMensalContexto, cargaHorariaContexto } = useContext(BaseFinanceiraContexto)

    const baseFinanceiraPreenchida = rendaMensalContexto > 0 && cargaHorariaContexto > 0

    const dataAtual = new Date()
    const [mesSelecionado, setMesSelecionado] = useState(dataAtual.getMonth())
    const [anoSelecionado, setAnoSelecionado] = useState(dataAtual.getFullYear())
    const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null)
    const [calendarioAberto, setCalendarioAberto] = useState(false)

    const ehMesAtual = mesSelecionado === dataAtual.getMonth() && anoSelecionado === dataAtual.getFullYear()

    const irParaMesAnterior = () => {
        if (mesSelecionado === 0) {
            setMesSelecionado(11)
            setAnoSelecionado(anoSelecionado - 1)
        } else {
            setMesSelecionado(mesSelecionado - 1)
        }
        setDiaSelecionado(null)
    }

    const irParaProximoMes = () => {
        if (mesSelecionado === 11) {
            setMesSelecionado(0)
            setAnoSelecionado(anoSelecionado + 1)
        } else {
            setMesSelecionado(mesSelecionado + 1)
        }
        setDiaSelecionado(null)
    }

    const aoSelecionarData = (data: Date) => {
        setMesSelecionado(data.getMonth())
        setAnoSelecionado(data.getFullYear())
        setDiaSelecionado(data.getDate())
        setCalendarioAberto(false)
    }

    const despesasFiltradas = despesas.filter((despesa) => {
        const [ano, mes, dia] = despesa.data.split('-').map(Number)
        const mesOk = mes - 1 === mesSelecionado && ano === anoSelecionado
        if (diaSelecionado) return mesOk && dia === diaSelecionado
        return mesOk
    })

    const totalGasto = despesasFiltradas.reduce((soma, despesa) => soma + despesa.valor, 0)
    const quantidadeDespesas = despesasFiltradas.length
    const mediaGasto = quantidadeDespesas > 0 ? totalGasto / quantidadeDespesas : 0

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

    const labelPeriodo = diaSelecionado
        ? `${String(diaSelecionado).padStart(2, '0')}/${String(mesSelecionado + 1).padStart(2, '0')}/${anoSelecionado}`
        : `${meses[mesSelecionado]} ${anoSelecionado}`

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Gastos Variáveis</h1>
                    <p className={styles.subtitulo}>Acompanhe despesas pontuais e monitore seus padrões de gastos</p>
                </div>

                {ehMesAtual && (
                    <Link className={styles.botaoAdicionar} to='/despesas/nova'>
                        <MdAdd size={20} />
                        Adicionar Despesa
                    </Link>
                )}
            </section>

            <section className={styles.cardResumo}>
                <div className={styles.cabecalhoResumo}>
                    <p className={styles.tituloResumo}>Resumo</p>
                    <div className={styles.navegacaoMes}>
                        <button className={styles.botaoMes} onClick={irParaMesAnterior}>
                            <MdChevronLeft size={22} />
                        </button>

                        <div className={styles.conteinerCalendario}>
                            <button
                                className={styles.labelMes}
                                onClick={() => setCalendarioAberto(!calendarioAberto)}
                            >
                                <MdCalendarMonth size={16} />
                                {labelPeriodo}
                            </button>

                            {calendarioAberto && (
                                <div className={styles.dropdownCalendario}>
                                    <Calendar
                                        onChange={(value) => aoSelecionarData(value as Date)}
                                        value={new Date(anoSelecionado, mesSelecionado, diaSelecionado || 1)}
                                        maxDate={dataAtual}
                                        locale='pt-BR'
                                    />
                                    {diaSelecionado && (
                                        <button
                                            className={styles.botaoLimparDia}
                                            onClick={() => { setDiaSelecionado(null); setCalendarioAberto(false) }}
                                        >
                                            Ver mês inteiro
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            className={styles.botaoMes}
                            onClick={irParaProximoMes}
                            disabled={ehMesAtual}
                        >
                            <MdChevronRight size={22} />
                        </button>
                    </div>
                </div>

                <div className={styles.itensResumo}>
                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Total Gasto</p>
                        <p className={styles.valorItem}>{formatarMoeda(totalGasto)}</p>
                    </div>
                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Quantidade de Despesas</p>
                        <p className={styles.valorItem}>{quantidadeDespesas}</p>
                    </div>
                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Média por Gasto</p>
                        <p className={styles.valorItem}>{formatarMoeda(mediaGasto)}</p>
                    </div>
                </div>
            </section>

            <section className={styles.cardHistorico}>
                <div className={styles.cabecalhoHistorico}>
                    <p className={styles.tituloSecao}>Histórico de Despesas</p>
                    {despesasFiltradas.length === 0 && ehMesAtual && (
                        <Link className={styles.botaoAdicionarPrimeira} to='/despesas/nova'>
                            <MdAdd size={18} />
                            Adicionar primeira despesa
                        </Link>
                    )}
                </div>

                {despesasFiltradas.length === 0 ? (
                    <div className={styles.conteudoVazio}>
                        <MdShoppingBag size={56} className={styles.iconeVazio} />
                        <p className={styles.textoVazio}>Nenhum gasto registrado</p>
                        <p className={styles.textoVazioSub}>
                            {ehMesAtual ? 'Comece adicionando seus gastos variáveis' : 'Nenhum gasto registrado neste período'}
                        </p>
                    </div>
                ) : (
                    <div className={styles.listaDespesas}>
                        {despesasFiltradas.map((despesa) => (
                            <div key={despesa.id} className={styles.itemDespesa}>

                                <div
                                    className={styles.iconeInicial}
                                    style={{ backgroundColor: coresCategorias[despesa.categoria] || corPadrao }}
                                >
                                    {despesa.nome.charAt(0).toUpperCase()}
                                </div>

                                <div className={styles.infoDespesa}>
                                    <div className={styles.linhaNomeCategoria}>
                                        <p className={styles.nomeDespesa}>{despesa.nome}</p>
                                        <span className={styles.tagCategoria}>{despesa.categoria}</span>
                                    </div>
                                    <p className={styles.dataDespesa}>{formatarData(despesa.data)}</p>
                                </div>

                                <div className={styles.colunaValor}>
                                    <p className={styles.valorDespesa}>{formatarMoeda(despesa.valor)}</p>
                                    {baseFinanceiraPreenchida && (
                                        <p className={styles.horasDeVida}>
                                            <MdSchedule size={13} />
                                            {formatarHoras(calcularHorasDeVida(despesa.valor, rendaMensalContexto, cargaHorariaContexto))}
                                        </p>
                                    )}
                                </div>

                                <div className={styles.acoesDespesa}>
                                    {ehMesAtual ? (
                                        <>
                                            <Link className={styles.botaoIcone} to={`/despesas/editar/${despesa.id}`}>
                                                <MdEdit size={18} />
                                            </Link>
                                            <button
                                                className={styles.botaoIcone}
                                                onClick={() => removerDespesa(despesa.id)}
                                            >
                                                <MdDelete size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <Link className={styles.botaoIcone} to={`/despesas/visualizar/${despesa.id}`}>
                                            <MdVisibility size={18} />
                                        </Link>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}
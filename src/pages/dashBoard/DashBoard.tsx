import { Link } from 'react-router-dom'
import { useContext } from 'react'
import styles from './DashBoard.module.css'
import { MdCalendarToday, MdAdd, MdSchedule, MdLightbulb } from 'react-icons/md'
import { AssinaturasContexto } from '../../contexts/AssinaturasContexto'
import { DespesasContexto } from '../../contexts/DespesasContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { calcularHorasDeVida } from '../../utils/CalcularHorasDeVida'
import { gerarInsights } from '../../utils/GerarInsights'
import { agregarDadosPorHumor } from '../../utils/AgregarDadosGrafico'
import { GraficoHumorGastos } from '../../components/graficos/graficoHumorGastos/GraficoHumorGastos'

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

export function DashBoard(){

    const { assinaturas } = useContext(AssinaturasContexto)
    const { despesas } = useContext(DespesasContexto)
    const { rendaMensalContexto, cargaHorariaContexto } = useContext(BaseFinanceiraContexto)

    const baseFinanceiraPreenchida = rendaMensalContexto > 0 && cargaHorariaContexto > 0

    const topInsights = gerarInsights(despesas).slice(0, 3)
    const dadosGraficoHumor = agregarDadosPorHumor(despesas)

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

    const diasAteRenovacao = (data: string) => {
        if (!data) return Infinity

        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)

        const [ano, mes, dia] = data.split('-').map(Number)
        const dataRenovacao = new Date(ano, mes - 1, dia)
        dataRenovacao.setHours(0, 0, 0, 0)

        const diferencaMs = dataRenovacao.getTime() - hoje.getTime()
        return Math.round(diferencaMs / (1000 * 60 * 60 * 24))
    }

    const proximasRenovacoes = assinaturas
        .filter((assinatura) => {
            const dias = diasAteRenovacao(assinatura.proximaCobranca)
            return dias >= 0 && dias <= 7
        })
        .sort((a, b) => diasAteRenovacao(a.proximaCobranca) - diasAteRenovacao(b.proximaCobranca))

    const totalAssinaturasMensalizado = assinaturas.reduce((soma, assinatura) => {
        if (assinatura.periodicidade === 'anual') return soma + (assinatura.valor / 12)
        if (assinatura.periodicidade === 'semanal') return soma + (assinatura.valor * 4)
        return soma + assinatura.valor
    }, 0)

    const dataAtual = new Date()
    const despesasDoMes = despesas.filter((despesa) => {
        const [ano, mes] = despesa.data.split('-').map(Number)
        return ano === dataAtual.getFullYear() && mes === dataAtual.getMonth() + 1
    })
    const totalDespesasDoMes = despesasDoMes.reduce((soma, despesa) => soma + despesa.valor, 0)

    const totalDespesasMensais = totalAssinaturasMensalizado + totalDespesasDoMes

    const rendaComprometida = rendaMensalContexto > 0
        ? (totalDespesasMensais / rendaMensalContexto) * 100
        : 0

    const totalHorasDeVida = baseFinanceiraPreenchida
        ? calcularHorasDeVida(totalDespesasMensais, rendaMensalContexto, cargaHorariaContexto)
        : 0

    return(
        <div className={styles.conteiner}>

            <section className={styles.cardsMetricas}>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Total de Despesas Mensais</p>
                    <p className={styles.valorMetrica}>{formatarMoeda(totalDespesasMensais)}</p>
                </div>

                {baseFinanceiraPreenchida && (
                    <div className={styles.cardMetrica}>
                        <p className={styles.tituloMetrica}>Total em Horas de Vida</p>
                        <p className={styles.valorMetrica}>{formatarHoras(totalHorasDeVida)}</p>
                    </div>
                )}

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Renda Comprometida</p>
                    <p className={styles.valorMetrica}>{rendaComprometida.toFixed(0)}%</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Renda Mensal</p>
                    <p className={styles.valorMetrica}>{formatarMoeda(rendaMensalContexto)}</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Próximas Renovações</p>
                    <p className={styles.valorMetrica}>{proximasRenovacoes.length}</p>
                </div>

            </section>

            <section className={styles.painelComportamental}>

                <div className={styles.cardGrafico}>
                    <p className={styles.tituloSecao}>Humor vs Gastos</p>
                    <GraficoHumorGastos dados={dadosGraficoHumor} />
                </div>

                <div className={styles.cardInsights}>
                    <p className={styles.tituloSecao}>Top 3 Insights Automáticos</p>

                    {topInsights.length === 0 ? (
                        <div className={styles.conteudoVazio}>
                            <MdLightbulb size={48} className={styles.iconeVazio} />
                            <p className={styles.textoVazio}>Continue registrando gastos para desbloquear insights</p>
                        </div>
                    ) : (
                        <div className={styles.listaInsights}>
                            {topInsights.map((insight) => (
                                <div key={insight.id} className={styles.itemInsight}>
                                    <MdLightbulb size={18} className={styles.iconeInsight} />
                                    <p className={styles.textoInsight}>{insight.texto}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </section>

            <section className={styles.cardRenovacoes}>
                <div className={styles.cabecalhoRenovacoes}>
                    <p className={styles.tituloSecao}>Próximas Renovações de Assinatura</p>
                    <Link className={styles.botaoAdicionar} to={'/assinaturas/nova'}>
                        <MdAdd size={20} />
                        Adicionar Nova
                    </Link>
                </div>

                {proximasRenovacoes.length === 0 ? (
                    <div className={styles.conteudoVazio}>
                        <MdCalendarToday size={48} className={styles.iconeVazio} />
                        <p className={styles.textoVazio}>Nenhuma renovação nos próximos 7 dias</p>
                    </div>
                ) : (
                    <div className={styles.listaAssinaturas}>
                        {proximasRenovacoes.map((assinatura) => (
                            <div key={assinatura.id} className={styles.itemAssinatura}>

                                <div
                                    className={styles.iconeInicial}
                                    style={{ backgroundColor: coresCategorias[assinatura.categoria] || corPadrao }}
                                >
                                    {assinatura.nome.charAt(0).toUpperCase()}
                                </div>

                                <div className={styles.infoItem}>
                                    <p className={styles.nomeItem}>{assinatura.nome}</p>
                                    <p className={styles.dataItem}>
                                        Renovação em {formatarData(assinatura.proximaCobranca)}
                                    </p>
                                </div>

                                <div className={styles.colunaValor}>
                                    <p className={styles.valorItem}>{formatarMoeda(assinatura.valor)}</p>
                                    {baseFinanceiraPreenchida && (
                                        <p className={styles.horasDeVida}>
                                            <MdSchedule size={13} />
                                            {formatarHoras(calcularHorasDeVida(assinatura.valor, rendaMensalContexto, cargaHorariaContexto))}
                                        </p>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className={styles.cardAssinaturas}>
                <p className={styles.tituloSecao}>Todas as Assinaturas</p>
                <Link className={styles.botaoVerTodas} to={'/assinaturas'}>
                    Ver Todas as Assinaturas
                </Link>
            </section>

        </div>
    )
}
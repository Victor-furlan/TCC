import styles from './Relatorios.module.css'
import { useState, useContext } from 'react'
import { MdLightbulb } from 'react-icons/md'
import { DespesasContexto } from '../../contexts/DespesasContexto'
import { AssinaturasContexto } from '../../contexts/AssinaturasContexto';
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { gerarInsights } from '../../utils/GerarInsights'
import { agregarDadosPorHumor } from '../../utils/AgregarDadosGrafico'
import { GraficoHumorGastos } from '../../components/graficos/graficoHumorGastos/GraficoHumorGastos'
import { agregarAssinaturasPorCategoria, agregarDespesasPorCategoria } from '../../utils/AgregarPorCategoria';
import { GraficoPizzaCategorias } from '../../components/graficos/graficoPizzaCategorias/GraficoPizzaCategorias';
import { GraficoBarrasCategorias } from '../../components/graficos/graficoBarrasCategorias/GraficoBarrasCategorias';
import { GraficoTendenciaMensal } from '../../components/graficos/graficoTendenciaMensal/GraficoTendenciaMensal';
import { agregarTodasPorCategoria } from '../../utils/AgregarPorCategoria';
import { DetalhamentoCategorias } from '../../components/detalhamentoCategoria/DetalhamentoCategoria';

type AbaRelatorio = 'categoria' | 'tendencia' | 'detalhamento' | 'comportamental'

const ARREPENDIMENTO_ALTO = 4

export function Relatorios() {

    const [abaAtiva, setAbaAtiva] = useState<AbaRelatorio>('categoria')

    const { assinaturas } = useContext(AssinaturasContexto)
    const { despesas } = useContext(DespesasContexto)
    const { rendaMensalContexto, cargaHorariaContexto } = useContext(BaseFinanceiraContexto)
    
    

    const formatarMoeda = (valor: number) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const todosInsights = gerarInsights(despesas)
    const dadosGraficoHumor = agregarDadosPorHumor(despesas)

    const dadosPizzaAssinaturas = agregarAssinaturasPorCategoria(assinaturas)
    const dadosBarrasDespesas = agregarDespesasPorCategoria(despesas)
    const dadosTodasCategorias = agregarTodasPorCategoria(despesas, assinaturas)
    

    const totalMensalAssinaturas = assinaturas.reduce((soma, assinatura) => {
        if (assinatura.periodicidade === 'Anual') return soma + (assinatura.valor / 12)
        if (assinatura.periodicidade === 'Semanal') return soma + (assinatura.valor * 4)
        return soma + assinatura.valor
    }, 0)  

    const projecaoAnual = totalMensalAssinaturas * 12
    const mediaAssinatura = assinaturas.length > 0 ? totalMensalAssinaturas / assinaturas.length : 0

    const despesasArrependidas = despesas.filter(
        (despesa) => (despesa.nivelArrependimento ?? 0) >= ARREPENDIMENTO_ALTO
    )
    const totalArrependido = despesasArrependidas.reduce((soma, despesa) => soma + despesa.valor, 0)

    const humorMaisFrequente = (() => {
        const comHumor = despesas.filter((despesa) => despesa.humor)
        if (comHumor.length === 0) return '—'

        const contagem = new Map<string, number>()
        for (const despesa of comHumor) {
            const humor = despesa.humor as string
            contagem.set(humor, (contagem.get(humor) ?? 0) + 1)
        }

        let humorTopo = ''
        let maiorContagem = 0
        for (const [humor, total] of contagem) {
            if (total > maiorContagem) {
                humorTopo = humor
                maiorContagem = total
            }
        }

        return humorTopo.charAt(0).toUpperCase() + humorTopo.slice(1)
    })()

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Relatórios e Análises</h1>
                    <p className={styles.subtitulo}>Insights sobre seus padrões de gastos</p>
                </div>

                <div className={styles.abas}>
                    <button
                        className={abaAtiva === 'categoria' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('categoria')}
                    >
                        Por Categoria
                    </button>
                    <button
                        className={abaAtiva === 'tendencia' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('tendencia')}
                    >
                        Tendência
                    </button>
                    <button
                        className={abaAtiva === 'comportamental' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('comportamental')}
                    >
                        Comportamental
                    </button>
                    <button
                        className={abaAtiva === 'detalhamento' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('detalhamento')}
                    >
                        Detalhamento
                    </button>
                </div>
            </section>

            <section className={styles.cardsMetricas}>

            <div className={styles.cardMetrica}>
                <p className={styles.tituloMetrica}>Total Mensal</p>
                <p className={styles.valorMetrica}>{formatarMoeda(totalMensalAssinaturas)}</p>
                <p className={styles.descricaoMetrica}>Assinaturas atuais</p>
            </div>

            <div className={styles.cardMetrica}>
                <p className={styles.tituloMetrica}>Projeção Anual</p>
                <p className={styles.valorMetrica}>{formatarMoeda(projecaoAnual)}</p>
                <p className={styles.descricaoMetrica}>Custo anual estimado</p>
            </div>

            <div className={styles.cardMetrica}>
                <p className={styles.tituloMetrica}>Média por Assinatura</p>
                <p className={styles.valorMetrica}>{formatarMoeda(mediaAssinatura)}</p>
                <p className={styles.descricaoMetrica}>Custo médio de assinatura</p>
            </div>

            </section>

            {abaAtiva === 'categoria' && (
                <section className={styles.areaGraficos}>
                    <div className={styles.cardGrafico}>
                        <p className={styles.tituloSecao}>Assinaturas por Categoria</p>
                        <GraficoPizzaCategorias
                            dados={dadosPizzaAssinaturas}
                            textoVazio="Nenhuma assinatura cadastrada ainda"
                            rendaMensal={rendaMensalContexto}
                            cargaHoraria={cargaHorariaContexto}
                        />
                    </div>
                    <div className={styles.cardGrafico}>
                        <p className={styles.tituloSecao}>Despesas Variáveis por Categoria</p>
                        <GraficoBarrasCategorias
                            dados={dadosBarrasDespesas}
                            textoVazio="Nenhuma despesa cadastrada ainda"
                            rendaMensal={rendaMensalContexto}
                            cargaHoraria={cargaHorariaContexto}
                        />
                    </div>
                </section>
            )}

            {abaAtiva === 'tendencia' && (
                <section className={styles.cardGraficoUnico}>
                    <GraficoTendenciaMensal despesas={despesas} assinaturas={assinaturas} />
                </section>
            )}

            {abaAtiva === 'comportamental' && (
                <>
                    <section className={styles.cardsMetricas}>

                        <div className={styles.cardMetrica}>
                            <p className={styles.tituloMetrica}>Despesas com Arrependimento Alto</p>
                            <p className={styles.valorMetrica}>{despesasArrependidas.length}</p>
                            <p className={styles.descricaoMetrica}>Nível 4 ou 5</p>
                        </div>

                        <div className={styles.cardMetrica}>
                            <p className={styles.tituloMetrica}>Total em Arrependimento</p>
                            <p className={styles.valorMetrica}>{formatarMoeda(totalArrependido)}</p>
                            <p className={styles.descricaoMetrica}>Gasto que você reconsideraria</p>
                        </div>

                        <div className={styles.cardMetrica}>
                            <p className={styles.tituloMetrica}>Humor Mais Frequente</p>
                            <p className={styles.valorMetrica}>{humorMaisFrequente}</p>
                            <p className={styles.descricaoMetrica}>Entre os gastos registrados</p>
                        </div>

                    </section>

                    <section className={styles.areaGraficos}>
                        <div className={styles.cardGrafico}>
                            <p className={styles.tituloSecao}>Humor vs Gastos</p>
                            <GraficoHumorGastos dados={dadosGraficoHumor} />
                        </div>

                        <div className={styles.cardListaInsights}>
                            <p className={styles.tituloSecao}>Insights Automáticos</p>

                            {todosInsights.length === 0 ? (
                                <div className={styles.conteudoVazio}>
                                    <MdLightbulb size={40} className={styles.iconePlaceholder} />
                                    <p className={styles.textoVazio}>Continue registrando gastos para desbloquear insights</p>
                                </div>
                            ) : (
                                <div className={styles.listaInsights}>
                                    {todosInsights.map((insight) => (
                                        <div key={insight.id} className={styles.itemInsight}>
                                            <MdLightbulb size={18} className={styles.iconeInsight} />
                                            <p className={styles.textoInsight}>{insight.texto}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {abaAtiva === 'detalhamento' && (
                <div className={styles.areaDetalhamento}>

                    <div className={styles.cardDetalhamento}>
                        <p className={styles.tituloSecao}>Visão Geral por Categoria</p>
                        <DetalhamentoCategorias
                            dados={dadosTodasCategorias}
                            rendaMensal={rendaMensalContexto}
                            cargaHoraria={cargaHorariaContexto}
                            textoVazio="Nenhum dado cadastrado ainda"
                        />
                    </div>

                    <div className={styles.gridDetalhamento}>
                        <div className={styles.cardDetalhamento}>
                            <p className={styles.tituloSecao}>Assinaturas por Categoria</p>
                            <DetalhamentoCategorias
                                dados={dadosPizzaAssinaturas}
                                rendaMensal={rendaMensalContexto}
                                cargaHoraria={cargaHorariaContexto}
                                textoVazio="Nenhuma assinatura cadastrada ainda"
                            />
                        </div>

                        <div className={styles.cardDetalhamento}>
                            <p className={styles.tituloSecao}>Despesas por Categoria</p>
                            <DetalhamentoCategorias
                                dados={dadosBarrasDespesas}
                                rendaMensal={rendaMensalContexto}
                                cargaHoraria={cargaHorariaContexto}
                                textoVazio="Nenhuma despesa cadastrada ainda"
                            />
                        </div>
                    </div>

                </div>
            )}

        </div>
    )
}
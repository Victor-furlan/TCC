import styles from './Simulador.module.css'
import { useContext, useState } from 'react'
import { MdArrowBack, MdVisibility, MdAutoAwesome } from 'react-icons/md'
import { AssinaturasContexto } from '../../contexts/AssinaturasContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'

type VisualizacaoGrafico = 'annual' | 'monthly'

export function Simulador() {

    const { assinaturas } = useContext(AssinaturasContexto)
    const { rendaMensalContexto } = useContext(BaseFinanceiraContexto)

    const [idsSelecionados, setIdsSelecionados] = useState<string[]>([])
    const [visualizacao, setVisualizacao] = useState<VisualizacaoGrafico>('annual')

    const valorMensalizado = (valor: number, periodicidade: string) => {
        if (periodicidade === 'Anual') return valor / 12
        if (periodicidade === 'Semanal') return valor * 4
        return valor
    }

    const alternarSelecao = (id: string) => {
        setIdsSelecionados((atual) =>
            atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]
        )
    }

    const gastoAtualMensal = assinaturas.reduce(
        (soma, assinatura) => soma + valorMensalizado(assinatura.valor, assinatura.periodicidade),
        0
    )
    const gastoAtualAnual = gastoAtualMensal * 12

    const economiaSelecionadaMensal = assinaturas
        .filter((assinatura) => idsSelecionados.includes(assinatura.id))
        .reduce((soma, assinatura) => soma + valorMensalizado(assinatura.valor, assinatura.periodicidade), 0)
    const economiaSelecionadaAnual = economiaSelecionadaMensal * 12

    const gastoSimuladoMensal = gastoAtualMensal - economiaSelecionadaMensal
    const gastoSimuladoAnual = gastoSimuladoMensal * 12

    const percentualAtual = rendaMensalContexto > 0 ? (gastoAtualMensal / rendaMensalContexto) * 100 : 0
    const percentualSimulado = rendaMensalContexto > 0 ? (gastoSimuladoMensal / rendaMensalContexto) * 100 : 0

    const formatarMoeda = (valor: number) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <h1 className={styles.titulo}>Simulador "E... se"</h1>
                <p className={styles.subtitulo}>Simule cenários cancelando assinaturas e veja o impacto no seu orçamento.</p>
            </section>

            <section className={styles.grid}>

                <div className={styles.cardSelecao}>
                    <p className={styles.tituloSecao}>Selecione assinaturas para cancelar</p>

                    {assinaturas.length === 0 ? (
                        <p className={styles.periodicidade}>Nenhuma assinatura cadastrada ainda.</p>
                    ) : (
                        <div className={styles.listaAssinaturas}>
                            {assinaturas.map((assinatura) => {
                                const selecionada = idsSelecionados.includes(assinatura.id)
                                return (
                                    <label
                                        key={assinatura.id}
                                        className={selecionada ? `${styles.itemAssinatura} ${styles.itemSelecionado}` : styles.itemAssinatura}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={selecionada}
                                            onChange={() => alternarSelecao(assinatura.id)}
                                            className={styles.checkbox}
                                        />
                                        <div className={styles.infoAssinatura}>
                                            <div className={styles.linhaNome}>
                                                <p className={styles.nomeAssinatura}>{assinatura.nome}</p>
                                                <span className={styles.tagCategoria}>{assinatura.categoria}</span>
                                            </div>
                                            <p className={styles.periodicidade}>{assinatura.periodicidade}</p>
                                        </div>
                                        <p className={styles.valorAssinatura}>{formatarMoeda(assinatura.valor)}</p>
                                    </label>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className={styles.colunaCards}>

                    <div className={styles.cardEconomia}>
                        <p className={styles.tituloEconomia}>💰 Economia Projetada</p>
                        <p className={styles.descricaoEconomia}>
                            Cancelando {idsSelecionados.length} {idsSelecionados.length === 1 ? 'item selecionado' : 'itens selecionados'}, você economiza:
                        </p>

                        <div className={styles.valoresEconomia}>
                            <div>
                                <p className={styles.legendaValor}>Por Mês</p>
                                <p className={styles.valorEconomia}>{formatarMoeda(economiaSelecionadaMensal)}</p>
                            </div>
                            <div>
                                <p className={styles.legendaValor}>Por Ano</p>
                                <p className={styles.valorEconomia}>{formatarMoeda(economiaSelecionadaAnual)}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cardCenario}>
                        <div className={styles.cabecalhoCenario}>
                            <MdVisibility size={18} className={styles.iconeCenario} />
                            <div>
                                <p className={styles.tituloCenario}>Cenário Atual</p>
                                <p className={styles.subtituloCenario}>Seus gastos hoje, sem alterações</p>
                            </div>
                        </div>
                        <div className={styles.linhaCenario}>
                            <p>Saldo Mensal</p>
                            <p className={styles.valorCenario}>{formatarMoeda(gastoAtualMensal)}</p>
                        </div>
                        <div className={styles.linhaCenario}>
                            <p>Saldo Anual</p>
                            <p className={styles.valorCenario}>{formatarMoeda(gastoAtualAnual)}</p>
                        </div>
                        <p className={styles.legendaPercentual}>% da Renda Comprometida</p>
                        <div className={styles.barraProgresso}>
                            <div className={styles.preenchimentoBarra} style={{ width: `${Math.min(percentualAtual, 100)}%` }} />
                        </div>
                        <p className={styles.percentualCenario}>{percentualAtual.toFixed(1)}%</p>
                    </div>

                    <div className={`${styles.cardCenario} ${styles.cardCenarioRoxo}`}>
                        <div className={styles.cabecalhoCenario}>
                            <MdAutoAwesome size={18} className={styles.iconeCenarioRoxo} />
                            <div>
                                <p className={styles.tituloCenario}>Cenário Simulado</p>
                                <p className={styles.subtituloCenario}>Se você cancelar os itens selecionados</p>
                            </div>
                        </div>
                        <div className={styles.linhaCenario}>
                            <p>Saldo Mensal</p>
                            <p className={styles.valorCenario}>{formatarMoeda(gastoSimuladoMensal)}</p>
                        </div>
                        <div className={styles.linhaCenario}>
                            <p>Saldo Anual</p>
                            <p className={styles.valorCenario}>{formatarMoeda(gastoSimuladoAnual)}</p>
                        </div>
                        <p className={styles.legendaPercentual}>% da Renda Comprometida</p>
                        <div className={styles.barraProgresso}>
                            <div className={`${styles.preenchimentoBarra} ${styles.preenchimentoRoxo}`} style={{ width: `${Math.min(percentualSimulado, 100)}%` }} />
                        </div>
                        <p className={styles.percentualCenario}>{percentualSimulado.toFixed(1)}%</p>
                    </div>

                </div>

            </section>

            <section className={styles.cardGrafico}>
                <div className={styles.cabecalhoGrafico}>
                    <div>
                        <p className={styles.tituloGrafico}>Comparação Visual</p>
                        <p className={styles.subtituloGrafico}>{visualizacao === 'annual' ? 'Anual' : 'Mensal'}</p>
                    </div>

                    <button
                        className={styles.botaoAlternar}
                        onClick={() => setVisualizacao(visualizacao === 'annual' ? 'monthly' : 'annual')}
                    >
                        <MdArrowBack size={16} />
                        Ver economia {visualizacao === 'annual' ? 'mensal' : 'anual'}
                    </button>
                </div>

                <div className={styles.areaGrafico}>
                    <p className={styles.placeholderGrafico}>
                        {visualizacao === 'annual' ? 'Gráfico de Barras Anual' : 'Gráfico de Barras Mensal'}
                    </p>
                </div>

                <div className={styles.rodapeGrafico}>
                    <div>
                        <p className={styles.legendaRodape}>Economia mensal</p>
                        <p className={styles.valorRodape}>{formatarMoeda(economiaSelecionadaMensal)}</p>
                    </div>
                    <div>
                        <p className={styles.legendaRodape}>Redução</p>
                        <p className={styles.valorRodape}>
                            -{gastoAtualMensal > 0 ? ((economiaSelecionadaMensal / gastoAtualMensal) * 100).toFixed(1) : '0.0'}%
                        </p>
                    </div>
                    <div>
                        <p className={styles.legendaRodape}>Economia anual</p>
                        <p className={styles.valorRodape}>{formatarMoeda(economiaSelecionadaAnual)}</p>
                    </div>
                </div>
            </section>

        </div>
    )
}
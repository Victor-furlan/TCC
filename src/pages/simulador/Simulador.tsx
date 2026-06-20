import styles from './Simulador.module.css'
import { useState } from 'react'
import { MdArrowBack } from 'react-icons/md'

type VisualizacaoGrafico = 'annual' | 'monthly'

interface AssinaturaTipo {
    id: string
    nome: string
    categoria: string
    valorMensal: number
}

const RENDA_MENSAL = 5000

const assinaturas: AssinaturaTipo[] = [
    { id: '1', nome: 'Netflix', categoria: 'Entertainment', valorMensal: 15.99 },
    { id: '2', nome: 'teste', categoria: 'teste', valorMensal: 100 }
]

export function Simulador() {

    const [idsSelecionados, setIdsSelecionados] = useState<string[]>(['1'])
    const [visualizacao, setVisualizacao] = useState<VisualizacaoGrafico>('annual')

    const alternarSelecao = (id: string) => {
        setIdsSelecionados((atual) =>
            atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]
        )
    }

    const gastoAtualMensal = assinaturas.reduce((soma, assinatura) => soma + assinatura.valorMensal, 0)
    const gastoAtualAnual = gastoAtualMensal * 12

    const economiaSelecionadaMensal = assinaturas
        .filter((assinatura) => idsSelecionados.includes(assinatura.id))
        .reduce((soma, assinatura) => soma + assinatura.valorMensal, 0)
    const economiaSelecionadaAnual = economiaSelecionadaMensal * 12

    const gastoSimuladoMensal = gastoAtualMensal - economiaSelecionadaMensal
    const gastoSimuladoAnual = gastoSimuladoMensal * 12

    const percentualAtual = (gastoAtualMensal / RENDA_MENSAL) * 100
    const percentualSimulado = (gastoSimuladoMensal / RENDA_MENSAL) * 100

    const formatarMoeda = (valor: number) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <h1 className={styles.titulo}>Simulator "And...if"</h1>
                <p className={styles.subtitulo}>Simulate scenarios by canceling subscriptions and see the impact on your budget.</p>
            </section>

            <section className={styles.grid}>

                <div className={styles.cardSelecao}>
                    <p className={styles.tituloSecao}>Selecione assinaturas para cancelar</p>

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
                                        <p className={styles.periodicidade}>Monthly</p>
                                    </div>
                                    <p className={styles.valorAssinatura}>{formatarMoeda(assinatura.valorMensal)}</p>
                                </label>
                            )
                        })}
                    </div>
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
                        <p className={styles.tituloCenario}>Cenário Atual</p>
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
                            <div className={styles.preenchimentoBarra} style={{ width: `${percentualAtual}%` }} />
                        </div>
                        <p className={styles.percentualCenario}>{percentualAtual.toFixed(1)}%</p>
                    </div>

                    <div className={`${styles.cardCenario} ${styles.cardCenarioRoxo}`}>
                        <p className={styles.tituloCenario}>Cenário Simulado</p>
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
                            <div className={`${styles.preenchimentoBarra} ${styles.preenchimentoRoxo}`} style={{ width: `${percentualSimulado}%` }} />
                        </div>
                        <p className={styles.percentualCenario}>{percentualSimulado.toFixed(1)}%</p>
                    </div>

                </div>

            </section>

            <section className={styles.cardGrafico}>
                <div className={styles.cabecalhoGrafico}>
                    <div>
                        <p className={styles.tituloGrafico}>Visual Comparison</p>
                        <p className={styles.subtituloGrafico}>{visualizacao === 'annual' ? 'Annual' : 'Monthly'}</p>
                    </div>

                    <button
                        className={styles.botaoAlternar}
                        onClick={() => setVisualizacao(visualizacao === 'annual' ? 'monthly' : 'annual')}
                    >
                        <MdArrowBack size={16} />
                        See your {visualizacao === 'annual' ? 'monthly' : 'annual'} savings
                    </button>
                </div>

                <div className={styles.areaGrafico}>
                    <p className={styles.placeholderGrafico}>
                        {visualizacao === 'annual' ? 'Gráfico de Barras Anual' : 'Gráfico de Barras Mensal'}
                    </p>
                </div>

                <div className={styles.rodapeGrafico}>
                    <div>
                        <p className={styles.legendaRodape}>Monthly savings</p>
                        <p className={styles.valorRodape}>{formatarMoeda(economiaSelecionadaMensal)}</p>
                    </div>
                    <div>
                        <p className={styles.legendaRodape}>Reduced</p>
                        <p className={styles.valorRodape}>
                            -{gastoAtualMensal > 0 ? ((economiaSelecionadaMensal / gastoAtualMensal) * 100).toFixed(1) : '0.0'}%
                        </p>
                    </div>
                    <div>
                        <p className={styles.legendaRodape}>Annual savings</p>
                        <p className={styles.valorRodape}>{formatarMoeda(economiaSelecionadaAnual)}</p>
                    </div>
                </div>
            </section>

        </div>
    )
}
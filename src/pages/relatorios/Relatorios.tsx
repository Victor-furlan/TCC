import styles from './Relatorios.module.css'
import { useState } from 'react'

type AbaRelatorio = 'categoria' | 'tendencia' | 'detalhamento'

export function Relatorios() {

    const [abaAtiva, setAbaAtiva] = useState<AbaRelatorio>('categoria')

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
                    <p className={styles.valorMetrica}>R$0,00</p>
                    <p className={styles.descricaoMetrica}>Assinaturas atuais</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Projeção Anual</p>
                    <p className={styles.valorMetrica}>R$0,00</p>
                    <p className={styles.descricaoMetrica}>Custo anual estimado</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Média por Assinatura</p>
                    <p className={styles.valorMetrica}>R$0,00</p>
                    <p className={styles.descricaoMetrica}>Custo médio de assinatura</p>
                </div>

            </section>

            {abaAtiva === 'categoria' && (
                <section className={styles.areaGraficos}>
                    <div className={styles.cardGrafico}>
                        <p className={styles.placeholderGrafico}>Gráfico de Pizza</p>
                    </div>
                    <div className={styles.cardGrafico}>
                        <p className={styles.placeholderGrafico}>Gráfico de Barras</p>
                    </div>
                </section>
            )}

            {abaAtiva === 'tendencia' && (
                <section className={styles.cardGraficoUnico}>
                    <p className={styles.placeholderGrafico}>Gráfico de Linha</p>
                </section>
            )}

            {abaAtiva === 'detalhamento' && (
                <section className={styles.cardDetalhamento}>
                    <p className={styles.tituloSecao}>Detalhamento por Categoria</p>
                    <p className={styles.textoVazio}>Nenhuma categoria cadastrada ainda.</p>
                </section>
            )}

        </div>
    )
}
import styles from './Relatorios.module.css'
import { useState } from 'react'

type AbaRelatorio = 'categoria' | 'tendencia' | 'detalhamento'

export function Relatorios() {

    const [abaAtiva, setAbaAtiva] = useState<AbaRelatorio>('categoria')

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Reports & Analytics</h1>
                    <p className={styles.subtitulo}>Insights into your spending patterns</p>
                </div>

                <div className={styles.abas}>
                    <button
                        className={abaAtiva === 'categoria' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('categoria')}
                    >
                        By Category
                    </button>
                    <button
                        className={abaAtiva === 'tendencia' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('tendencia')}
                    >
                        Trend
                    </button>
                    <button
                        className={abaAtiva === 'detalhamento' ? `${styles.aba} ${styles.abaAtiva}` : styles.aba}
                        onClick={() => setAbaAtiva('detalhamento')}
                    >
                        Breakdown
                    </button>
                </div>
            </section>

            <section className={styles.cardsMetricas}>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Monthly Total</p>
                    <p className={styles.valorMetrica}>R$0,00</p>
                    <p className={styles.descricaoMetrica}>Current subscriptions</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Annual Projection</p>
                    <p className={styles.valorMetrica}>R$0,00</p>
                    <p className={styles.descricaoMetrica}>Estimated yearly cost</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Average per Subscription</p>
                    <p className={styles.valorMetrica}>R$0,00</p>
                    <p className={styles.descricaoMetrica}>Mean subscription cost</p>
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
                    <p className={styles.tituloSecao}>Detailed Category Breakdown</p>
                    <p className={styles.textoVazio}>Nenhuma categoria cadastrada ainda.</p>
                </section>
            )}

        </div>
    )
}
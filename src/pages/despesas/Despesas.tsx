import styles from './Despesas.module.css'
import { MdAdd, MdShoppingBag } from 'react-icons/md'

const meses = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

export function Despesas() {

    const despesas: any[] = []

    const dataAtual = new Date()
    const mesAtual = meses[dataAtual.getMonth()]
    const anoAtual = dataAtual.getFullYear()

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Variable Expenses</h1>
                    <p className={styles.subtitulo}>Track one-time expenses and monitor your spending patterns</p>
                </div>

                <button className={styles.botaoAdicionar}>
                    <MdAdd size={20} />
                    Add Expense
                </button>
            </section>

            <section className={styles.cardResumo}>
                <p className={styles.tituloResumo}>Resume - {mesAtual} {anoAtual}</p>

                <div className={styles.itensResumo}>
                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Total Expenditure</p>
                        <p className={styles.valorItem}>R$ 0.00</p>
                    </div>

                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Amount of expenses</p>
                        <p className={styles.valorItem}>0</p>
                    </div>

                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Average per expenditure</p>
                        <p className={styles.valorItem}>R$ 0.00</p>
                    </div>
                </div>
            </section>

            <section className={styles.cardHistorico}>
                <div className={styles.cabecalhoHistorico}>
                    <p className={styles.tituloSecao}>Expenses history</p>
                    <button className={styles.botaoAdicionarPrimeira}>
                        <MdAdd size={18} />
                        Add first expense
                    </button>
                </div>

                {despesas.length === 0 ? (
                    <div className={styles.conteudoVazio}>
                        <MdShoppingBag size={56} className={styles.iconeVazio} />
                        <p className={styles.textoVazio}>No expenses recorded</p>
                        <p className={styles.textoVazioSub}>Start by adding your variable expenses</p>
                    </div>
                ) : (
                    <div className={styles.listaDespesas}>
                        {despesas.map((despesa) => (
                            <div key={despesa.id} className={styles.itemDespesa}>
                                <p>{despesa.nome}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}
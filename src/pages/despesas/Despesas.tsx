import styles from './Despesas.module.css'
import { Link } from 'react-router-dom'
import { MdAdd, MdShoppingBag } from 'react-icons/md'

const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
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
                    <h1 className={styles.titulo}>Gastos Variáveis</h1>
                    <p className={styles.subtitulo}>Acompanhe despesas pontuais e monitore seus padrões de gastos</p>
                </div>

                <Link className={styles.botaoAdicionar} to='/despesas/nova'>
                    <MdAdd size={20} />
                    Adicionar Despesa
                </Link>
            </section>

            <section className={styles.cardResumo}>
                <p className={styles.tituloResumo}>Resumo - {mesAtual} {anoAtual}</p>

                <div className={styles.itensResumo}>
                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Total Gasto</p>
                        <p className={styles.valorItem}>R$ 0,00</p>
                    </div>

                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Quantidade de Despesas</p>
                        <p className={styles.valorItem}>0</p>
                    </div>

                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Média por Gasto</p>
                        <p className={styles.valorItem}>R$ 0,00</p>
                    </div>
                </div>
            </section>

            <section className={styles.cardHistorico}>
                <div className={styles.cabecalhoHistorico}>
                    <p className={styles.tituloSecao}>Histórico de Despesas</p>
                    <Link className={styles.botaoAdicionarPrimeira} to='/despesas/nova'>
                        <MdAdd size={18} />
                        Adicionar primeira despesa
                    </Link>
                </div>

                {despesas.length === 0 ? (
                    <div className={styles.conteudoVazio}>
                        <MdShoppingBag size={56} className={styles.iconeVazio} />
                        <p className={styles.textoVazio}>Nenhum gasto registrado</p>
                        <p className={styles.textoVazioSub}>Comece adicionando seus gastos variáveis</p>
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
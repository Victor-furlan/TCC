import { Link } from 'react-router-dom'
import styles from './DashBoard.module.css'
import { MdCalendarToday, MdAdd, MdEdit, MdDelete } from 'react-icons/md'

export function DashBoard(){

    const assinaturas: any[] = []

    return(
        <div className={styles.conteiner}>

            <section className={styles.cardsMetricas}>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Total Monthly Expenses</p>
                    <p className={styles.valorMetrica}>$0.00</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Income Committed</p>
                    <p className={styles.valorMetrica}>0%</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Monthly Income</p>
                    <p className={styles.valorMetrica}>$0.00</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Upcoming Renewals</p>
                    <p className={styles.valorMetrica}>0</p>
                </div>

            </section>

            <section className={styles.cardRenovacoes}>
                <div className={styles.cabecalhoRenovacoes}>
                    <p className={styles.tituloSecao}>Upcoming Subscription Renewals</p>
                    <Link className={styles.botaoAdicionar}
                    to={''}>
                        <MdAdd size={20} />
                        Add New
                    </Link>
                </div>

                <div className={styles.conteudoVazio}>
                    <MdCalendarToday size={48} className={styles.iconeVazio} />
                    <p className={styles.textoVazio}>No upcoming renewals in the next 7 days</p>
                </div>
            </section>

            <section className={styles.cardAssinaturas}>
                <p className={styles.tituloSecao}>All Subscriptions</p>

                {assinaturas.length === 0 ? (
                    <p className={styles.textoVazio}>Nenhuma assinatura cadastrada ainda.</p>
                ) : (
                    <div className={styles.listaAssinaturas}>
                        {assinaturas.map((assinatura) => (
                            <div key={assinatura.id} className={styles.itemAssinatura}>
                                <p>{assinatura.nome}</p>
                                <div className={styles.acoesAssinatura}>
                                    <button className={styles.botaoIcone}>
                                        <MdEdit size={18} />
                                    </button>
                                    <button className={styles.botaoIcone}>
                                        <MdDelete size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Link className={styles.botaoVerTodas}
                to={'/assinaturas'}>
                    View All Subscriptions
                </Link>
            </section>

        </div>
    )
}
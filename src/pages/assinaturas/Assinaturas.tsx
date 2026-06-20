import styles from './Assinaturas.module.css'
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete } from 'react-icons/md'

export function Assinaturas() {

    const assinaturas: any[] = []

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Subscriptions</h1>
                    <p className={styles.subtitulo}>Manage your recurring expenses</p>
                </div>

                <button className={styles.botaoAdicionar}>
                    <MdAdd size={20} />
                    Add Subscription
                </button>
            </section>

            <section className={styles.cardBusca}>
                <div className={styles.campoBusca}>
                    <MdSearch size={20} className={styles.iconeBusca} />
                    <input
                        className={styles.input}
                        placeholder='Search subscriptions...'
                    />
                </div>

                <button className={styles.botaoFiltro}>
                    <MdFilterList size={18} />
                    All Categories
                </button>
            </section>

            <section className={styles.cardsMetricas}>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Active Subscriptions</p>
                    <p className={styles.valorMetrica}>0</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Total Monthly Cost</p>
                    <p className={styles.valorMetrica}>$0.00</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Annual Cost</p>
                    <p className={styles.valorMetrica}>$0.00</p>
                </div>

            </section>

            <section className={styles.cardLista}>
                <p className={styles.tituloSecao}>Your Subscriptions</p>

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
            </section>

        </div>
    )
}
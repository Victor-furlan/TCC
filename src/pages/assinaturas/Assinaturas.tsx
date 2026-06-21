import styles from './Assinaturas.module.css'
import { Link } from 'react-router-dom'
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete } from 'react-icons/md'

export function Assinaturas() {

    const assinaturas: any[] = []

    return(
        <div className={styles.conteiner}>

            <section className={styles.cabecalho}>
                <div>
                    <h1 className={styles.titulo}>Assinaturas</h1>
                    <p className={styles.subtitulo}>Gerencie suas despesas recorrentes</p>
                </div>

                <Link className={styles.botaoAdicionar} to='/assinaturas/nova'>
                    <MdAdd size={20} />
                    Adicionar Assinatura
                </Link>
            </section>

            <section className={styles.cardBusca}>
                <div className={styles.campoBusca}>
                    <MdSearch size={20} className={styles.iconeBusca} />
                    <input
                        className={styles.input}
                        placeholder='Buscar assinaturas...'
                    />
                </div>

                <button className={styles.botaoFiltro}>
                    <MdFilterList size={18} />
                    Todas as Categorias
                </button>
            </section>

            <section className={styles.cardsMetricas}>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Assinaturas Ativas</p>
                    <p className={styles.valorMetrica}>0</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Custo Mensal Total</p>
                    <p className={styles.valorMetrica}>R$ 0,00</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Custo Anual</p>
                    <p className={styles.valorMetrica}>R$ 0,00</p>
                </div>

            </section>

            <section className={styles.cardLista}>
                <p className={styles.tituloSecao}>Suas Assinaturas</p>

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
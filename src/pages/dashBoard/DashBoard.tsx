import { Link } from 'react-router-dom'
import styles from './DashBoard.module.css'
import { MdCalendarToday, MdAdd, MdEdit, MdDelete } from 'react-icons/md'

export function DashBoard(){

    const assinaturas: any[] = []

    return(
        <div className={styles.conteiner}>

            <section className={styles.cardsMetricas}>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Total de Despesas Mensais</p>
                    <p className={styles.valorMetrica}>R$ 0,00</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Renda Comprometida</p>
                    <p className={styles.valorMetrica}>0%</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Renda Mensal</p>
                    <p className={styles.valorMetrica}>R$ 0,00</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Próximas Renovações</p>
                    <p className={styles.valorMetrica}>0</p>
                </div>

            </section>

            <section className={styles.cardRenovacoes}>
                <div className={styles.cabecalhoRenovacoes}>
                    <p className={styles.tituloSecao}>Próximas Renovações de Assinatura</p>
                    <Link className={styles.botaoAdicionar}
                    to={'/assinaturas/nova'}>
                        <MdAdd size={20} />
                        Adicionar Nova
                    </Link>
                </div>

                <div className={styles.conteudoVazio}>
                    <MdCalendarToday size={48} className={styles.iconeVazio} />
                    <p className={styles.textoVazio}>Nenhuma renovação nos próximos 7 dias</p>
                </div>
            </section>

            <section className={styles.cardAssinaturas}>
                <p className={styles.tituloSecao}>Todas as Assinaturas</p>

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
                    Ver Todas as Assinaturas
                </Link>
            </section>

        </div>
    )
}
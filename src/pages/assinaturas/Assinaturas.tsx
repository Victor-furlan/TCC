import styles from './Assinaturas.module.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete } from 'react-icons/md'
import { AssinaturasContexto } from '../../contexts/AssinaturasContexto'

const coresCategorias: Record<string, string> = {
    'Entretenimento': '#FFC1C1',
    'Software': '#FFFBC1',
    'Compras': '#AEFFB3',
    'Utilidades': '#FFD4AE',
    'Alimentação': '#AED1FF',
    'Saúde': '#FFAEF4',
    'Educação': '#D8AEFF',
}

const corPadrao = '#E9F6FF'

export function Assinaturas() {

    const { assinaturas, removerAssinatura } = useContext(AssinaturasContexto)

    const assinaturasAtivas = assinaturas.length

    const custoMensalTotal = assinaturas.reduce((soma, assinatura) => {
        if (assinatura.periodicidade === 'Anual') {
            return soma + (assinatura.valor / 12)
        }
        if (assinatura.periodicidade === 'Semanal') {
            return soma + (assinatura.valor * 4)
        }
        return soma + assinatura.valor
    }, 0)

    const custoAnual = custoMensalTotal * 12

    const formatarMoeda = (valor: number) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const formatarData = (data: string) => {
        if (!data) return ''
        const [ano, mes, dia] = data.split('-')
        return `${dia}/${mes}/${ano}`
    }

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
                    <p className={styles.valorMetrica}>{assinaturasAtivas}</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Custo Mensal Total</p>
                    <p className={styles.valorMetrica}>{formatarMoeda(custoMensalTotal)}</p>
                </div>

                <div className={styles.cardMetrica}>
                    <p className={styles.tituloMetrica}>Custo Anual</p>
                    <p className={styles.valorMetrica}>{formatarMoeda(custoAnual)}</p>
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

                                <div
                                    className={styles.iconeInicial}
                                    style={{ backgroundColor: coresCategorias[assinatura.categoria] || corPadrao }}
                                >
                                    {assinatura.nome.charAt(0).toUpperCase()}
                                </div>

                                <div className={styles.infoAssinatura}>
                                    <div className={styles.linhaNomeCategoria}>
                                        <p className={styles.nomeAssinatura}>{assinatura.nome}</p>
                                        <span className={styles.tagCategoria}>{assinatura.categoria}</span>
                                    </div>
                                    <p className={styles.proximaCobranca}>
                                        Próxima cobrança: {formatarData(assinatura.proximaCobranca)}
                                    </p>
                                </div>

                                <div className={styles.valorPeriodicidade}>
                                    <p className={styles.valorAssinatura}>{formatarMoeda(assinatura.valor)}</p>
                                    <p className={styles.periodicidadeAssinatura}>{assinatura.periodicidade}</p>
                                </div>

                                <div className={styles.acoesAssinatura}>
                                    <Link className={styles.botaoIcone} to={`/assinaturas/editar/${assinatura.id}`}>
                                        <MdEdit size={18} />
                                    </Link>
                                    <button
                                        className={styles.botaoIcone}
                                        onClick={() => removerAssinatura(assinatura.id)}
                                    >
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
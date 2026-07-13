import styles from './Despesas.module.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { MdAdd, MdShoppingBag, MdEdit, MdDelete, MdSchedule } from 'react-icons/md'
import { DespesasContexto } from '../../contexts/DespesasContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { calcularHorasDeVida } from '../../utils/CalcularHorasDeVida'

const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const coresCategorias: Record<string, string> = {
    'Entretenimento': 'var(--categoria-entretenimento)',
    'Software': 'var(--categoria-software)',
    'Compras': 'var(--categoria-compras)',
    'Utilidades': 'var(--categoria-utilidades)',
    'Alimentação': 'var(--categoria-alimentacao)',
    'Saúde': 'var(--categoria-saude)',
    'Educação': 'var(--categoria-educacao)',
}

const corPadrao = '#E9F6FF'

export function Despesas() {

    const { despesas, removerDespesa } = useContext(DespesasContexto)
    const { rendaMensalContexto, cargaHorariaContexto } = useContext(BaseFinanceiraContexto)

    const baseFinanceiraPreenchida = rendaMensalContexto > 0 && cargaHorariaContexto > 0

    const dataAtual = new Date()
    const mesAtual = meses[dataAtual.getMonth()]
    const anoAtual = dataAtual.getFullYear()

    const totalGasto = despesas.reduce((soma, despesa) => soma + despesa.valor, 0)
    const quantidadeDespesas = despesas.length
    const mediaGasto = quantidadeDespesas > 0 ? totalGasto / quantidadeDespesas : 0

    const formatarMoeda = (valor: number) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const formatarHoras = (horas: number) => {
        if (horas < 1) return `≈ ${Math.round(horas * 60)} min`
        return `≈ ${horas.toFixed(1)}h`
    }

    const formatarData = (data: string) => {
        if (!data) return ''
        const [ano, mes, dia] = data.split('-')
        return `${dia}/${mes}/${ano}`
    }

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
                        <p className={styles.valorItem}>{formatarMoeda(totalGasto)}</p>
                    </div>

                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Quantidade de Despesas</p>
                        <p className={styles.valorItem}>{quantidadeDespesas}</p>
                    </div>

                    <div className={styles.itemResumo}>
                        <p className={styles.tituloItem}>Média por Gasto</p>
                        <p className={styles.valorItem}>{formatarMoeda(mediaGasto)}</p>
                    </div>
                </div>
            </section>

            <section className={styles.cardHistorico}>
                <div className={styles.cabecalhoHistorico}>
                    <p className={styles.tituloSecao}>Histórico de Despesas</p>
                    {despesas.length === 0 && (
                        <Link className={styles.botaoAdicionarPrimeira} to='/despesas/nova'>
                            <MdAdd size={18} />
                            Adicionar primeira despesa
                        </Link>
                    )}
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

                                <div
                                    className={styles.iconeInicial}
                                    style={{ backgroundColor: coresCategorias[despesa.categoria] || corPadrao }}
                                >
                                    {despesa.nome.charAt(0).toUpperCase()}
                                </div>

                                <div className={styles.infoDespesa}>
                                    <div className={styles.linhaNomeCategoria}>
                                        <p className={styles.nomeDespesa}>{despesa.nome}</p>
                                        <span className={styles.tagCategoria}>{despesa.categoria}</span>
                                    </div>
                                    <p className={styles.dataDespesa}>{formatarData(despesa.data)}</p>
                                </div>

                                <div className={styles.colunaValor}>
                                    <p className={styles.valorDespesa}>{formatarMoeda(despesa.valor)}</p>
                                    {baseFinanceiraPreenchida && (
                                        <p className={styles.horasDeVida}>
                                            <MdSchedule size={13} />
                                            {formatarHoras(calcularHorasDeVida(despesa.valor, rendaMensalContexto, cargaHorariaContexto))}
                                        </p>
                                    )}
                                </div>

                                <div className={styles.acoesDespesa}>
                                    <Link className={styles.botaoIcone} to={`/despesas/editar/${despesa.id}`}>
                                        <MdEdit size={18} />
                                    </Link>
                                    <button
                                        className={styles.botaoIcone}
                                        onClick={() => removerDespesa(despesa.id)}
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
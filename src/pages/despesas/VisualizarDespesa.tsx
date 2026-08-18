import styles from './EditarDespesa.module.css'
import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdArrowBack, MdStar, MdStarBorder } from 'react-icons/md'
import { DespesasContexto } from '../../contexts/DespesasContexto'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { calcularHorasDeVida } from '../../utils/CalcularHorasDeVida'

type Humor = 'feliz' | 'ansioso' | 'estressado' | 'cansado' | 'neutro'

const opcoesHumor: { valor: Humor, rotulo: string, emoji: string }[] = [
    { valor: 'feliz', rotulo: 'Feliz', emoji: '😊' },
    { valor: 'ansioso', rotulo: 'Ansioso', emoji: '😰' },
    { valor: 'estressado', rotulo: 'Estressado', emoji: '😡' },
    { valor: 'cansado', rotulo: 'Cansado', emoji: '😴' },
    { valor: 'neutro', rotulo: 'Neutro', emoji: '😐' },
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

export function VisualizarDespesa() {

    const { id } = useParams<{ id: string }>()
    const { despesas } = useContext(DespesasContexto)
    const { rendaMensalContexto, cargaHorariaContexto } = useContext(BaseFinanceiraContexto)

    const despesa = despesas.find((d) => d.id === id)

    const formatarMoeda = (valor: number) =>
        valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const formatarData = (data: string) => {
        if (!data) return ''
        const [ano, mes, dia] = data.split('-')
        return `${dia}/${mes}/${ano}`
    }

    const formatarHoras = (horas: number) => {
        if (horas < 1) return `≈ ${Math.round(horas * 60)} min`
        return `≈ ${horas.toFixed(1)}h`
    }

    const baseFinanceiraPreenchida = rendaMensalContexto > 0 && cargaHorariaContexto > 0

    if (!despesa) {
        return (
            <div className={styles.conteiner}>
                <div className={styles.areaConteudo}>
                    <Link className={styles.botaoVoltar} to='/despesas'>
                        <MdArrowBack size={18} />
                        Voltar para Gastos Variáveis
                    </Link>
                    <div className={styles.cardFormulario}>
                        <p className={styles.tituloSecao}>Despesa não encontrada</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.conteiner}>
            <div className={styles.areaConteudo}>

                <Link className={styles.botaoVoltar} to='/despesas'>
                    <MdArrowBack size={18} />
                    Voltar para Gastos Variáveis
                </Link>

                <div className={styles.cardFormulario}>

                    <p className={styles.tituloSecao}>Detalhes da Despesa</p>

                    <div className={styles.linhaTripla}>
                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Nome:</p>
                            <div className={styles.campoVisualizacao}>{despesa.nome}</div>
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Data:</p>
                            <div className={styles.campoVisualizacao}>{formatarData(despesa.data)}</div>
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Valor:</p>
                            <div className={styles.campoVisualizacao}>
                                {formatarMoeda(despesa.valor)}
                                {baseFinanceiraPreenchida && (
                                    <span className={styles.horasDeVida}>
                                        {formatarHoras(calcularHorasDeVida(despesa.valor, rendaMensalContexto, cargaHorariaContexto))}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Categoria:</p>
                        <div className={styles.campoVisualizacao}>
                            <span
                                className={styles.bolinhaCor}
                                style={{ backgroundColor: coresCategorias[despesa.categoria] || '#E9F6FF' }}
                            />
                            {despesa.categoria}
                        </div>
                    </div>

                    {(despesa.humor || despesa.motivo || despesa.nivelArrependimento) && (
                        <div className={styles.cardEmocional}>
                            <p className={styles.tituloSecao}>Campos Emocionais</p>

                            {despesa.humor && (
                                <div className={styles.campo}>
                                    <p className={styles.perguntaHumor}>Como você estava se sentindo:</p>
                                    <div className={styles.listaHumor}>
                                        {opcoesHumor.map((opcao) => (
                                            <div
                                                key={opcao.valor}
                                                className={despesa.humor === opcao.valor
                                                    ? `${styles.itemHumor} ${styles.itemHumorAtivo}`
                                                    : styles.itemHumor}
                                                style={{ opacity: despesa.humor === opcao.valor ? 1 : 0.3 }}
                                            >
                                                <span className={styles.emojiHumor}>{opcao.emoji}</span>
                                                {opcao.rotulo}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {despesa.motivo && (
                                <div className={styles.campo}>
                                    <p className={styles.rotuloCampo}>Motivo:</p>
                                    <div className={styles.campoVisualizacao}>{despesa.motivo}</div>
                                </div>
                            )}

                            {despesa.nivelArrependimento !== undefined && despesa.nivelArrependimento > 0 && (
                                <div className={styles.linhaArrependimento}>
                                    <p className={styles.rotuloCampo}>Nível de arrependimento:</p>
                                    <div className={styles.estrelas}>
                                        {[1, 2, 3, 4, 5].map((numero) => (
                                            <span
                                                key={numero}
                                                className={numero <= (despesa.nivelArrependimento || 0)
                                                    ? `${styles.botaoEstrela} ${styles.estrelaPreenchida}`
                                                    : styles.botaoEstrela}
                                            >
                                                {numero <= (despesa.nivelArrependimento || 0)
                                                    ? <MdStar size={26} />
                                                    : <MdStarBorder size={26} />}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}
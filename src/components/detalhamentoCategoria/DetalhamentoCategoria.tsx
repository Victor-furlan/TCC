import styles from './DetalhamentoCategoria.module.css'
import { MdInbox } from 'react-icons/md'
import type { DadoCategoria } from '../../utils/AgregarPorCategoria'
import { calcularHorasDeVida } from '../../utils/CalcularHorasDeVida'

interface DetalhamentoCategoriasProps {
    dados: DadoCategoria[]
    rendaMensal?: number
    cargaHoraria?: number
    textoVazio?: string
}

const coresCategorias: Record<string, string> = {
    'Entretenimento': 'var(--categoria-entretenimento)',
    'Software': 'var(--categoria-software)',
    'Compras': 'var(--categoria-compras)',
    'Utilidades': 'var(--categoria-utilidades)',
    'Alimentação': 'var(--categoria-alimentacao)',
    'Saúde': 'var(--categoria-saude)',
    'Educação': 'var(--categoria-educacao)',
}

const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatarHoras = (horas: number) => {
    if (horas < 1) return `≈ ${Math.round(horas * 60)} min`
    return `≈ ${horas.toFixed(1)}h`
}

export function DetalhamentoCategorias({ dados, rendaMensal = 0, cargaHoraria = 0, textoVazio }: DetalhamentoCategoriasProps) {

    if (dados.length === 0) {
        return (
            <div className={styles.conteudoVazio}>
                <MdInbox size={40} className={styles.iconeVazio} />
                <p className={styles.textoVazio}>{textoVazio || 'Nenhum dado cadastrado ainda'}</p>
            </div>
        )
    }

    const totalGeral = dados.reduce((soma, d) => soma + d.valor, 0)
    const basePreenchida = rendaMensal > 0 && cargaHoraria > 0

    return (
        <div className={styles.lista}>
            {dados.map((dado) => {
                const percentual = totalGeral > 0 ? (dado.valor / totalGeral) * 100 : 0
                const horas = basePreenchida ? calcularHorasDeVida(dado.valor, rendaMensal, cargaHoraria) : 0

                return (
                    <div key={dado.categoria} className={styles.itemCategoria}>
                        <div
                            className={styles.bolinha}
                            style={{ backgroundColor: coresCategorias[dado.categoria] || '#E9F6FF' }}
                        />

                        <div className={styles.infoCategoria}>
                            <div className={styles.linhaPrincipal}>
                                <p className={styles.nomeCategoria}>{dado.categoria}</p>
                                <p className={styles.valorCategoria}>{formatarMoeda(dado.valor)}</p>
                            </div>

                            <div className={styles.barraProgresso}>
                                <div
                                    className={styles.barraPreenchimento}
                                    style={{
                                        width: `${percentual}%`,
                                        backgroundColor: coresCategorias[dado.categoria] || '#E9F6FF',
                                    }}
                                />
                            </div>

                            <div className={styles.linhaSecundaria}>
                                <p className={styles.metaDados}>
                                    {dado.quantidade} {dado.quantidade === 1 ? 'item' : 'itens'} · {percentual.toFixed(1)}% do total
                                </p>
                                {basePreenchida && (
                                    <p className={styles.horasDeVida}>{formatarHoras(horas)} de vida</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
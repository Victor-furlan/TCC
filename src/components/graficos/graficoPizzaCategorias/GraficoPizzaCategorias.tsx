import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import styles from './GraficoPizzaCategorias.module.css'
import { MdPieChart } from 'react-icons/md'
import type { DadoCategoria } from '../../../utils/AgregarPorCategoria'
import { calcularHorasDeVida } from '../../../utils/CalcularHorasDeVida'

interface GraficoPizzaCategoriasProps {
    dados: DadoCategoria[]
    textoVazio?: string
    rendaMensal?: number
    cargaHoraria?: number
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

function TooltipPersonalizado({ active, payload, rendaMensal, cargaHoraria }: any) {
    if (!active || !payload || payload.length === 0) return null

    const dado: DadoCategoria = payload[0].payload
    const basePreenchida = rendaMensal > 0 && cargaHoraria > 0

    return (
        <div className={styles.tooltip}>
            <p className={styles.tooltipCategoria}>{dado.categoria}</p>
            <p className={styles.tooltipValor}>{formatarMoeda(dado.valor)}</p>
            <p className={styles.tooltipQuantidade}>
                {dado.quantidade} {dado.quantidade === 1 ? 'item' : 'itens'}
            </p>
            {basePreenchida && (
                <p className={styles.tooltipHoras}>
                    {formatarHoras(calcularHorasDeVida(dado.valor, rendaMensal, cargaHoraria))} de vida
                </p>
            )}
        </div>
    )
}

export function GraficoPizzaCategorias({ dados, textoVazio, rendaMensal = 0, cargaHoraria = 0 }: GraficoPizzaCategoriasProps) {

    if (dados.length === 0) {
        return (
            <div className={styles.conteudoVazio}>
                <MdPieChart size={48} className={styles.iconeVazio} />
                <p className={styles.textoVazio}>{textoVazio || 'Nenhum dado cadastrado ainda'}</p>
            </div>
        )
    }

    return (
        <div className={styles.conteiner}>
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={dados}
                        dataKey="valor"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        paddingAngle={2}
                    >
                        {dados.map((entrada) => (
                            <Cell
                                key={entrada.categoria}
                                fill={coresCategorias[entrada.categoria] || '#E9F6FF'}
                                stroke="var(--white)"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<TooltipPersonalizado rendaMensal={rendaMensal} cargaHoraria={cargaHoraria} />} />
                    <Legend
                        formatter={(valor) => <span className={styles.legenda}>{valor}</span>}
                        iconType="circle"
                        iconSize={8}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
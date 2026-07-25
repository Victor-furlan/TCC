import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import styles from './GraficoBarrasCategorias.module.css'
import { MdBarChart } from 'react-icons/md'
import type { DadoCategoria } from '../../../utils/AgregarPorCategoria'
import { calcularHorasDeVida } from '../../../utils/CalcularHorasDeVida'

interface GraficoBarrasCategoriasProps {
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

export function GraficoBarrasCategorias({ dados, textoVazio, rendaMensal = 0, cargaHoraria = 0 }: GraficoBarrasCategoriasProps) {

    if (dados.length === 0) {
        return (
            <div className={styles.conteudoVazio}>
                <MdBarChart size={48} className={styles.iconeVazio} />
                <p className={styles.textoVazio}>{textoVazio || 'Nenhum dado cadastrado ainda'}</p>
            </div>
        )
    }

    return (
        <div className={styles.conteiner}>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dados} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--columbia-blue)" vertical={false} />
                    <XAxis
                        dataKey="categoria"
                        tick={{ fill: 'var(--cor-texto-secundario)', fontSize: 11, fontStyle: 'italic' }}
                        axisLine={{ stroke: 'var(--columbia-blue)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: 'var(--cor-texto-secundario)', fontSize: 11, fontStyle: 'italic' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(valor) => `R$${valor}`}
                    />
                    <Tooltip content={<TooltipPersonalizado rendaMensal={rendaMensal} cargaHoraria={cargaHoraria} />} cursor={{ fill: 'var(--fundo-formulario-campo)' }} />
                    <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                        {dados.map((entrada) => (
                            <Cell
                                key={entrada.categoria}
                                fill={coresCategorias[entrada.categoria] || '#E9F6FF'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
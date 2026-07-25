import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import styles from './GraficoHumorGastos.module.css'
import type { DadoGraficoHumor } from '../../../utils/AgregarDadosGrafico'
import { MdShowChart } from 'react-icons/md'

interface GraficoHumorGastosProps {
    dados: DadoGraficoHumor[]
}

const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function TooltipPersonalizado({ active, payload }: any) {
    if (!active || !payload || payload.length === 0) return null

    const dado: DadoGraficoHumor = payload[0].payload

    return (
        <div className={styles.tooltip}>
            <p className={styles.tooltipHumor}>{dado.rotulo}</p>
            <p className={styles.tooltipValor}>Média: {formatarMoeda(dado.valorMedio)}</p>
            <p className={styles.tooltipQuantidade}>
                {dado.quantidade} {dado.quantidade === 1 ? 'gasto' : 'gastos'}
            </p>
        </div>
    )
}

export function GraficoHumorGastos({ dados }: GraficoHumorGastosProps) {

    if (dados.length === 0) {
        return (
            <div className={styles.conteudoVazio}>
                <MdShowChart size={48} className={styles.iconeVazio} />
                <p className={styles.textoVazio}>Registre despesas com humor preenchido para ver o gráfico</p>
            </div>
        )
    }

    return (
        <div className={styles.conteiner}>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dados} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--columbia-blue)" vertical={false} />
                    <XAxis
                        dataKey="rotulo"
                        tick={{ fill: 'var(--cor-texto-secundario)', fontSize: 12, fontStyle: 'italic' }}
                        axisLine={{ stroke: 'var(--columbia-blue)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: 'var(--cor-texto-secundario)', fontSize: 12, fontStyle: 'italic' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(valor) => `R$${valor}`}
                    />
                    <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: 'var(--fundo-formulario-campo)' }} />
                    <Bar dataKey="valorMedio" fill="var(--cor-primaria)" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
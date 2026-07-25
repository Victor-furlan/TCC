import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from 'recharts'
import styles from './GraficoTendenciaMensal.module.css'
import type { DespesaTipo } from '../../../contexts/DespesasContexto'
import type { AssinaturaTipo } from '../../../contexts/AssinaturasContexto'
import { agregarTendenciaMensal } from '../../../utils/AgregarTendenciaMensal'

interface GraficoTendenciaMensalProps {
    despesas: DespesaTipo[]
    assinaturas: AssinaturaTipo[]
}

interface TooltipPersonalizadoProps {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}

const OPCOES_PERIODO = [
    { label: '3 meses', valor: 3 },
    { label: '6 meses', valor: 6 },
    { label: '12 meses', valor: 12 },
]

const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function TooltipPersonalizado({ active, payload, label }: TooltipPersonalizadoProps) {
    if (!active || !payload || payload.length === 0) return null

    return (
        <div className={styles.tooltip}>
            <p className={styles.tooltipMes}>{label}</p>
            <p className={styles.tooltipValor}>{formatarMoeda(payload[0].value)}</p>
        </div>
    )
}

export function GraficoTendenciaMensal({ despesas, assinaturas }: GraficoTendenciaMensalProps) {

    const [periodoSelecionado, setPeriodoSelecionado] = useState(6)

    const dados = agregarTendenciaMensal(despesas, assinaturas, periodoSelecionado)

    return (
        <div className={styles.conteiner}>
            <div className={styles.cabecalho}>
                <p className={styles.titulo}>Evolução de Gastos</p>
                <div className={styles.seletorPeriodo}>
                    {OPCOES_PERIODO.map((opcao) => (
                        <button
                            key={opcao.valor}
                            className={periodoSelecionado === opcao.valor
                                ? `${styles.botaoPeriodo} ${styles.botaoPeriodoAtivo}`
                                : styles.botaoPeriodo
                            }
                            onClick={() => setPeriodoSelecionado(opcao.valor)}
                        >
                            {opcao.label}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dados} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--columbia-blue)" vertical={false} />
                    <XAxis
                        dataKey="mes"
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
                    <Tooltip content={<TooltipPersonalizado />} />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--cor-primaria)"
                        strokeWidth={2.5}
                        dot={<Dot r={4} fill="var(--cor-primaria)" stroke="var(--white)" strokeWidth={2} />}
                        activeDot={{ r: 6, fill: 'var(--cor-primaria)', stroke: 'var(--white)', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
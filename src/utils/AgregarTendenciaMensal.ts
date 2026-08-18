import type { DespesaTipo } from '../contexts/DespesasContexto'
import type { AssinaturaTipo } from '../contexts/AssinaturasContexto'

export interface DadoTendencia {
    mes: string
    total: number
}

function valorMensalizado(assinatura: AssinaturaTipo) {
    if (assinatura.periodicidade === 'anual') return assinatura.valor / 12
    if (assinatura.periodicidade === 'semanal') return assinatura.valor * 4
    return assinatura.valor
}

const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function agregarTendenciaMensal(
    despesas: DespesaTipo[],
    assinaturas: AssinaturaTipo[],
    meses: number
): DadoTendencia[] {
    const hoje = new Date()
    const totalAssinaturas = assinaturas.reduce((soma, a) => soma + valorMensalizado(a), 0)

    return Array.from({ length: meses }, (_, i) => {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - (meses - 1 - i), 1)
        const ano = data.getFullYear()
        const mes = data.getMonth()

        const totalDespesasMes = despesas
            .filter((d) => {
                const [dAno, dMes] = d.data.split('-').map(Number)
                return dAno === ano && dMes === mes + 1
            })
            .reduce((soma, d) => soma + d.valor, 0)

        return {
            mes: `${NOMES_MESES[mes]}/${String(ano).slice(2)}`,
            total: totalDespesasMes + totalAssinaturas,
        }
    })
}
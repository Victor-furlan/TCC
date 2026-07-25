import type { DespesaTipo } from '../contexts/DespesasContexto'
import type { AssinaturaTipo } from '../contexts/AssinaturasContexto'

export interface DadoCategoria {
    categoria: string
    valor: number
    quantidade: number
}

function valorMensalizado(assinatura: AssinaturaTipo) {
    if (assinatura.periodicidade === 'Anual') return assinatura.valor / 12
    if (assinatura.periodicidade === 'Semanal') return assinatura.valor * 4
    return assinatura.valor
}

export function agregarAssinaturasPorCategoria(assinaturas: AssinaturaTipo[]): DadoCategoria[] {
    const grupos = new Map<string, { valor: number, quantidade: number }>()

    for (const assinatura of assinaturas) {
        const atual = grupos.get(assinatura.categoria) ?? { valor: 0, quantidade: 0 }
        grupos.set(assinatura.categoria, {
            valor: atual.valor + valorMensalizado(assinatura),
            quantidade: atual.quantidade + 1,
        })
    }

    return Array.from(grupos, ([categoria, { valor, quantidade }]) => ({ categoria, valor, quantidade }))
        .sort((a, b) => b.valor - a.valor)
}

export function agregarDespesasPorCategoria(despesas: DespesaTipo[]): DadoCategoria[] {
    const grupos = new Map<string, { valor: number, quantidade: number }>()

    for (const despesa of despesas) {
        const atual = grupos.get(despesa.categoria) ?? { valor: 0, quantidade: 0 }
        grupos.set(despesa.categoria, {
            valor: atual.valor + despesa.valor,
            quantidade: atual.quantidade + 1,
        })
    }

    return Array.from(grupos, ([categoria, { valor, quantidade }]) => ({ categoria, valor, quantidade }))
        .sort((a, b) => b.valor - a.valor)
}

export function agregarTodasPorCategoria(
    despesas: DespesaTipo[],
    assinaturas: AssinaturaTipo[]
): DadoCategoria[] {
    const grupos = new Map<string, { valor: number, quantidade: number }>()

    for (const despesa of despesas) {
        const atual = grupos.get(despesa.categoria) ?? { valor: 0, quantidade: 0 }
        grupos.set(despesa.categoria, {
            valor: atual.valor + despesa.valor,
            quantidade: atual.quantidade + 1,
        })
    }

    for (const assinatura of assinaturas) {
        const atual = grupos.get(assinatura.categoria) ?? { valor: 0, quantidade: 0 }
        grupos.set(assinatura.categoria, {
            valor: atual.valor + valorMensalizado(assinatura),
            quantidade: atual.quantidade + 1,
        })
    }

    return Array.from(grupos, ([categoria, { valor, quantidade }]) => ({ categoria, valor, quantidade }))
        .sort((a, b) => b.valor - a.valor)
}
import type { DespesaTipo } from '../contexts/DespesasContexto'

export interface DadoGraficoHumor {
    humor: string
    rotulo: string
    valorMedio: number
    quantidade: number
}

const ORDEM_HUMOR: { valor: string, rotulo: string }[] = [
    { valor: 'feliz', rotulo: '😊 Feliz' },
    { valor: 'ansioso', rotulo: '😰 Ansioso' },
    { valor: 'estressado', rotulo: '😡 Estressado' },
    { valor: 'cansado', rotulo: '😴 Cansado' },
    { valor: 'neutro', rotulo: '😐 Neutro' },
]

export function agregarDadosPorHumor(despesas: DespesaTipo[]): DadoGraficoHumor[] {
    const grupos = new Map<string, number[]>()

    for (const despesa of despesas) {
        if (!despesa.humor) continue
        if (!grupos.has(despesa.humor)) grupos.set(despesa.humor, [])
        grupos.get(despesa.humor)!.push(despesa.valor)
    }

    const dados: DadoGraficoHumor[] = []

    for (const { valor, rotulo } of ORDEM_HUMOR) {
        const valores = grupos.get(valor)
        if (!valores || valores.length === 0) continue

        const valorMedio = valores.reduce((soma, v) => soma + v, 0) / valores.length

        dados.push({
            humor: valor,
            rotulo,
            valorMedio,
            quantidade: valores.length,
        })
    }

    return dados
}
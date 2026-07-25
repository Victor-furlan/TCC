import type { DespesaTipo } from '../contexts/DespesasContexto'

export interface Insight {
    id: string
    texto: string
    forca: number // usado só pra ordenar (maior = mais relevante), não é exibido
}

// limiares mínimos de amostra pra evitar insight de ruído estatístico
const MIN_AMOSTRAS_HUMOR = 4
const MIN_AMOSTRAS_CATEGORIA_HUMOR = 3
const MIN_AMOSTRAS_ARREPENDIMENTO = 3
const LIMIAR_PERCENTUAL = 15 // % de desvio mínimo pra considerar relevante
const ARREPENDIMENTO_ALTO = 4 // nivelArrependimento >= 4 é considerado "se arrependeu"

function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function media(valores: number[]) {
    if (valores.length === 0) return 0
    return valores.reduce((soma, v) => soma + v, 0) / valores.length
}

// 1. Humor x valor gasto: "Você gasta X% a mais quando está [humor]"
function insightHumorValor(despesas: DespesaTipo[]): Insight[] {
    const comHumor = despesas.filter((d) => d.humor)
    if (comHumor.length < MIN_AMOSTRAS_HUMOR) return []

    const mediaGeral = media(comHumor.map((d) => d.valor))
    if (mediaGeral === 0) return []

    const grupos = new Map<string, number[]>()
    for (const d of comHumor) {
        const humor = d.humor as string
        if (!grupos.has(humor)) grupos.set(humor, [])
        grupos.get(humor)!.push(d.valor)
    }

    const insights: Insight[] = []

    for (const [humor, valores] of grupos) {
        if (valores.length < MIN_AMOSTRAS_HUMOR) continue

        const mediaGrupo = media(valores)
        const desvioPercentual = ((mediaGrupo - mediaGeral) / mediaGeral) * 100

        if (desvioPercentual >= LIMIAR_PERCENTUAL) {
            insights.push({
                id: `humor-valor-${humor}`,
                texto: `Você gasta ${Math.round(desvioPercentual)}% a mais quando está ${humor.toLowerCase()} (média: ${formatarMoeda(mediaGrupo)})`,
                forca: desvioPercentual,
            })
        }
    }

    return insights
}

// 2. Categoria x humor: "Seus gastos com [categoria] aumentam quando está [humor]"
function insightCategoriaHumor(despesas: DespesaTipo[]): Insight[] {
    const comHumor = despesas.filter((d) => d.humor)
    if (comHumor.length < MIN_AMOSTRAS_CATEGORIA_HUMOR) return []

    const mediaPorCategoria = new Map<string, number>()
    const valoresPorCategoria = new Map<string, number[]>()
    for (const d of comHumor) {
        if (!valoresPorCategoria.has(d.categoria)) valoresPorCategoria.set(d.categoria, [])
        valoresPorCategoria.get(d.categoria)!.push(d.valor)
    }
    for (const [categoria, valores] of valoresPorCategoria) {
        mediaPorCategoria.set(categoria, media(valores))
    }

    const gruposParChave = new Map<string, number[]>()
    for (const d of comHumor) {
        const chave = `${d.categoria}|${d.humor}`
        if (!gruposParChave.has(chave)) gruposParChave.set(chave, [])
        gruposParChave.get(chave)!.push(d.valor)
    }

    const insights: Insight[] = []

    for (const [chave, valores] of gruposParChave) {
        if (valores.length < MIN_AMOSTRAS_CATEGORIA_HUMOR) continue

        const [categoria, humor] = chave.split('|')
        const mediaCategoria = mediaPorCategoria.get(categoria) ?? 0
        if (mediaCategoria === 0) continue

        const mediaPar = media(valores)
        const desvioPercentual = ((mediaPar - mediaCategoria) / mediaCategoria) * 100

        if (desvioPercentual >= LIMIAR_PERCENTUAL) {
            insights.push({
                id: `categoria-humor-${chave}`,
                texto: `Seus gastos com ${categoria} aumentam quando está ${humor.toLowerCase()}`,
                forca: desvioPercentual,
            })
        }
    }

    return insights
}

// 3. Arrependimento x padrão: "Você costuma se arrepender de compras acima de R$X"
function insightArrependimento(despesas: DespesaTipo[]): Insight[] {
    const arrependidas = despesas.filter(
        (d) => (d.nivelArrependimento ?? 0) >= ARREPENDIMENTO_ALTO
    )
    if (arrependidas.length < MIN_AMOSTRAS_ARREPENDIMENTO) return []

    const insights: Insight[] = []

    // padrão por valor: limiar = menor valor entre as arrependidas (garante que a frase seja verdadeira pro grupo todo)
    const menorValorArrependido = Math.min(...arrependidas.map((d) => d.valor))
    const limiarArredondado = Math.floor(menorValorArrependido / 10) * 10

    if (limiarArredondado > 0) {
        insights.push({
            id: 'arrependimento-valor',
            texto: `Você costuma se arrepender de compras acima de ${formatarMoeda(limiarArredondado)}`,
            forca: arrependidas.length,
        })
    }

    // padrão por categoria: categoria mais frequente entre as arrependidas
    const contagemCategoria = new Map<string, number>()
    for (const d of arrependidas) {
        contagemCategoria.set(d.categoria, (contagemCategoria.get(d.categoria) ?? 0) + 1)
    }

    let categoriaTopo = ''
    let maiorContagem = 0
    for (const [categoria, contagem] of contagemCategoria) {
        if (contagem > maiorContagem) {
            categoriaTopo = categoria
            maiorContagem = contagem
        }
    }

    const proporcao = maiorContagem / arrependidas.length
    if (maiorContagem >= MIN_AMOSTRAS_ARREPENDIMENTO && proporcao >= 0.5) {
        insights.push({
            id: `arrependimento-categoria-${categoriaTopo}`,
            texto: `Você costuma se arrepender de compras na categoria ${categoriaTopo}`,
            forca: maiorContagem * proporcao * 10,
        })
    }

    return insights
}

export function gerarInsights(despesas: DespesaTipo[]): Insight[] {
    const todosInsights = [
        ...insightHumorValor(despesas),
        ...insightCategoriaHumor(despesas),
        ...insightArrependimento(despesas),
    ]

    return todosInsights.sort((a, b) => b.forca - a.forca)
}
import { createContext, useState, type ReactNode } from 'react'

export interface DespesaTipo {
    id: string
    nome: string
    data: string
    valor: number
    categoria: string
    motivo?: string
    humor?: string
    nivelArrependimento?: number
}

interface DespesasContextoTipo {
    despesas: DespesaTipo[]
    adicionarDespesa: (despesa: Omit<DespesaTipo, 'id'>) => void
    removerDespesa: (id: string) => void
    editarDespesa: (id: string, dadosAtualizados: Omit<DespesaTipo, 'id'>) => void
}

export const DespesasContexto = createContext({} as DespesasContextoTipo)

interface DespesasProviderProps {
    children: ReactNode
}

export function DespesasProvider({ children }: DespesasProviderProps) {

    const [despesas, setDespesas] = useState<DespesaTipo[]>([])

    const adicionarDespesa = (despesa: Omit<DespesaTipo, 'id'>) => {
        const novaDespesa: DespesaTipo = {
            ...despesa,
            id: crypto.randomUUID(),
        }
        setDespesas((atual) => [...atual, novaDespesa])
    }

    const removerDespesa = (id: string) => {
        setDespesas((atual) => atual.filter((despesa) => despesa.id !== id))
    }

    const editarDespesa = (id: string, dadosAtualizados: Omit<DespesaTipo, 'id'>) => {
        setDespesas((atual) => atual.map((despesa) =>
            despesa.id === id ? { ...dadosAtualizados, id } : despesa
        ))
    }

    return (
        <DespesasContexto.Provider value={{ despesas, adicionarDespesa, removerDespesa, editarDespesa }}>
            {children}
        </DespesasContexto.Provider>
    )
}
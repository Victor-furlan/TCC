import { createContext, useState, type ReactNode } from 'react'

export interface AssinaturaTipo {
    id: string
    nome: string
    valor: number
    periodicidade: string
    categoria: string
    proximaCobranca: string
    motivo?: string
    humor?: string
    nivelArrependimento?: number
}

interface AssinaturasContextoTipo {
    assinaturas: AssinaturaTipo[]
    adicionarAssinatura: (assinatura: Omit<AssinaturaTipo, 'id'>) => void
    removerAssinatura: (id: string) => void
    editarAssinatura: (id: string, dadosAtualizados: Omit<AssinaturaTipo, 'id'>) => void
}

export const AssinaturasContexto = createContext({} as AssinaturasContextoTipo)

interface AssinaturasProviderProps {
    children: ReactNode
}

export function AssinaturasProvider({ children }: AssinaturasProviderProps) {

    const [assinaturas, setAssinaturas] = useState<AssinaturaTipo[]>([])

    const adicionarAssinatura = (assinatura: Omit<AssinaturaTipo, 'id'>) => {
        const novaAssinatura: AssinaturaTipo = {
            ...assinatura,
            id: crypto.randomUUID(),
        }
        setAssinaturas((atual) => [...atual, novaAssinatura])
    }

    const removerAssinatura = (id: string) => {
        setAssinaturas((atual) => atual.filter((assinatura) => assinatura.id !== id))
    }

    const editarAssinatura = (id: string, dadosAtualizados: Omit<AssinaturaTipo, 'id'>) => {
        setAssinaturas((atual) => atual.map((assinatura) =>
            assinatura.id === id ? { ...dadosAtualizados, id } : assinatura
        ))
    }

    return (
        <AssinaturasContexto.Provider value={{ assinaturas, adicionarAssinatura, removerAssinatura, editarAssinatura }}>
            {children}
        </AssinaturasContexto.Provider>
    )
}
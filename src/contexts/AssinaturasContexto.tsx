import { createContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../services/supabase';

export interface AssinaturaTipo {
    id: string
    nome: string
    valor: number
    periodicidade: string
    categoria: string
    proximaCobranca: string
    ativa: boolean
    motivo?: string
    humor?: string
    nivelArrependimento?: number
}

interface AssinaturasContextoTipo {
    assinaturas: AssinaturaTipo[]
    carregando: boolean
    adicionarAssinatura: (assinatura: Omit<AssinaturaTipo, 'id'>) => Promise<void>
    removerAssinatura: (id: string) => Promise<void>
    editarAssinatura: (id: string, dadosAtualizados: Omit<AssinaturaTipo, 'id'>) => Promise<void>
}

export const AssinaturasContexto = createContext({} as AssinaturasContextoTipo)

interface AssinaturasProviderProps {
    children: ReactNode
}

export function AssinaturasProvider({ children }: AssinaturasProviderProps) {

    const [assinaturas, setAssinaturas] = useState<AssinaturaTipo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const buscarAssinaturas = async (userId: string) => {
            const {data} = await supabase
                .from('assinaturas')
                .select('*')
                .eq('user_id', userId)
                .order('criado_em', {ascending: false})

                if (data) {
                    setAssinaturas(data.map((a) => ({
                    id: a.id,
                    nome: a.nome,
                    valor: a.valor,
                    periodicidade: a.periodicidade,
                    categoria: a.categoria,
                    proximaCobranca: a.proxima_cobranca,
                    ativa: a.ativa,
                    motivo: a.motivo,
                    humor: a.humor,
                    nivelArrependimento: a.nivel_arrependimento,
                    })))
                }
                setCarregando(false)
        }

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                buscarAssinaturas(session.user.id)
            }else{
                setAssinaturas([])
                setCarregando(false)
            }
        })

        return () => subscription.unsubscribe()
    },[])

    const adicionarAssinatura = async (assinatura: Omit<AssinaturaTipo, 'id'>) => {
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) return

        const {data, error} = await supabase
            .from('assinaturas')
            .insert({
                                user_id: user.id,
                nome: assinatura.nome,
                valor: assinatura.valor,
                periodicidade: assinatura.periodicidade,
                categoria: assinatura.categoria,
                proxima_cobranca: assinatura.proximaCobranca,
                ativa: assinatura.ativa,
                motivo: assinatura.motivo,
                humor: assinatura.humor,
                nivel_arrependimento: assinatura.nivelArrependimento,
            })
            .select()
            .single()

            if(!error && data) {
                setAssinaturas((atual) => [{
                    id: data.id,
                    nome: data.nome,
                    valor: data.valor,
                    periodicidade: data.periodicidade,
                    categoria: data.categoria,
                    proximaCobranca: data.proxima_cobranca,
                    ativa: data.ativa,
                    motivo: data.motivo,
                    humor: data.humor,
                    nivelArrependimento: data.nivel_arrependimento,
                }, ...atual])
            }
    }

    const removerAssinatura = async (id: string) => {
        const {error} = await supabase
            .from('assinaturas')
            .delete()
            .eq('id', id)

            if (!error) {
                setAssinaturas((atual) => atual.filter((a) => a.id !== id))
            }
    }

    const editarAssinatura = async (id: string, dadosAtualizados: Omit<AssinaturaTipo, 'id'>) => {
        const {error} = await supabase
            .from('assinaturas')
            .update({
                nome: dadosAtualizados.nome,
                valor: dadosAtualizados.valor,
                periodicidade: dadosAtualizados.periodicidade,
                categoria: dadosAtualizados.categoria,
                proxima_cobranca: dadosAtualizados.proximaCobranca,
                ativa: dadosAtualizados.ativa,
                motivo: dadosAtualizados.motivo,
                humor: dadosAtualizados.humor,
                nivel_arrependimento: dadosAtualizados.nivelArrependimento,
            })
            .eq('id', id)

            if (!error) {
                setAssinaturas((atual) => atual.map((a) => 
                    a.id === id ? { ...dadosAtualizados, id } : a
                ))
            }
    }

    return (
        <AssinaturasContexto.Provider value={{ assinaturas, carregando, adicionarAssinatura, removerAssinatura, editarAssinatura }}>
            {children}
        </AssinaturasContexto.Provider>
    )
}
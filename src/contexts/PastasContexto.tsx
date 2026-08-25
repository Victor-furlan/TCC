import { createContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../services/supabase'

export interface PastaTipo {
    id: string
    nome: string
    cor: string
}

interface PastasContextoTipo {
    pastas: PastaTipo[]
    carregando: boolean
    adicionarPasta: (nome: string, cor: string) => Promise<void>
    removerPasta: (id: string, onRemovida?: (id: string) => void) => Promise<void>
}

export const PastasContexto = createContext({} as PastasContextoTipo)

interface PastasProviderProps {
    children: ReactNode
}

export function PastasProvider({ children }: PastasProviderProps) {

    const [pastas, setPastas] = useState<PastaTipo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const buscarPastas = async (userId: string) => {
            const { data } = await supabase
                .from('pastas')
                .select('*')
                .eq('user_id', userId)
                .order('criado_em', { ascending: true })

            if (data) {
                setPastas(data.map((p) => ({ id: p.id, nome: p.nome, cor: p.cor })))
            }
            setCarregando(false)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                buscarPastas(session.user.id)
            } else {
                setPastas([])
                setCarregando(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const adicionarPasta = async (nome: string, cor: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('pastas')
            .insert({ user_id: user.id, nome, cor })
            .select()
            .single()

        if (!error && data) {
            setPastas((atual) => [...atual, { id: data.id, nome: data.nome, cor: data.cor }])
        }
    }

    const removerPasta = async (id: string, onRemovida?: (id: string) => void) => {
        const { error } = await supabase
            .from('pastas')
            .delete()
            .eq('id', id)

        if (!error) {
            setPastas((atual) => atual.filter((p) => p.id !== id))
            onRemovida?.(id)
        }
    }

    return (
        <PastasContexto.Provider value={{ pastas, carregando, adicionarPasta, removerPasta }}>
            {children}
        </PastasContexto.Provider>
    )
}
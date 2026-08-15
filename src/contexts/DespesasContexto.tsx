import { createContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../services/supabase';

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
    carregando: boolean
    adicionarDespesa: (despesa: Omit<DespesaTipo, 'id'>) => Promise<void>
    removerDespesa: (id: string) => Promise<void>
    editarDespesa: (id: string, dadosAtualizados: Omit<DespesaTipo, 'id'>) => Promise<void>
}

export const DespesasContexto = createContext({} as DespesasContextoTipo)

interface DespesasProviderProps {
    children: ReactNode
}

export function DespesasProvider({ children }: DespesasProviderProps) {

    const [despesas, setDespesas] = useState<DespesaTipo[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const buscarDespesas = async (userId: string) => {
            const {data} = await supabase
            .from('despesas')
            .select('*')
            .eq('user_id', userId)
            .order('criado_em', {ascending: false})

            if (data) {
                setDespesas(data.map((d) => ({
                    id: d.id,
                    nome: d.nome,
                    valor: d.valor,
                    data: d.data,
                    categoria: d.categoria,
                    motivo: d.motivo,
                    humor: d.humor,
                    nivelArrependimento: d.nivel_arrependimento,
                })))
            }
            setCarregando(false)
        }

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                buscarDespesas(session.user.id)
            }else{
                setDespesas([])
                setCarregando(false)
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const adicionarDespesa = async (despesa: Omit<DespesaTipo, 'id'>) => {
        const {data: {user}} = await supabase.auth.getUser()
        if(!user) return

        const {data, error} = await supabase
            .from('despesas')
            .insert({
                user_id: user.id,
                nome: despesa.nome,
                valor: despesa.valor,
                data: despesa.data,
                categoria: despesa.categoria,
                motivo: despesa.motivo,
                humor: despesa.humor,
                nivel_arrependimento: despesa.nivelArrependimento,
            })
            .select()
            .single()

            if (!error && data) {
                setDespesas((atual) => [{
                    id: data.id,
                    nome: data.nome,
                    valor: data.valor,
                    data: data.data,
                    categoria: data.categoria,
                    motivo: data.motivo,
                    humor: data.humor,
                    nivelArrependimento: data.nivel_arrependimento,
                }, ...atual])
            }
    }

    const removerDespesa =  async (id: string) => {
        const {error} = await supabase
            .from('despesas')
            .delete()
            .eq('id', id)

            if(!error) {
                setDespesas((atual) => atual.filter((d) => d.id !== id))
            }
    }

    const editarDespesa = async (id: string, dadosAtualizados: Omit<DespesaTipo, 'id'>) => {
        const {error} = await supabase
            .from('despesas')
            .update({
                nome: dadosAtualizados.nome,
                valor: dadosAtualizados.valor,
                data: dadosAtualizados.data,
                categoria: dadosAtualizados.categoria,
                motivo: dadosAtualizados.motivo,
                humor: dadosAtualizados.humor,
                nivel_arrependimento: dadosAtualizados.nivelArrependimento,
            })
            .eq('id', id)

            if(!error) {
                setDespesas((atual) => atual.map((d) =>
                    d.id === id ? { ...dadosAtualizados, id} : d
                ))
            }
    }

    return (
        <DespesasContexto.Provider value={{ despesas, carregando, adicionarDespesa, removerDespesa, editarDespesa }}>
            {children}
        </DespesasContexto.Provider>
    )
}
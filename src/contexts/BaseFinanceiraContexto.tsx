import { createContext, useEffect, useState } from 'react'
import { type ReactNode } from 'react';
import { supabase } from '../services/supabase';

interface BaseFinanceiraProviderProps {
  children: ReactNode
}

interface BaseFinanceiraTipoContexto {
  rendaMensalContexto: number
  cargaHorariaContexto: number
  carregando: boolean
  setRendaMensalContexto: (renda: number) => void
  setCargaHorariaContexto: (carga: number) => void
}

export const BaseFinanceiraContexto = createContext<BaseFinanceiraTipoContexto>({
  rendaMensalContexto: 0,
  cargaHorariaContexto: 0,
  carregando: true,
  setRendaMensalContexto: () => {},
  setCargaHorariaContexto: () => {}
})

export const BaseFinanceiraProvider = ({children}: BaseFinanceiraProviderProps) => {

  const [rendaMensalContexto, setRendaMensal] = useState(0)
  const [cargaHorariaContexto, setCargaHoraria] = useState(0)
  const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        const buscarBaseFinanceira = async (userId: string) => {
            const { data } = await supabase
                .from('usuarios')
                .select('renda_mensal, horas_trabalhadas')
                .eq('id', userId)
                .single()

            if (data) {
                setRendaMensal(data.renda_mensal ?? 0)
                setCargaHoraria(data.horas_trabalhadas ?? 0)
            }
            setCarregando(false)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                buscarBaseFinanceira(session.user.id)
            } else {
                setRendaMensal(0)
                setCargaHoraria(0)
                setCarregando(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const setRendaMensalContexto = async(renda: number) => {
      const {data:{user}} = await supabase.auth.getUser()
      if(!user) return

      await supabase
      .from('usuarios')
      .update({renda_mensal: renda})
      .eq('id', user.id)

      setRendaMensal(renda)
    }

    const setCargaHorariaContexto = async(carga: number) => {
      const {data:{user}} = await supabase.auth.getUser()
      if(!user) return

      await supabase
      .from('usuarios')
      .update({horas_trabalhadas: carga})
      .eq('id', user.id)

      setCargaHoraria(carga)
    }

  return (
    <BaseFinanceiraContexto.Provider value={{ rendaMensalContexto,
                                                setRendaMensalContexto,
                                                carregando,
                                                cargaHorariaContexto,
                                                setCargaHorariaContexto }}>
      {children}
    </BaseFinanceiraContexto.Provider>
  )
}
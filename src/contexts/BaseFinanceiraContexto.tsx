import { createContext, useState } from 'react'
import { type ReactNode } from 'react';

interface BaseFinanceiraProviderProps {
  children: ReactNode
}

interface BaseFinanceiraTipoContexto {
  rendaMensalContexto: number
  cargaHorariaContexto: number
  setRendaMensalContexto: (renda: number) => void
  setCargaHorariaContexto: (carga: number) => void
}

export const BaseFinanceiraContexto = createContext<BaseFinanceiraTipoContexto>({
  rendaMensalContexto: 0,
  cargaHorariaContexto: 0,
  setRendaMensalContexto: () => {},
  setCargaHorariaContexto: () => {}
})

export const BaseFinanceiraProvider = ({children}: BaseFinanceiraProviderProps) => {

  const [rendaMensalContexto, setRendaMensalContexto] = useState(0)
  const [cargaHorariaContexto, setCargaHorariaContexto] = useState(0)

  return (
    <BaseFinanceiraContexto.Provider value={{ rendaMensalContexto,
                                                setRendaMensalContexto,
                                                cargaHorariaContexto,
                                                setCargaHorariaContexto }}>
      {children}
    </BaseFinanceiraContexto.Provider>
  )
}
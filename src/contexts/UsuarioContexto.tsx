import { createContext, useState } from 'react'
import { type ReactNode } from 'react';

interface UsuarioProviderProps {
  children: ReactNode
}

interface UsuarioTipoContexto {
  nomeUsuarioContexto: string
  emailUsuarioContexto: string
  setNomeUsuarioContexto: (nome: string) => void
  setEmailUsuarioContexto: (email: string) => void
}

export const UsuarioContexto = createContext<UsuarioTipoContexto>({
  nomeUsuarioContexto: "",
  emailUsuarioContexto: "",
  setNomeUsuarioContexto: () => {},
  setEmailUsuarioContexto: () => {}
})

export const UsuarioProvider = ({children}: UsuarioProviderProps) => {

  const [nomeUsuarioContexto, setNomeUsuarioContexto] = useState('')
  const [emailUsuarioContexto, setEmailUsuarioContexto] = useState('')

  return (
    <UsuarioContexto.Provider value={{ nomeUsuarioContexto,
                                        setNomeUsuarioContexto,
                                        emailUsuarioContexto,
                                        setEmailUsuarioContexto }}>
      {children}
    </UsuarioContexto.Provider>
  )
}
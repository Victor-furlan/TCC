import { createContext, useEffect, useState } from 'react'
import { type ReactNode } from 'react';
import { supabase } from '../services/supabase';

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

  useEffect(() => {
      const carregarPerfil = async (userId: string) => {
          const { data } = await supabase
              .from('usuarios')
              .select('*')
              .eq('id', userId)
              .single()

          if (data) {
              setNomeUsuarioContexto(data.nome)
              setEmailUsuarioContexto(data.email)
          }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
              carregarPerfil(session.user.id)
          } else {
              setNomeUsuarioContexto('')
              setEmailUsuarioContexto('')
          }
      })

      return () => subscription.unsubscribe()
  }, [])

  return (
    <UsuarioContexto.Provider value={{ nomeUsuarioContexto,
                                        setNomeUsuarioContexto,
                                        emailUsuarioContexto,
                                        setEmailUsuarioContexto }}>
      {children}
    </UsuarioContexto.Provider>
  )
}
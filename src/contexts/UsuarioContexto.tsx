import { createContext, useEffect, useState } from 'react'
import { type ReactNode } from 'react';
import { supabase } from '../services/supabase';

interface UsuarioProviderProps {
  children: ReactNode
}

export interface CorHSL {
    h: number
    s: number
    l: number
}

export const coresPadrao: Record<string, CorHSL> = {
    'Entretenimento': { h: 0,   s: 100, l: 88 },
    'Software':       { h: 55,  s: 100, l: 88 },
    'Compras':        { h: 125, s: 100, l: 88 },
    'Utilidades':     { h: 25,  s: 100, l: 88 },
    'Alimentação':    { h: 210, s: 100, l: 88 },
    'Saúde':          { h: 310, s: 100, l: 88 },
    'Educação':       { h: 270, s: 100, l: 88 },
}

interface UsuarioTipoContexto {
  nomeUsuarioContexto: string
  emailUsuarioContexto: string
  coresCategorias: Record<string, CorHSL>
  setNomeUsuarioContexto: (nome: string) => void
  setEmailUsuarioContexto: (email: string) => void
  atualizarCorCategoria: (categoria: string, cor: CorHSL) => Promise<void>
}

export const UsuarioContexto = createContext<UsuarioTipoContexto>({
  nomeUsuarioContexto: "",
  emailUsuarioContexto: "",
  coresCategorias: coresPadrao,
  setNomeUsuarioContexto: () => {},
  setEmailUsuarioContexto: () => {},
  atualizarCorCategoria: async () => {},
})

export const UsuarioProvider = ({children}: UsuarioProviderProps) => {

  const [nomeUsuarioContexto, setNomeUsuarioContexto] = useState('')
  const [emailUsuarioContexto, setEmailUsuarioContexto] = useState('')
  const [coresCategorias, setCoresCategorias] = useState<Record<string, CorHSL>>(coresPadrao)

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
              setCoresCategorias({ ...coresPadrao, ...(data.cores_categorias ?? {}) })
          }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
              carregarPerfil(session.user.id)
          } else {
              setNomeUsuarioContexto('')
              setEmailUsuarioContexto('')
              setCoresCategorias(coresPadrao)
          }
      })

      return () => subscription.unsubscribe()
  }, [])

  const atualizarCorCategoria = async (categoria: string, cor: CorHSL) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const novasCores = { ...coresCategorias, [categoria]: cor }

      const { error } = await supabase
          .from('usuarios')
          .update({ cores_categorias: novasCores })
          .eq('id', user.id)

      if (!error) {
          setCoresCategorias(novasCores)
      }
  }

  return (
    <UsuarioContexto.Provider value={{
        nomeUsuarioContexto,
        setNomeUsuarioContexto,
        emailUsuarioContexto,
        setEmailUsuarioContexto,
        coresCategorias,
        atualizarCorCategoria,
    }}>
      {children}
    </UsuarioContexto.Provider>
  )
}
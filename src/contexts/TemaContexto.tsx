import { createContext, useContext, useState, type ReactNode } from "react"

interface TemaContextoTipo {
    tema: string
    alterarTema: () => void
}

export const TemaContexto = createContext({} as TemaContextoTipo)

interface TemaProviderProps {
    children: ReactNode
}

export function TemaProvider({children}: TemaProviderProps){

    const [tema, setTema] = useState(() => {
        const TemaSalvo = localStorage.getItem('tema') || 'claro'
        if (TemaSalvo === 'escuro') {
            document.documentElement.setAttribute('data-tema', 'escuro')
        }
        return TemaSalvo
    })

    const alterarTema = () => {
        if (tema === 'claro') {
            setTema('escuro')
            document.documentElement.setAttribute('data-tema', 'escuro')
            localStorage.setItem('tema', 'escuro')
        }else {
            setTema('claro')
            document.documentElement.removeAttribute('data-tema')
            localStorage.setItem('tema', 'claro')
        }
    }

    return(
        <TemaContexto.Provider value={{ tema, alterarTema}}>
            {children}
        </TemaContexto.Provider>
    )
}
import { useEffect, useContext } from 'react'
import { UsuarioContexto } from '../contexts/UsuarioContexto'

const mapa: Record<string, string> = {
    'Entretenimento': '--categoria-entretenimento',
    'Software': '--categoria-software',
    'Compras': '--categoria-compras',
    'Utilidades': '--categoria-utilidades',
    'Alimentação': '--categoria-alimentacao',
    'Saúde': '--categoria-saude',
    'Educação': '--categoria-educacao',
}

export function useCoresCategorias() {
    const { coresCategorias } = useContext(UsuarioContexto)

    useEffect(() => {
        const root = document.documentElement
        for (const [categoria, variavel] of Object.entries(mapa)) {
            const cor = coresCategorias[categoria]
            if (cor) {
                root.style.setProperty(variavel, `hsl(${cor.h}, ${cor.s}%, ${cor.l}%)`)
            }
        }
    }, [coresCategorias])
}
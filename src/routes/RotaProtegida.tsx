import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../services/supabase";

export function RotaProtegida() {
    const [carregando, setCarregando] = useState(true)
    const [autenticado, setAutenticado] = useState(false)
    const [precisaOnboarding, setPrecisaOnboarding] = useState(false)

    useEffect(() => {
        const verificar = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            console.log('session:', session)

            if (!session) {
                setAutenticado(false)
                setCarregando(false)
                return
            }

            setAutenticado(true)

            const { data, error } = await supabase
                .from('usuarios')
                .select('renda_mensal')
                .eq('id', session.user.id)
                .single()

            console.log('data:', data, 'error:', error)
            setPrecisaOnboarding(data?.renda_mensal === null || data?.renda_mensal === undefined)
            setCarregando(false)
        }

        verificar()
    }, [])

    console.log('carregando:', carregando, 'autenticado:', autenticado, 'precisaOnboarding:', precisaOnboarding)

    if (carregando) return null
    if (!autenticado) return <Navigate to='/' />
    if (precisaOnboarding) return <Navigate to='/onboarding' />

    return <Outlet />
}
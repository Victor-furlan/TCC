import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";

export function RotaProtegida() {
    const [carregando, setCarregando] = useState(true)
    const [autenticado, setAutenticado] = useState(false)
    const [precisaOnboarding, setPrecisaOnboarding] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const verificar = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                setAutenticado(false)
                setCarregando(false)
                return
            }

            setAutenticado(true)

            const { data } = await supabase
                .from('usuarios')
                .select('renda_mensal')
                .eq('id', session.user.id)
                .single()

            setPrecisaOnboarding(data?.renda_mensal === null || data?.renda_mensal === undefined || data?.renda_mensal === 0)
            setCarregando(false)
        }

        verificar()
    }, [])

    if (carregando) return null
    if (!autenticado) return <Navigate to='/' />
    if (precisaOnboarding && location.pathname !== '/onboarding') return <Navigate to='/onboarding' />

    return <Outlet />
}
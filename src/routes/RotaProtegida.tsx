import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../services/supabase";

export function RotaProtegida() {
    const [carregando, setCarregando] = useState(true)
    const [autenticado, setAutenticado] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setAutenticado(!!data.session)
            setCarregando(false)
        })
    }, [])
    
    if (carregando) return null

    return autenticado ? <Outlet /> : <Navigate to={'/'} />
}
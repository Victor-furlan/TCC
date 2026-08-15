import { supabase } from "../services/supabase";


export function useAuth() {

    const criarAuthUsuario = async (nome:string, email:string, password:string): Promise<string> => {
        let retorno = 'sucesso'

        try {
            const {data: authData, error} = await supabase.auth.signUp({
                email,
                password: password,
                options: {
                    data: {nome}
                }
            })

            if (error) return error.message

            await supabase.from('usuarios').insert({
                id: authData.user?.id,
                nome,
                email,
            })
        } catch (error) {
            retorno = `${error}`
        }

        return retorno
    }

    const loginAuthUsuario = async (email: string, password: string): Promise<string> => {
        let retorno = 'sucesso'

        try {
            const {error} = await supabase.auth.signInWithPassword({
                email,
                password: password,
            })

            if (error) return error.message
        } catch (error) {
            retorno = `${error}`
        }

        return retorno
    }

    const logOutAuth = async (): Promise<string> => {
        let retorno = 'sucesso'

        try {
            const { error } = await supabase.auth.signOut()
            if (error) return error.message

            const tema = localStorage.getItem('tema')
            const vlibras = localStorage.getItem('vlibras')
            
            localStorage.clear()
            
            if (tema) localStorage.setItem('tema', tema)
            if (vlibras) localStorage.setItem('vlibras', vlibras)
            
            window.location.href = '/'
        } catch (error) {
            retorno = `${error}`
        }

        return retorno
    }

    const atualizarPerfilAuth = async (nome:string,  email:string): Promise<string> => {
        let retorno = 'sucesso'

        try {
            const {data: {user}} = await supabase.auth.getUser()
            if(!user) return 'Usuário não encontrado'

            const {error} = await supabase
            .from('usuarios')
            .update({nome, email})
            .eq('id', user.id)

            if(error) return error.message
        } catch (error) {
            retorno = `${error}`
        }

        return retorno
    }

    const atualizarSenhaAuth = async (newPassword:string): Promise<string> => {
        let retorno = 'sucesso'

        try {
            const {error} = await supabase.auth.updateUser({password: newPassword})
            if(error) return error.message
        } catch (error) {
            retorno = `${error}`
        }

        return retorno
    }

    return {criarAuthUsuario, loginAuthUsuario, logOutAuth, atualizarPerfilAuth, atualizarSenhaAuth}
}
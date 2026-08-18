import { supabase } from "../services/supabase";

function traduzirErro(code: string | undefined, message: string): string {
    switch (code) {
        // login
        case 'invalid_credentials':
            return 'E-mail ou senha incorretos.'
        case 'email_not_confirmed':
            return 'Confirme seu e-mail antes de entrar.'
        case 'user_not_found':
            return 'Nenhuma conta encontrada com este e-mail.'

        // cadastro
        case 'user_already_exists':
        case 'email_exists':
            return 'Este e-mail já está cadastrado.'
        case 'weak_password':
            return 'A senha é muito fraca. Use pelo menos 6 caracteres.'

        // senha
        case 'same_password':
            return 'same_password'
        case 'password_too_short':
            return 'A senha deve ter pelo menos 6 caracteres.'

        // token / sessão
        case 'otp_expired':
        case 'token_expired':
            return 'O link expirou. Solicite um novo.'
        case 'bad_jwt':
        case 'session_not_found':
            return 'Sessão inválida. Faça login novamente.'

        // rede / servidor
        case 'over_request_rate_limit':
            return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
        case 'server_error':
            return 'Erro no servidor. Tente novamente mais tarde.'

        default:
            // fallback legível se o código não foi mapeado
            if (message.toLowerCase().includes('invalid login credentials'))
                return 'E-mail ou senha incorretos.'
            if (message.toLowerCase().includes('email already'))
                return 'Este e-mail já está cadastrado.'
            if (message.toLowerCase().includes('network'))
                return 'Erro de conexão. Verifique sua internet.'
            return 'Ocorreu um erro inesperado. Tente novamente.'
    }
}

export function useAuth() {

    const criarAuthUsuario = async (nome: string, email: string, password: string): Promise<string> => {
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { nome } }
            })
            if (error) return traduzirErro(error.code, error.message)

            await supabase.from('usuarios').insert({
                id: authData.user?.id,
                nome,
                email,
            })

            return 'sucesso'
        } catch (error) {
            return traduzirErro(undefined, `${error}`)
        }
    }

    const loginAuthUsuario = async (email: string, password: string): Promise<string> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) return traduzirErro(error.code, error.message)
            return 'sucesso'
        } catch (error) {
            return traduzirErro(undefined, `${error}`)
        }
    }

    const logOutAuth = async (): Promise<string> => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) return traduzirErro(error.code, error.message)

            const tema = localStorage.getItem('tema')
            const vlibras = localStorage.getItem('vlibras')
            localStorage.clear()
            if (tema) localStorage.setItem('tema', tema)
            if (vlibras) localStorage.setItem('vlibras', vlibras)

            window.location.href = '/'
            return 'sucesso'
        } catch (error) {
            return traduzirErro(undefined, `${error}`)
        }
    }

    const atualizarPerfilAuth = async (nome: string, email: string): Promise<string> => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return 'Usuário não encontrado. Faça login novamente.'

            const { error } = await supabase
                .from('usuarios')
                .update({ nome, email })
                .eq('id', user.id)

            if (error) return traduzirErro(error.code, error.message)
            return 'sucesso'
        } catch (error) {
            return traduzirErro(undefined, `${error}`)
        }
    }

    const atualizarSenhaAuth = async (newPassword: string): Promise<string> => {
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })
            if (error) return traduzirErro(error.code, error.message)
            return 'sucesso'
        } catch (error) {
            return traduzirErro(undefined, `${error}`)
        }
    }

    const enviarRedefinicaoSenha = async (email: string): Promise<string> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/novaSenha`,
            })
            if (error) return traduzirErro(error.code, error.message)
            return 'sucesso'
        } catch (error) {
            return traduzirErro(undefined, `${error}`)
        }
    }

    const atualizarSenhaComConfirmacao = async (email: string, senhaAtual: string, novaSenha: string): Promise<string> => {
        try {
            const {error: erroConfirmacao} = await supabase.auth.signInWithPassword({email, password: senhaAtual})
            if (erroConfirmacao) return 'Senha atual incorreta.'

            const {error: erroAtualizacao} = await supabase.auth.updateUser({password: novaSenha})
            if(erroAtualizacao) return traduzirErro(erroAtualizacao.code, erroAtualizacao.message)

            return 'sucesso'
        } catch (error) {
            return traduzirErro(undefined, `${error}`)
        }
    }

    return { criarAuthUsuario, loginAuthUsuario, logOutAuth, atualizarPerfilAuth, atualizarSenhaAuth, enviarRedefinicaoSenha, atualizarSenhaComConfirmacao }
}
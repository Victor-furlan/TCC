import estilos from './ModalMensagem.module.css'
import logoClara from "../assets/imagens/logo.svg"
import logoEscura from "../assets/imagens/logo_dark_mode.svg"
import { MdCheck, MdInfo, MdErrorOutline } from 'react-icons/md'
import { useContext } from 'react'
import { TemaContexto } from '../contexts/TemaContexto'

type TipoModal = 'sucesso' | 'info' | 'erro'

interface ModalMensagemProps {
    exibir: boolean
    titulo: string
    texto: string
    tipo?: TipoModal
    ocultar: () => void
}

const iconesPorTipo: Record<TipoModal, { icone: React.ReactNode, classe: string }> = {
    sucesso: { icone: <MdCheck size={26} />, classe: estilos.iconeStatusSucesso },
    info: { icone: <MdInfo size={26} />, classe: estilos.iconeStatusInfo },
    erro: { icone: <MdErrorOutline size={26} />, classe: estilos.iconeStatusErro },
}

export function ModalMensagem({exibir, ocultar, titulo, texto, tipo = 'sucesso'}: ModalMensagemProps) {

    const { tema } = useContext(TemaContexto)

    if (exibir) {

        const { icone, classe } = iconesPorTipo[tipo]

        return(
            <div className={estilos.conteiner}>

                <div className={estilos.conteinerMensagem}>

                    <img src={tema === 'escuro' ? logoEscura : logoClara} className={estilos.logo} />

                    <div className={`${estilos.iconeStatus} ${classe}`}>
                        {icone}
                    </div>

                    <p className={estilos.titulo}>{titulo}</p>

                    <p className={estilos.mensagem}>{texto}</p>
                    
                    <button 
                        className={estilos.botao}
                        onClick={ocultar}
                    >Fechar</button>

                </div>

            </div>
        )    
    }
    return null
}
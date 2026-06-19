import estilos from './ModalMensagem.module.css'
import logo from "../assets/imagens/logo.png";

interface ModalMensagemProps {
    exibir: boolean
    titulo: string
    texto: string
    ocultar: () => void
}

export function ModalMensagem({exibir, ocultar, titulo, texto}: ModalMensagemProps) {
    if (exibir) {
        return(
            <div className={estilos.conteiner}>

                <div className={estilos.conteinerMensagem}>

                    <img src={logo} className={estilos.logo} />

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
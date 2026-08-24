import { useContext, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { PastasContexto } from '../../contexts/PastasContexto'
import styles from './ModalCriarPasta.module.css'

interface ModalCriarPastaProps {
    onFechar: () => void
}

export function ModalCriarPasta({ onFechar }: ModalCriarPastaProps) {

    const { adicionarPasta } = useContext(PastasContexto)
    const [nome, setNome] = useState('')
    const [carregando, setCarregando] = useState(false)

    const handleCriar = async () => {
        if (!nome.trim()) return
        setCarregando(true)
        await adicionarPasta(nome.trim())
        setCarregando(false)
        onFechar()
    }

    return (
        <div className={styles.overlay} onClick={onFechar}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.cabecalho}>
                    <p className={styles.titulo}>Nova Pasta</p>
                    <button className={styles.botaoFechar} onClick={onFechar}>
                        <MdClose size={20} />
                    </button>
                </div>

                <input
                    className={styles.input}
                    placeholder='Nome da pasta...'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
                    autoFocus
                />

                <div className={styles.botoes}>
                    <button className={styles.botaoCancelar} onClick={onFechar}>
                        Cancelar
                    </button>
                    <button
                        className={styles.botaoCriar}
                        onClick={handleCriar}
                        disabled={!nome.trim() || carregando}
                    >
                        {carregando ? 'Criando...' : 'Criar'}
                    </button>
                </div>

            </div>
        </div>
    )
}
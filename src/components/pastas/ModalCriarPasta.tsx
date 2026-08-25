import { useContext, useState } from 'react'
import { MdClose, MdFolder } from 'react-icons/md'
import { PastasContexto } from '../../contexts/PastasContexto'
import { TemaContexto } from '../../contexts/TemaContexto'
import logoClara from '../../assets/imagens/logo.svg'
import logoEscura from '../../assets/imagens/logo_dark_mode.svg'
import styles from './ModalCriarPasta.module.css'

const coresPasta = [
    { label: 'Entretenimento', valor: 'var(--categoria-entretenimento)' },
    { label: 'Software',       valor: 'var(--categoria-software)' },
    { label: 'Compras',        valor: 'var(--categoria-compras)' },
    { label: 'Utilidades',     valor: 'var(--categoria-utilidades)' },
    { label: 'Alimentação',    valor: 'var(--categoria-alimentacao)' },
    { label: 'Saúde',          valor: 'var(--categoria-saude)' },
    { label: 'Educação',       valor: 'var(--categoria-educacao)' },
]

interface ModalCriarPastaProps {
    onFechar: () => void
}

export function ModalCriarPasta({ onFechar }: ModalCriarPastaProps) {

    const { adicionarPasta } = useContext(PastasContexto)
    const { tema } = useContext(TemaContexto)
    const [nome, setNome] = useState('')
    const [corSelecionada, setCorSelecionada] = useState(coresPasta[0].valor)
    const [carregando, setCarregando] = useState(false)

    const handleCriar = async () => {
        if (!nome.trim()) return
        setCarregando(true)
        await adicionarPasta(nome.trim(), corSelecionada)
        setCarregando(false)
        onFechar()
    }

    return (
        <div className={styles.overlay} onClick={onFechar}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <img
                    src={tema === 'escuro' ? logoEscura : logoClara}
                    className={styles.logo}
                />

                <button className={styles.botaoFechar} onClick={onFechar}>
                    <MdClose size={20} />
                </button>

                <div className={styles.iconePreview} style={{ color: corSelecionada }}>
                    <MdFolder size={32} />
                </div>

                <p className={styles.titulo}>Nova Pasta</p>
                <p className={styles.subtitulo}>Organize suas assinaturas em pastas</p>

                <input
                    className={styles.input}
                    placeholder='Nome da pasta...'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
                    autoFocus
                />

                <div className={styles.seletorCor}>
                    {coresPasta.map((cor) => (
                        <button
                            key={cor.valor}
                            className={`${styles.botaoCor} ${corSelecionada === cor.valor ? styles.botaoCorAtivo : ''}`}
                            style={{ backgroundColor: cor.valor }}
                            onClick={() => setCorSelecionada(cor.valor)}
                            title={cor.label}
                        />
                    ))}
                </div>

                <button
                    className={styles.botaoCriar}
                    onClick={handleCriar}
                    disabled={!nome.trim() || carregando}
                >
                    {carregando ? 'Criando...' : 'Criar Pasta'}
                </button>

            </div>
        </div>
    )
}
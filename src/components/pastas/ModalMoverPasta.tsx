import { useContext } from 'react'
import { MdClose, MdFolder, MdAdd } from 'react-icons/md'
import { PastasContexto } from '../../contexts/PastasContexto'
import styles from './ModalMoverPasta.module.css'

interface ModalMoverPastaProps {
    idsSelecionados: string[]
    onFechar: () => void
    onMover: (pastaId: string | null) => void
    onAbrirCriarPasta: () => void
}

export function ModalMoverPasta({ idsSelecionados, onFechar, onMover, onAbrirCriarPasta }: ModalMoverPastaProps) {

    const { pastas } = useContext(PastasContexto)

    return (
        <div className={styles.overlay} onClick={onFechar}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.cabecalho}>
                    <p className={styles.titulo}>Mover para pasta</p>
                    <button className={styles.botaoFechar} onClick={onFechar}>
                        <MdClose size={20} />
                    </button>
                </div>

                <p className={styles.subtitulo}>
                    {idsSelecionados.length} {idsSelecionados.length === 1 ? 'assinatura selecionada' : 'assinaturas selecionadas'}
                </p>

                <div className={styles.listaPastas}>
                    {pastas.length === 0 ? (
                        <p className={styles.textoVazio}>Nenhuma pasta criada ainda.</p>
                    ) : (
                        <>
                            {pastas.map((pasta) => (
                                <button
                                    key={pasta.id}
                                    className={styles.itemPasta}
                                    onClick={() => onMover(pasta.id)}
                                >
                                    <MdFolder size={20} className={styles.icone} />
                                    {pasta.nome}
                                </button>
                            ))}
                            <button
                                className={`${styles.itemPasta} ${styles.itemRemover}`}
                                onClick={() => onMover(null)}
                            >
                                Remover da pasta
                            </button>
                        </>
                    )}
                </div>

                <button className={styles.botaoNovaPasta} onClick={onAbrirCriarPasta}>
                    <MdAdd size={18} />
                    Nova pasta
                </button>

            </div>
        </div>
    )
}
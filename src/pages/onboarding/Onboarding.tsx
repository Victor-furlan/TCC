import styles from './Onboarding.module.css'
import logoClara from '../../assets/imagens/logo_completa_mindcash.svg'
import logoEscura from '../../assets/imagens/logo_completa_dark_mode.svg'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useContext } from 'react'
import { MdAttachMoney, MdAccessTime } from 'react-icons/md'
import { ModalMensagem } from '../../components/ModalMensagem'
import { BaseFinanceiraContexto } from '../../contexts/BaseFinanceiraContexto'
import { TemaContexto } from '../../contexts/TemaContexto'

type FormValues = {
    rendaMensal: string
    horasTrabalhadas: string
}

const onboardingSchema = z.object({
    rendaMensal: z.string().min(1, { message: 'Informe sua renda mensal.' }),
    horasTrabalhadas: z.string().min(1, { message: 'Informe sua carga horária mensal.' }),
})

export function Onboarding() {

    const { setRendaMensalContexto, setCargaHorariaContexto } = useContext(BaseFinanceiraContexto)
    const { tema } = useContext(TemaContexto)

    const [modalVisivel, setModalVisivel] = useState(false)
    const [modalTitulo, setModalTitulo] = useState('')
    const [modalTexto, setModalTexto] = useState('')
    const [modalTipo, setModalTipo] = useState<'sucesso' | 'erro'>('erro')

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(onboardingSchema),
    })

    const salvar = async (data: FormValues) => {
        try {
            await setRendaMensalContexto(Number(data.rendaMensal))
            await setCargaHorariaContexto(Number(data.horasTrabalhadas))
            setModalTipo('sucesso')
            setModalTitulo('Tudo pronto!')
            setModalTexto('Sua base financeira foi configurada.')
            setModalVisivel(true)
        } catch {
            setModalTipo('erro')
            setModalTitulo('Erro')
            setModalTexto('Não foi possível salvar. Tente novamente.')
            setModalVisivel(true)
        }
    }

    const fecharModal = () => {
        setModalVisivel(false)
        if (modalTipo === 'sucesso') {
            window.location.href = '/dashboard'
        }
    }

    return (
        <div className={styles.container}>

            <div className={styles.painelMarca}>
                <svg className={styles.marcadores} viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="210" cy="210" r="180" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                    <circle cx="210" cy="210" r="140" stroke="white" strokeOpacity="0.12" strokeWidth="1.5" />
                    <circle cx="210" cy="210" r="100" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
                    <line x1="210" y1="30" x2="210" y2="55" stroke="white" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
                    <line x1="210" y1="30" x2="210" y2="120" stroke="white" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" transform="rotate(60 210 210)" />
                    <line x1="210" y1="30" x2="210" y2="90" stroke="white" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" transform="rotate(150 210 210)" />
                </svg>

                <p className={styles.fraseDestaque}>
                    Antes de começar, precisamos conhecer sua <span className={styles.fraseDestaqueAccent}>base financeira.</span>
                </p>
                <p className={styles.legendaMarca}>
                    Com sua renda e carga horária, o MindCash transforma cada gasto em horas reais da sua vida.
                </p>
            </div>

            <div className={styles.painelFormulario}>
                <div className={styles.formConteiner}>
                    <img src={tema === 'escuro' ? logoEscura : logoClara} className={styles.logo} alt="MindCash" />

                    <h1 className={styles.titulo}>Quase lá</h1>
                    <p className={styles.subtitulo}>Configure sua base financeira para começar</p>

                    <form className={styles.formulario} onSubmit={handleSubmit(salvar)}>

                        <div className={styles.conteinerCampo}>
                            <p className={styles.tituloCampo}>Renda Mensal (R$)</p>
                            <div className={styles.campoComIcone}>
                                <MdAttachMoney size={17} className={styles.iconeCampo} />
                                <input
                                    {...register('rendaMensal')}
                                    className={styles.campo}
                                    placeholder='ex. 4200'
                                    type='number'
                                />
                            </div>
                            {errors.rendaMensal && <p className={styles.erro}>{errors.rendaMensal.message}</p>}
                        </div>

                        <div className={styles.conteinerCampo}>
                            <p className={styles.tituloCampo}>Horas Trabalhadas por Mês</p>
                            <div className={styles.campoComIcone}>
                                <MdAccessTime size={17} className={styles.iconeCampo} />
                                <input
                                    {...register('horasTrabalhadas')}
                                    className={styles.campo}
                                    placeholder='ex. 160'
                                    type='number'
                                />
                            </div>
                            {errors.horasTrabalhadas && <p className={styles.erro}>{errors.horasTrabalhadas.message}</p>}
                        </div>

                        <button className={styles.botao} type='submit'>
                            Começar
                        </button>

                    </form>
                </div>
            </div>

            <ModalMensagem
                exibir={modalVisivel}
                ocultar={fecharModal}
                titulo={modalTitulo}
                texto={modalTexto}
                tipo={modalTipo}
            />

        </div>
    )
}
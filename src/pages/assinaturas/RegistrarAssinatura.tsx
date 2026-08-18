import styles from './RegistrarAssinatura.module.css'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdStar, MdStarBorder, MdLightbulb, MdExpandMore, MdCheck, MdCalendarMonth } from 'react-icons/md'
import { ModalMensagem } from '../../components/ModalMensagem'
import { AssinaturasContexto } from '../../contexts/AssinaturasContexto'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type Humor = 'feliz' | 'ansioso' | 'estressado' | 'cansado' | 'neutro'

type FormValues = {
    nomeAssinatura: string
    valor: number
    periodicidade: string
    categoria: string
    proximaCobranca: string
    motivo?: string
}

const registrarAssinaturaSchema = z.object({
    nomeAssinatura: z.string().min(1, { message: 'Informe o nome da assinatura.' }),
    valor: z.number({ message: 'Informe um valor válido.' }).min(0.01, { message: 'O valor deve ser maior que zero.' }),
    periodicidade: z.string().min(1, { message: 'Selecione a periodicidade.' }),
    categoria: z.string().min(1, { message: 'Selecione uma categoria.' }),
    proximaCobranca: z.string().min(1, { message: 'Informe a data da próxima cobrança.' }),
    motivo: z.string().optional(),
})

const opcoesPeriodicidade = [
    { valor: 'mensal', rotulo: 'Mensal' },
    { valor: 'anual', rotulo: 'Anual' },
    { valor: 'semanal', rotulo: 'Semanal' },
]

const opcoesCategoria = ['Entretenimento', 'Software', 'Compras', 'Utilidades', 'Alimentação', 'Saúde', 'Educação']

const opcoesHumor: { valor: Humor, rotulo: string, emoji: string }[] = [
    { valor: 'feliz', rotulo: 'Feliz', emoji: '😊' },
    { valor: 'ansioso', rotulo: 'Ansioso', emoji: '😰' },
    { valor: 'estressado', rotulo: 'Estressado', emoji: '😡' },
    { valor: 'cansado', rotulo: 'Cansado', emoji: '😴' },
    { valor: 'neutro', rotulo: 'Neutro', emoji: '😐' },
]

const dataParaString = (data: Date) => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

const formatarDataExibicao = (dataStr: string) => {
    if (!dataStr) return 'Selecione uma data'
    const [ano, mes, dia] = dataStr.split('-')
    return `${dia}/${mes}/${ano}`
}

export function RegistrarAssinatura() {

    const { adicionarAssinatura } = useContext(AssinaturasContexto)
    const navegacao = useNavigate()

    const hoje = new Date()

    const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null)
    const [calendarioAberto, setCalendarioAberto] = useState(false)

    const [humorSelecionado, setHumorSelecionado] = useState<Humor | null>(null)
    const [nivelArrependimento, setNivelArrependimento] = useState(0)

    const [periodicidadeSelecionada, setPeriodicidadeSelecionada] = useState('')
    const [dropdownPeriodicidadeAberto, setDropdownPeriodicidadeAberto] = useState(false)

    const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
    const [dropdownCategoriaAberto, setDropdownCategoriaAberto] = useState(false)

    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(registrarAssinaturaSchema),
    })

    const aoSelecionarData = (data: Date) => {
        setDataSelecionada(data)
        setValue('proximaCobranca', dataParaString(data), { shouldValidate: true })
        setCalendarioAberto(false)
    }

    const escolherPeriodicidade = (periodicidade: string) => {
        setPeriodicidadeSelecionada(periodicidade)
        setValue('periodicidade', periodicidade, { shouldValidate: true })
        setDropdownPeriodicidadeAberto(false)
    }

    const escolherCategoria = (categoria: string) => {
        setCategoriaSelecionada(categoria)
        setValue('categoria', categoria, { shouldValidate: true })
        setDropdownCategoriaAberto(false)
    }

    const registrarAssinatura = async (data: FormValues) => {
        await adicionarAssinatura({
            nome: data.nomeAssinatura,
            valor: data.valor,
            periodicidade: data.periodicidade,
            categoria: data.categoria,
            proximaCobranca: data.proximaCobranca,
            ativa: true,
            motivo: data.motivo,
            humor: humorSelecionado || undefined,
            nivelArrependimento: nivelArrependimento || undefined,
        })

        setModalMensagemTexto(`Assinatura "${data.nomeAssinatura}" adicionada com sucesso!`)
        exibirModal()
    }

    const exibirModal = () => {
        setModalMensagemTitulo('Nova Assinatura')
        setModalMensagemVisivel(true)
    }

    const ocultarModal = () => {
        setModalMensagemVisivel(false)
        navegacao('/assinaturas')
    }

    return(
        <div className={styles.conteiner}>
            <div className={styles.areaConteudo}>

                <Link className={styles.botaoVoltar} to='/assinaturas'>
                    <MdArrowBack size={18} />
                    Voltar para Assinaturas
                </Link>

                <form className={styles.cardFormulario} onSubmit={handleSubmit(registrarAssinatura)}>

                    <p className={styles.tituloSecao}>Adicionar Nova Assinatura</p>

                    <div className={styles.campo}>
                        <p className={styles.rotuloCampo}>Nome da Assinatura:</p>
                        <input
                            {...register('nomeAssinatura')}
                            className={styles.input}
                            placeholder='ex. Netflix, Spotify, Adobe...'
                        />
                        {errors.nomeAssinatura && <p className={styles.erro}>{errors.nomeAssinatura.message}</p>}
                    </div>

                    <div className={styles.linhaDupla}>
                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Valor:</p>
                            <input
                                {...register('valor', { valueAsNumber: true })}
                                className={styles.input}
                                type='number'
                                step='0.01'
                                placeholder='0'
                            />
                            {errors.valor && <p className={styles.erro}>{errors.valor.message}</p>}
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Periodicidade:</p>
                            <div className={styles.dropdownConteiner}>
                                <button
                                    type='button'
                                    className={styles.selectFalso}
                                    onClick={() => setDropdownPeriodicidadeAberto(!dropdownPeriodicidadeAberto)}
                                >
                                    {opcoesPeriodicidade.find(o => o.valor === periodicidadeSelecionada)?.rotulo || 'Selecione'}
                                    <MdExpandMore size={18} className={styles.iconeExpandir} />
                                </button>
                                {dropdownPeriodicidadeAberto && (
                                    <div className={styles.listaDropdown}>
                                        <p className={styles.tituloDropdownCategoria}>Periodicidade</p>
                                        {opcoesPeriodicidade.map((opcao) => (
                                            <button
                                                key={opcao.valor}
                                                type='button'
                                                className={styles.itemDropdown}
                                                onClick={() => escolherPeriodicidade(opcao.valor)}
                                            >
                                                {opcao.rotulo}
                                                {periodicidadeSelecionada === opcao.valor && <MdCheck size={16} className={styles.iconeCheck} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.periodicidade && <p className={styles.erro}>{errors.periodicidade.message}</p>}
                        </div>
                    </div>

                    <div className={styles.linhaDupla}>
                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Categoria:</p>
                            <div className={styles.dropdownConteiner}>
                                <button
                                    type='button'
                                    className={styles.selectFalso}
                                    onClick={() => setDropdownCategoriaAberto(!dropdownCategoriaAberto)}
                                >
                                    {categoriaSelecionada || 'Selecione a Categoria'}
                                    <MdExpandMore size={18} className={styles.iconeExpandir} />
                                </button>
                                {dropdownCategoriaAberto && (
                                    <div className={styles.listaDropdown}>
                                        <p className={styles.tituloDropdownCategoria}>Categorias</p>
                                        {opcoesCategoria.map((opcao) => (
                                            <button
                                                key={opcao}
                                                type='button'
                                                className={styles.itemDropdown}
                                                onClick={() => escolherCategoria(opcao)}
                                            >
                                                {opcao}
                                                {categoriaSelecionada === opcao && <MdCheck size={16} className={styles.iconeCheck} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {errors.categoria && <p className={styles.erro}>{errors.categoria.message}</p>}
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Próxima Cobrança:</p>
                            <div className={styles.dropdownConteiner}>
                                <input type='hidden' {...register('proximaCobranca')} />
                                <button
                                    type='button'
                                    className={styles.selectFalso}
                                    onClick={() => setCalendarioAberto(!calendarioAberto)}
                                >
                                    <MdCalendarMonth size={16} />
                                    {dataSelecionada ? formatarDataExibicao(dataParaString(dataSelecionada)) : 'Selecione uma data'}
                                    <MdExpandMore size={18} className={styles.iconeExpandir} />
                                </button>
                                {calendarioAberto && (
                                    <div className={styles.dropdownCalendario}>
                                        <Calendar
                                            onChange={(value) => aoSelecionarData(value as Date)}
                                            value={dataSelecionada || hoje}
                                            locale='pt-BR'
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.proximaCobranca && <p className={styles.erro}>{errors.proximaCobranca.message}</p>}
                        </div>
                    </div>

                    <div className={styles.cardEmocional}>
                        <p className={styles.tituloSecao}>Campos Emocionais (Opcional)</p>
                        <p className={styles.perguntaHumor}>Como você estava se sentindo ao assinar?</p>

                        <div className={styles.listaHumor}>
                            {opcoesHumor.map((opcao) => (
                                <button
                                    key={opcao.valor}
                                    type='button'
                                    className={humorSelecionado === opcao.valor ? `${styles.itemHumor} ${styles.itemHumorAtivo}` : styles.itemHumor}
                                    onClick={() => setHumorSelecionado(opcao.valor)}
                                >
                                    <span className={styles.emojiHumor}>{opcao.emoji}</span>
                                    {opcao.rotulo}
                                </button>
                            ))}
                        </div>

                        <p className={styles.rotuloCampo}>Motivo da assinatura</p>
                        <textarea
                            {...register('motivo')}
                            className={styles.textarea}
                            placeholder='Ex: Preciso para trabalho, recomendação de amigo, promoção...'
                        />

                        <div className={styles.linhaArrependimento}>
                            <p className={styles.rotuloCampo}>Nível de arrependimento</p>
                            <div className={styles.estrelas}>
                                {[1, 2, 3, 4, 5].map((numero) => (
                                    <button
                                        key={numero}
                                        type='button'
                                        className={numero <= nivelArrependimento ? `${styles.botaoEstrela} ${styles.estrelaPreenchida}` : styles.botaoEstrela}
                                        onClick={() => setNivelArrependimento(numero)}
                                    >
                                        {numero <= nivelArrependimento ? <MdStar size={26} /> : <MdStarBorder size={26} />}
                                    </button>
                                ))}
                            </div>
                            <button
                                type='button'
                                className={styles.botaoLimpar}
                                onClick={() => setNivelArrependimento(0)}
                            >
                                Limpar
                            </button>
                        </div>
                    </div>

                    <div className={styles.linhaBotoes}>
                        <button type='submit' className={styles.botaoSalvar}>
                            Adicionar Assinatura
                        </button>
                        <Link className={styles.botaoCancelar} to='/assinaturas'>
                            Cancelar
                        </Link>
                    </div>

                </form>

                <div className={styles.cardDica}>
                    <p className={styles.tituloDica}>
                        <MdLightbulb size={18} className={styles.iconeDica} />
                        Dica
                    </p>
                    <p className={styles.textoDica}>
                        Registre a data de cobrança corretamente para receber alertas antes da renovação.
                        Preencher os campos emocionais ajuda o MindCash a identificar padrões de consumo
                        e calcular quanto tempo da sua vida essa assinatura representa.
                    </p>
                </div>

            </div>

            <ModalMensagem
                exibir={modalMensagemVisivel}
                ocultar={() => ocultarModal()}
                titulo={modalMensagemTitulo}
                texto={modalMensagemTexto}
            />

        </div>
    )
}
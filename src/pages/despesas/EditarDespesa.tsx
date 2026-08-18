import styles from './EditarDespesa.module.css'
import { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MdArrowBack, MdStar, MdStarBorder, MdLightbulb, MdExpandMore, MdCheck, MdCalendarMonth } from 'react-icons/md'
import { ModalMensagem } from '../../components/ModalMensagem'
import { DespesasContexto } from '../../contexts/DespesasContexto'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type Humor = 'feliz' | 'ansioso' | 'estressado' | 'cansado' | 'neutro'

type FormValues = {
    nome: string
    data: string
    valor: number
    categoria: string
    motivo?: string
}

const editarDespesaSchema = z.object({
    nome: z.string().min(1, { message: 'Informe o nome da despesa.' }),
    data: z.string().min(1, { message: 'Informe a data da despesa.' }),
    valor: z.number({ message: 'Informe um valor válido.' }).min(0.01, { message: 'O valor deve ser maior que zero.' }),
    categoria: z.string().min(1, { message: 'Selecione uma categoria.' }),
    motivo: z.string().optional(),
})

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

const stringParaData = (dataStr: string) => {
    const [ano, mes, dia] = dataStr.split('-').map(Number)
    return new Date(ano, mes - 1, dia)
}

const formatarDataExibicao = (dataStr: string) => {
    if (!dataStr) return ''
    const [ano, mes, dia] = dataStr.split('-')
    return `${dia}/${mes}/${ano}`
}

export function EditarDespesa() {

    const { id } = useParams<{ id: string }>()
    const navegacao = useNavigate()

    const { despesas, editarDespesa } = useContext(DespesasContexto)
    const despesaAtual = despesas.find((despesa) => despesa.id === id)

    const hoje = new Date()

    const [dataSelecionada, setDataSelecionada] = useState<Date>(
        despesaAtual?.data ? stringParaData(despesaAtual.data) : hoje
    )
    const [calendarioAberto, setCalendarioAberto] = useState(false)

    const [humorSelecionado, setHumorSelecionado] = useState<Humor | null>((despesaAtual?.humor as Humor) || null)
    const [nivelArrependimento, setNivelArrependimento] = useState(despesaAtual?.nivelArrependimento || 0)

    const [categoriaSelecionada, setCategoriaSelecionada] = useState(despesaAtual?.categoria || '')
    const [dropdownCategoriaAberto, setDropdownCategoriaAberto] = useState(false)

    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(editarDespesaSchema),
        defaultValues: {
            nome: despesaAtual?.nome || '',
            data: despesaAtual?.data || '',
            valor: despesaAtual?.valor || 0,
            categoria: despesaAtual?.categoria || '',
            motivo: despesaAtual?.motivo || '',
        },
    })

    const aoSelecionarData = (data: Date) => {
        setDataSelecionada(data)
        setValue('data', dataParaString(data), { shouldValidate: true })
        setCalendarioAberto(false)
    }

    const escolherCategoria = (categoria: string) => {
        setCategoriaSelecionada(categoria)
        setValue('categoria', categoria, { shouldValidate: true })
        setDropdownCategoriaAberto(false)
    }

    const salvarEdicaoDespesa = (data: FormValues) => {
        if (!id) return

        editarDespesa(id, {
            nome: data.nome,
            data: data.data,
            valor: data.valor,
            categoria: data.categoria,
            motivo: data.motivo,
            humor: humorSelecionado || undefined,
            nivelArrependimento: nivelArrependimento || undefined,
        })

        setModalMensagemTexto(`Despesa "${data.nome}" atualizada com sucesso!`)
        exibirModal()
    }

    const exibirModal = () => {
        setModalMensagemTitulo('Editar Despesa')
        setModalMensagemVisivel(true)
    }

    const ocultarModal = () => {
        setModalMensagemVisivel(false)
        navegacao('/despesas')
    }

    if (!despesaAtual) {
        return (
            <div className={styles.conteiner}>
                <div className={styles.areaConteudo}>
                    <Link className={styles.botaoVoltar} to='/despesas'>
                        <MdArrowBack size={18} />
                        Voltar para Gastos Variáveis
                    </Link>
                    <div className={styles.cardFormulario}>
                        <p className={styles.tituloSecao}>Despesa não encontrada</p>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className={styles.conteiner}>
            <div className={styles.areaConteudo}>

                <Link className={styles.botaoVoltar} to='/despesas'>
                    <MdArrowBack size={18} />
                    Voltar para Gastos Variáveis
                </Link>

                <form className={styles.cardFormulario} onSubmit={handleSubmit(salvarEdicaoDespesa)}>

                    <p className={styles.tituloSecao}>Editar Despesa</p>

                    <div className={styles.linhaTripla}>
                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Nome:</p>
                            <input
                                {...register('nome')}
                                className={styles.input}
                                placeholder='ex. Delivery, Uber...'
                            />
                            {errors.nome && <p className={styles.erro}>{errors.nome.message}</p>}
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Data:</p>
                            <div className={styles.dropdownConteiner}>
                                <input type='hidden' {...register('data')} />
                                <button
                                    type='button'
                                    className={styles.selectFalso}
                                    onClick={() => setCalendarioAberto(!calendarioAberto)}
                                >
                                    <MdCalendarMonth size={16} />
                                    {formatarDataExibicao(dataParaString(dataSelecionada))}
                                    <MdExpandMore size={18} className={styles.iconeExpandir} />
                                </button>
                                {calendarioAberto && (
                                    <div className={styles.dropdownCalendario}>
                                        <Calendar
                                            onChange={(value) => aoSelecionarData(value as Date)}
                                            value={dataSelecionada}
                                            maxDate={hoje}
                                            locale='pt-BR'
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.data && <p className={styles.erro}>{errors.data.message}</p>}
                        </div>

                        <div className={styles.campo}>
                            <p className={styles.rotuloCampo}>Valor:</p>
                            <input
                                {...register('valor', { valueAsNumber: true })}
                                className={styles.input}
                                type='number'
                                step='0.01'
                                placeholder='R$ 0,00'
                            />
                            {errors.valor && <p className={styles.erro}>{errors.valor.message}</p>}
                        </div>
                    </div>

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

                    <div className={styles.cardEmocional}>
                        <p className={styles.tituloSecao}>Campos Emocionais (Opcional)</p>
                        <p className={styles.perguntaHumor}>Como você estava se sentindo ao fazer essa despesa?</p>

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

                        <p className={styles.rotuloCampo}>Motivo da despesa</p>
                        <textarea
                            {...register('motivo')}
                            className={styles.textarea}
                            placeholder='ex. Estava com fome, vi uma promoção...'
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
                            Salvar Alterações
                        </button>
                        <Link className={styles.botaoCancelar} to='/despesas'>
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
                        Revise os campos emocionais se sua percepção sobre essa despesa mudou —
                        isso mantém os insights de comportamento do MindCash sempre precisos.
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
import styles from './RegistrarDespesa.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdStar, MdStarBorder, MdLightbulb, MdExpandMore, MdCheck } from 'react-icons/md'
import { ModalMensagem } from '../../components/ModalMensagem'

type Humor = 'feliz' | 'ansioso' | 'estressado' | 'cansado' | 'neutro'

type FormValues = {
    nome: string
    data: string
    valor: number
    categoria: string
    motivo?: string
}

const registrarDespesaSchema = z.object({
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

const obterDataAtual = () => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

export function RegistrarDespesa() {

    const navegacao = useNavigate()

    const [humorSelecionado, setHumorSelecionado] = useState<Humor | null>(null)
    const [nivelArrependimento, setNivelArrependimento] = useState(0)

    const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
    const [dropdownCategoriaAberto, setDropdownCategoriaAberto] = useState(false)

    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(registrarDespesaSchema),
        defaultValues: {
            data: obterDataAtual(),
        },
    })

    const escolherCategoria = (categoria: string) => {
        setCategoriaSelecionada(categoria)
        setValue('categoria', categoria, { shouldValidate: true })
        setDropdownCategoriaAberto(false)
    }

    const registrarDespesa = (data: FormValues) => {
        setModalMensagemTexto(`Despesa "${data.nome}" registrada com sucesso!`)
        exibirModal()
    }

    const exibirModal = () => {
        setModalMensagemTitulo('Nova Despesa')
        setModalMensagemVisivel(true)
    }

    const ocultarModal = () => {
        setModalMensagemVisivel(false)
        navegacao('/despesas')
    }

    return(
        <div className={styles.conteiner}>
            <div className={styles.areaConteudo}>

                <Link className={styles.botaoVoltar} to='/despesas'>
                    <MdArrowBack size={18} />
                    Voltar para Gastos Variáveis
                </Link>

                <form className={styles.cardFormulario} onSubmit={handleSubmit(registrarDespesa)}>

                    <p className={styles.tituloSecao}>Registrar Nova Despesa</p>

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
                            <input
                                {...register('data')}
                                className={styles.input}
                                type='date'
                            />
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
                            Adicionar Despesa
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
                        Registrar gastos variáveis logo após cada compra ajuda a manter o histórico mais preciso.
                        Preencher os campos emocionais é o que torna o MindCash capaz de identificar padrões de
                        consumo ligados ao seu humor e gerar insights sobre seus hábitos financeiros.
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
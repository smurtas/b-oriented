import { useEffect, useState } from 'react'
import './App.css'


// ======================================================
// NOMI DEGLI INDIRIZZI
// ======================================================

const trackNames = {
  informatica: 'Informatica e Telecomunicazioni',
  elettronica: 'Elettronica e Automazione',
  meccanica: 'Meccanica, Meccatronica ed Energia',
  chimica: 'Chimica, Materiali e Biotecnologie',
  cat: 'Costruzioni, Ambiente e Territorio'
}


// ======================================================
// INFORMAZIONI SEZIONI
// ======================================================

const sectionInfo = {

  areas: {
    step: 'PASSO 1 DI 4',
    section: 'SEZIONE 1A',
    title: 'Aree professionali',
    description:
      'Ordina le aree professionali in base a quanto ti interessano.'
  },

  interests: {
    step: 'PASSO 1 DI 4',
    section: 'SEZIONE 1B',
    title: 'Attività e interessi',
    description:
      'Indica quanto ti interessano le attività proposte.'
  },

  reflection: {
    step: 'PASSO 1 DI 4',
    section: 'SEZIONE 1C',
    title: 'Riflessione',
    description:
      'Rifletti sulle preferenze che hai espresso.'
  },
  work: {
    step: 'PASSO 2 DI 4',
    section: 'SEZIONE 2A',
    title: 'Nel lavoro vorrei trovare...',
    description:
      'Ordina le caratteristiche del lavoro in base a quanto sono importanti per te.'
  },

  competences: {
    step: 'PASSO 2 DI 4',
    section: 'SEZIONE 2B',
    title: 'Competenze per il lavoro',
    description:
      'Valuta quanto pensi di possedere ciascuna delle competenze proposte.'
  },

  workReflection: {
    step: 'PASSO 2 DI 4',
    section: 'SEZIONE 2C',
    title: 'Riflessione',
    description:
      'Collega ciò che cerchi nel lavoro alle competenze che ritieni di possedere.'
  }

}


// ======================================================
// COMPONENTE PRINCIPALE
// ======================================================

function App() {

  // ==================================================
  // STATO PRINCIPALE
  // ==================================================

  const [page, setPage] = useState('home')

  const [questions, setQuestions] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)


  // ==================================================
  // SEZIONE CORRENTE
  // ==================================================

  const [currentSection, setCurrentSection] = useState('intro-areas')


  // ==================================================
  // DOMANDE LIKERT
  // ==================================================

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [answers, setAnswers] = useState({})


  // ==================================================
  // RANKING AREE PROFESSIONALI
  // ==================================================

  const [ranking, setRanking] = useState([])

  const [highlightedRankingId, setHighlightedRankingId] = useState(null)


  // ==================================================
  // RIFLESSIONI
  // ==================================================

  const [reflectionAnswers, setReflectionAnswers] = useState({})

  const [currentReflection, setCurrentReflection] = useState(0)


  // ==================================================
  // RISULTATO
  // ==================================================

  const [result, setResult] = useState(null)

  // ==================================================
  // PASSO 2 - LAVORO
  // ==================================================

  const [workRanking, setWorkRanking] = useState([])

  const [currentWorkCompetence, setCurrentWorkCompetence] = useState(0)

  const [workAnswers, setWorkAnswers] = useState({})

  const [workReflectionAnswers, setWorkReflectionAnswers] = useState({})

  const [currentWorkReflection, setCurrentWorkReflection] = useState(0)

  const [highlightedWorkRankingId, setHighlightedWorkRankingId] = useState(null)

  // ==================================================
  // PASSO 3 - METODO DI STUDIO
  // ==================================================

  const [studyAnswers, setStudyAnswers] = useState({})

  const [currentStudyQuestion, setCurrentStudyQuestion] = useState(0)
  // ==================================================
  // PASSO 4 - LA SCELTA
  // ==================================================

  const [selectedTrack, setSelectedTrack] = useState('')

  const [choiceAnswers, setChoiceAnswers] = useState({})

  const [currentChoiceQuestion, setCurrentChoiceQuestion] = useState(0)

  // ==================================================
  // PROGRESS BAR GENERICA 
  // ==================================================

  const [areasRankingCompleted, setAreasRankingCompleted] = useState(false)

  const [workRankingCompleted, setWorkRankingCompleted] = useState(false)

  // ==================================================
  // DRAG AND DROP 
  // ==================================================
  const [draggedRankingIndex, setDraggedRankingIndex] = useState(null)

  const [draggedWorkRankingIndex, setDraggedWorkRankingIndex] = useState(null)

  // ==================================================
  // CARICAMENTO DOMANDE
  // ==================================================

  useEffect(() => {

    async function loadQuestions() {

      try {

        setLoading(true)

        const response =
          await fetch('/api/questions')


        if (!response.ok) {
          throw new Error(
            'Errore nel caricamento delle domande'
          )
        }


        const data =
          await response.json()


        setQuestions(data)
        setError(null)

      }

      catch (err) {

        console.error(err)

        setError(
          'Non è stato possibile caricare il questionario.'
        )

      }

      finally {

        setLoading(false)

      }

    }


    loadQuestions()

  }, [])


  // ==================================================
  // FILTRIAMO LE DOMANDE
  // ==================================================

  const rankingQuestions =
    questions

      .filter(
        question =>
          question.step === 1 &&
          question.section ===
          'aree_professionali' &&
          question.type ===
          'ranking'
      )

      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const interestQuestions =
    questions

      .filter(
        question =>
          question.step === 1 &&
          question.section ===
          'interessi_indirizzi' &&
          question.type ===
          'likert'
      )

      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const reflectionQuestions =
    questions

      .filter(
        question =>
          question.step === 1 &&
          question.section ===
          'riflessione_interessi' &&
          question.type ===
          'text'
      )

      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )

  const workRankingQuestions =
    questions
      .filter(
        question =>
          question.step === 2 &&
          question.section === 'caratteristiche_lavoro' &&
          question.type === 'ranking'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const workCompetenceQuestions =
    questions
      .filter(
        question =>
          question.step === 2 &&
          question.section === 'competenze_lavoro' &&
          question.type === 'likert'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const workReflectionQuestions =
    questions
      .filter(
        question =>
          question.step === 2 &&
          question.section === 'riflessione_lavoro' &&
          question.type === 'text'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const studyHomeQuestions =
    questions
      .filter(
        question =>
          question.step === 3 &&
          question.section === 'studio_casa' &&
          question.type === 'likert'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const studyLessonQuestions =
    questions
      .filter(
        question =>
          question.step === 3 &&
          question.section === 'lezioni' &&
          question.type === 'likert'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const studyOralQuestions =
    questions
      .filter(
        question =>
          question.step === 3 &&
          question.section === 'interrogazioni' &&
          question.type === 'likert'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const studyGroupQuestions =
    questions
      .filter(
        question =>
          question.step === 3 &&
          question.section === 'lavoro_gruppo' &&
          question.type === 'likert'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )

  const trackChoiceQuestion =
    questions.find(
      question =>
        question.step === 4 &&
        question.section === 'scelta_indirizzo' &&
        question.type === 'choice'
    )


  const choiceMotivationQuestions =
    questions
      .filter(
        question =>
          question.step === 4 &&
          question.section === 'motivazione_scelta' &&
          question.type === 'text'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const choiceStrengthQuestions =
    questions
      .filter(
        question =>
          question.step === 4 &&
          question.section === 'punti_forza_scelta' &&
          question.type === 'text'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )


  const choiceProsConsQuestions =
    questions
      .filter(
        question =>
          question.step === 4 &&
          question.section === 'vantaggi_svantaggi' &&
          question.type === 'text'
      )
      .sort(
        (a, b) =>
          a.ordine - b.ordine
      )

  // ==================================================
  // INIZIALIZZIAMO IL RANKING
  // ==================================================

  useEffect(() => {

    if (
      rankingQuestions.length > 0 &&
      ranking.length === 0
    ) {

      setRanking(
        [...rankingQuestions]
      )

    }

  }, [
    questions,
    rankingQuestions.length,
    ranking.length
  ])

  useEffect(() => {

    if (
      workRankingQuestions.length > 0 &&
      workRanking.length === 0
    ) {

      setWorkRanking(
        [...workRankingQuestions]
      )

    }

  }, [
    questions,
    workRankingQuestions.length,
    workRanking.length
  ])

  // ==================================================
  // INIZIALIZZO RANKING DEI 14 ASPETTI
  // 


  useEffect(() => {

    if (
      workRankingQuestions.length > 0 &&
      workRanking.length === 0
    ) {

      setWorkRanking(
        [...workRankingQuestions]
      )

    }

  }, [
    questions,
    workRankingQuestions.length,
    workRanking.length
  ])

  // ==================================================
  // SPOSTA AREA VERSO L'ALTO
  // ==================================================

  function moveRankingUp(index) {

    if (index === 0) {
      return
    }


    const newRanking =
      [...ranking]


    const movedItem =
      newRanking[index]


    newRanking[index] =
      newRanking[index - 1]

    newRanking[index - 1] =
      movedItem


    setRanking(newRanking)

    highlightRankingItem(
      movedItem.id
    )

  }

  // ==================================================
  // SPOSTA AREA VERSO IL BASSO
  // ==================================================

  function moveRankingDown(index) {

    if (
      index ===
      ranking.length - 1
    ) {
      return
    }


    const newRanking =
      [...ranking]


    const movedItem =
      newRanking[index]


    newRanking[index] =
      newRanking[index + 1]

    newRanking[index + 1] =
      movedItem


    setRanking(newRanking)

    highlightRankingItem(
      movedItem.id
    )

  }

  // ==================================================
  // REORDER
  // ==================================================

  function reorderItems(
    list,
    fromIndex,
    toIndex
  ) {

    const updated = [...list]

    const [movedItem] =
      updated.splice(
        fromIndex,
        1
      )

    updated.splice(
      toIndex,
      0,
      movedItem
    )

    return updated
  }

  // ==================================================
  // SPOSTA SPOSTAMENTO LAVORI 
  // ==================================================

  function moveWorkRankingUp(index) {

    if (index === 0) {
      return
    }

    const newRanking =
      [...workRanking]

    const movedItem =
      newRanking[index]

    newRanking[index] =
      newRanking[index - 1]

    newRanking[index - 1] =
      movedItem

    setWorkRanking(newRanking)

    setHighlightedWorkRankingId(
      movedItem.id
    )

    setTimeout(() => {
      setHighlightedWorkRankingId(null)
    }, 500)
  }


  function moveWorkRankingDown(index) {

    if (
      index ===
      workRanking.length - 1
    ) {
      return
    }

    const newRanking =
      [...workRanking]

    const movedItem =
      newRanking[index]

    newRanking[index] =
      newRanking[index + 1]

    newRanking[index + 1] =
      movedItem

    setWorkRanking(newRanking)

    setHighlightedWorkRankingId(
      movedItem.id
    )

    setTimeout(() => {
      setHighlightedWorkRankingId(null)
    }, 500)
  }


  // ==================================================
  // EVIDENZIA ELEMENTO SPOSTATO
  // ==================================================

  function highlightRankingItem(id) {

    setHighlightedRankingId(id)


    setTimeout(() => {

      setHighlightedRankingId(null)

    }, 500)

  }


  // ==================================================
  // RISPOSTA LIKERT
  // ==================================================

  function selectAnswer(
    questionId,
    value
  ) {

    setAnswers(
      previous => ({
        ...previous,
        [questionId]: value
      })
    )

  }

  function selectWorkAnswer(
    questionId,
    value
  ) {

    setWorkAnswers(
      previous => ({
        ...previous,
        [questionId]: value
      })
    )
  }


  function updateWorkReflection(
    questionId,
    value
  ) {

    setWorkReflectionAnswers(
      previous => ({
        ...previous,
        [questionId]: value
      })
    )
  }
  // ==================================================
  // RISPOSTA TESTUALE
  // ==================================================

  function updateReflection(
    questionId,
    value
  ) {

    setReflectionAnswers(
      previous => ({
        ...previous,
        [questionId]: value
      })
    )

  }

  function selectStudyAnswer(
    questionId,
    value
  ) {

    setStudyAnswers(
      previous => ({
        ...previous,
        [questionId]: value
      })
    )
  }
  function updateChoiceAnswer(
    questionId,
    value
  ) {

    setChoiceAnswers(
      previous => ({
        ...previous,
        [questionId]: value
      })
    )
  }

  // ==================================================
  // INVIA RISULTATI
  // ==================================================

  async function submitResults() {

    try {

      const response =
        await fetch(
          '/api/results',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({

                answers,

                ranking:
                  ranking.map(
                    (
                      item,
                      index
                    ) => ({
                      id:
                        item.id,

                      posizione:
                        index + 1
                    })
                  ),

                reflections:
                  reflectionAnswers

              })
          }
        )


      if (!response.ok) {

        throw new Error(
          'Errore nel calcolo dei risultati'
        )

      }


      const data = await response.json()

      setResult(data)
      setCurrentSection('step1-results')
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    catch (error) {
      console.error(error)
      alert('Errore durante il calcolo del risultato.')
    }

  }


  // ==================================================
  // PULSANTI PER PROSSIMA SEZIONE O RIPETI
  // ==================================================

  function restartQuestionnaire() {

    // ==============================================
    // PASSO 1
    // ==============================================

    setAnswers({})
    setReflectionAnswers({})
    setCurrentQuestion(0)
    setCurrentReflection(0)
    setRanking(
      [...rankingQuestions]
    )

    setHighlightedRankingId(null)
    setAreasRankingCompleted(false)
    setResult(null)

    // ==============================================
    // PASSO 2
    // ==============================================

    setWorkRanking(
      [...workRankingQuestions]
    )

    setWorkAnswers({})
    setWorkReflectionAnswers({})
    setCurrentWorkCompetence(0)
    setCurrentWorkReflection(0)
    setHighlightedWorkRankingId(null)
    setWorkRankingCompleted(false)


    // ==============================================
    // PASSO 3
    // ==============================================

    setStudyAnswers({})
    setCurrentStudyQuestion(0)

    // ==============================================
    // PASSO 4
    // ==============================================

    setSelectedTrack('')
    setChoiceAnswers({})
    setCurrentChoiceQuestion(0)

    // ==============================================
    // TORNA ALL'INIZIO
    // ==============================================

    setCurrentSection('intro-areas')
    setPage('questionnaire')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  function BrandHeader() {

    return (
      <div className="brand-header brand-header-page">

        <img
          src={`${import.meta.env.BASE_URL}Buonarroti_Icona.jpg`}
          alt="ITT Buonarroti Trento"
          className="school-logo"
        />

        <div className="brand-name">
          B-oriented
        </div>

      </div>
    )

  }
  // ==================================================
  // PROGRESSO COMPLESSIVO DEL QUESTIONARIO
  // ==================================================

  function getOverallProgress() {

    const completedInterests =
      interestQuestions.filter(
        question =>
          answers[question.id] !== undefined
      ).length

    const completedReflections =
      reflectionQuestions.filter(
        question =>
          reflectionAnswers[
            question.id
          ]?.trim()
      ).length

    const completedWorkCompetences =
      workCompetenceQuestions.filter(
        question =>
          workAnswers[
          question.id
          ] !== undefined
      ).length

    const completedWorkReflections =
      workReflectionQuestions.filter(
        question =>
          workReflectionAnswers[
            question.id
          ]?.trim()
      ).length

    const completedStudy =
      [
        ...studyHomeQuestions,
        ...studyLessonQuestions,
        ...studyOralQuestions,
        ...studyGroupQuestions
      ].filter(
        question =>
          studyAnswers[
          question.id
          ] !== undefined
      ).length

    const completedChoiceTexts =
      [
        ...choiceMotivationQuestions,
        ...choiceStrengthQuestions,
        ...choiceProsConsQuestions
      ].filter(
        question =>
          choiceAnswers[
            question.id
          ]?.trim()
      ).length


    const completed =
      (areasRankingCompleted ? 1 : 0) +

      completedInterests +

      completedReflections +

      (workRankingCompleted ? 1 : 0) +

      completedWorkCompetences +

      completedWorkReflections +

      completedStudy +

      (selectedTrack ? 1 : 0) +

      completedChoiceTexts


    const total =
      1 + // ranking aree

      interestQuestions.length +

      reflectionQuestions.length +

      1 + // ranking lavoro

      workCompetenceQuestions.length +

      workReflectionQuestions.length +

      studyHomeQuestions.length +

      studyLessonQuestions.length +

      studyOralQuestions.length +

      studyGroupQuestions.length +

      1 + // scelta indirizzo

      choiceMotivationQuestions.length +

      choiceStrengthQuestions.length +

      choiceProsConsQuestions.length


    if (total === 0) {
      return 0
    }

    return Math.round(
      (completed / total) * 100
    )
  }

  // ==================================================
  // PANORAMICA DEI 4 PASSI
  // ==================================================
  function StepsOverview({ activeStep = 1 }) {

    const steps = [
      {
        number: 1,
        title: 'Interessi'
      },
      {
        number: 2,
        title: 'Lavoro'
      },
      {
        number: 3,
        title: 'Metodo di studio'
      },
      {
        number: 4,
        title: 'Scelta'
      }
    ]

    const overallProgress = getOverallProgress()

    return (

      <>

        <div className="steps-overview">

          {steps.map(step => {

            const isActive =
              step.number === activeStep

            const isCompleted =
              step.number < activeStep

            return (

              <div
                key={step.number}
                className={
                  isActive
                    ? 'step-item active'
                    : isCompleted
                      ? 'step-item completed'
                      : 'step-item'
                }
              >

                <div className="step-number">

                  {isCompleted
                    ? '✓'
                    : step.number}

                </div>

                <div className="step-title">
                  {step.title}
                </div>

              </div>

            )

          })}

        </div>


        {/* PROGRESSO GENERALE */}

        <div className="overall-progress">

          <div className="overall-progress-header">

            <span>
              Avanzamento del percorso
            </span>

            <strong>
              {overallProgress}%
            </strong>

          </div>


          <div className="overall-progress-track">

            <div
              className="overall-progress-fill"
              style={{
                width:
                  `${overallProgress}%`
              }}
            />

          </div>

        </div>

      </>

    )
  }


  // ==================================================
  // HEADER SEZIONE
  // ==================================================

  function SectionHeader({
    section
  }) {

    const info =
      sectionInfo[section]


    if (!info) {
      return null
    }


    return (

      <div className="section-header">

        <div className="section-step">
          {info.step}
        </div>

        <div className="section-code">
          {info.section}
        </div>

        <h1>
          {info.title}
        </h1>

        <p>
          {info.description}
        </p>

      </div>

    )

  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div className="app">

        <main className="main-container">

          <div className="question-card">

            <h2>
              Caricamento del questionario...
            </h2>

          </div>

        </main>

      </div>

    )

  }


  // ==================================================
  // ERRORE
  // ==================================================

  if (error) {

    return (

      <div className="app">

        <main className="main-container">

          <div className="question-card">

            <h2>
              Impossibile caricare
              il questionario
            </h2>

            <p>
              {error}
            </p>

          </div>

        </main>

      </div>

    )

  }


  // ==================================================
  // HOME
  // ==================================================

  if (page === 'home') {

    return (

      <div className="app">

        <main className="home-page">

          <div className="home-content">

            <div className="home-topbar">
              <div className="home-topbar-brand">
                <img
                  src={`${import.meta.env.BASE_URL}logo_Buonarroti.png`}
                  alt="ITT Buonarroti Trento"
                  className="home-topbar-logo"
                />
                <div className="home-topbar-title">B-oriented</div>
              </div>
            </div>

            <div className="home-inner">
              <div className="home-badge">ORIENTAMENTO</div>

              <h1>4 PASSI NEL FUTURO</h1>
              <h2>Questionario di orientamento</h2>

              <p className="home-description">
                Un percorso per aiutarti a riflettere sui tuoi interessi, sulle tue capacità
                e sulla scelta dell'indirizzo di studio.
              </p>

              <div className="steps-overview">
                ...
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setCurrentSection('intro-areas')
                  setPage('questionnaire')
                }}
              >
                Inizia il questionario
              </button>
            </div>

          </div>

        </main>

      </div>

    )

  }


  // ==================================================
  // QUESTIONARIO
  // ==================================================

  if (page === 'questionnaire') {

    // ==============================================
    // INTRO SEZIONE A
    // ==============================================

    if (
      currentSection ===
      'intro-areas'
    ) {

      return (

        <div className="app">

          <main className="main-container">

            <BrandHeader />
            <StepsOverview />

            <div className="transition-card">

              <div className="transition-label">
                PASSO 1 · SEZIONE 1A
              </div>

              <h1>
                I miei interessi
              </h1>

              <p>

                Iniziamo dalle aree
                professionali che
                suscitano maggiormente
                il tuo interesse.

              </p>

              <p>

                Ordina le proposte
                partendo da quella
                che ti interessa di più.

              </p>


              <button
                className="primary-button"
                onClick={() =>
                  setCurrentSection(
                    'areas'
                  )
                }
              >

                Inizia

              </button>

            </div>

          </main>

        </div>

      )

    }


    // ==============================================
    // SEZIONE A - RANKING
    // ==============================================

    if (
      currentSection ===
      'areas'
    ) {

      return (

        <div className="app">

          <main className="main-container">
            <BrandHeader />

            <StepsOverview />

            <SectionHeader
              section="areas"
            />


            <div className="question-card">

              <h2>
                Ordina le aree
                professionali
              </h2>

              <p className="answer-instruction">

                Porta in alto
                le attività che ti
                interessano maggiormente.

                La posizione 1
                rappresenta quella
                che preferisci.

              </p>


              <div className="ranking-list">

                {ranking.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={
                        item.id
                      }
                      className={
                        highlightedRankingId ===
                          item.id
                          ? 'ranking-item ranking-item-highlighted'
                          : 'ranking-item'
                      }
                      draggable

                      onDragStart={() => {
                        setDraggedRankingIndex(index)
                      }}

                      onDragOver={event => {
                        event.preventDefault()
                      }}

                      onDrop={() => {

                        if (
                          draggedRankingIndex === null ||
                          draggedRankingIndex === index
                        ) {
                          return
                        }

                        const newRanking =
                          reorderItems(
                            ranking,
                            draggedRankingIndex,
                            index
                          )

                        setRanking(newRanking)

                        setDraggedRankingIndex(null)
                      }}

                      onDragEnd={() => {
                        setDraggedRankingIndex(null)
                      }}
                    >

                      <div className="ranking-main">

                        <div className="ranking-drag-handle">
                          ⋮⋮
                        </div>

                        <div className="ranking-position">

                          {
                            index +
                            1
                          }

                        </div>


                        <div className="ranking-text">

                          {
                            item.domanda
                          }

                        </div>

                      </div>


                      <div className="ranking-buttons">

                        <button
                          className="ranking-arrow"
                          onClick={() =>
                            moveRankingUp(
                              index
                            )
                          }
                          disabled={
                            index ===
                            0
                          }
                          aria-label="Sposta verso l'alto"
                        >

                          ↑

                        </button>


                        <button
                          className="ranking-arrow"
                          onClick={() =>
                            moveRankingDown(
                              index
                            )
                          }
                          disabled={
                            index ===
                            ranking.length -
                            1
                          }
                          aria-label="Sposta verso il basso"
                        >

                          ↓

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="navigation-buttons">

                <button
                  className="secondary-button"
                  onClick={() =>
                    setCurrentSection(
                      'intro-areas'
                    )
                  }
                >

                  Indietro

                </button>


                <button
                  className="primary-button"
                  onClick={() => {

                    setAreasRankingCompleted(true)

                    setCurrentSection(
                      'intro-interests'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior:
                        'smooth'
                    })

                  }}
                >

                  Continua

                </button>

              </div>

            </div>

          </main>

        </div>

      )

    }


    // ==============================================
    // INTRO SEZIONE B
    // ==============================================

    if (
      currentSection ===
      'intro-interests'
    ) {

      return (

        <div className="app">

          <main className="main-container">
            <BrandHeader />

            <StepsOverview />

            <div className="transition-card">

              <div className="transition-label">
                PASSO 1 · SEZIONE 1B
              </div>

              <h1>
                Attività e interessi
              </h1>

              <p>

                Ora troverai una serie
                di attività collegate
                ai diversi indirizzi
                della scuola.

              </p>

              <p>

                Per ogni attività
                indica quanto ti
                interesserebbe svolgerla.

              </p>


              <button
                className="primary-button"
                onClick={() => {

                  setCurrentQuestion(
                    0
                  )

                  setCurrentSection(
                    'interests'
                  )

                }}
              >

                Continua

              </button>

            </div>

          </main>

        </div>

      )

    }


    // ==============================================
    // SEZIONE B - INTERESSI
    // ==============================================

    if (
      currentSection ===
      'interests'
    ) {

      const question =
        interestQuestions[
        currentQuestion
        ]


      if (!question) {

        return (

          <div className="app">

            <main className="main-container">

              <div className="question-card">

                <h2>
                  Nessuna domanda
                  disponibile.
                </h2>

              </div>

            </main>

          </div>

        )

      }


      const min =
        question.min || 1

      const max =
        question.max || 5


      const values =
        Array.from(
          {
            length:
              max -
              min +
              1
          },
          (_, index) =>
            min + index
        )


      const progress =
        Math.round(
          (
            (
              currentQuestion +
              1
            ) /
            interestQuestions.length
          ) *
          100
        )


      return (

        <div className="app">

          <main className="main-container">
            <BrandHeader />

            <StepsOverview />

            <SectionHeader
              section="interests"
            />


            <div className="question-progress">

              <div className="progress-label">

                DOMANDA {
                  currentQuestion +
                  1
                } / {
                  interestQuestions.length
                }

              </div>


              <div className="progress-percentage">

                {progress}%

              </div>

            </div>


            <div className="progress-bar">

              <div
                className="progress-bar-fill"
                style={{
                  width:
                    `${progress}%`
                }}
              />

            </div>


            <div className="question-card">

              <h2>
                {
                  question.domanda
                }
              </h2>


              <p className="answer-instruction">

                Quanto ti
                interesserebbe
                svolgere questa
                attività?

              </p>


              <div
                className="likert-scale"
                style={{
                  gridTemplateColumns: `repeat(${values.length}, 1fr)`
                }}
              >
                {values.map(
                  value => (

                    <button
                      key={
                        value
                      }
                      className={
                        answers[
                          question.id
                        ] ===
                          value
                          ? 'likert-button selected'
                          : 'likert-button'
                      }
                      onClick={() =>
                        selectAnswer(
                          question.id,
                          value
                        )
                      }
                    >

                      {value}

                    </button>

                  )
                )}

              </div>


              <div className="likert-labels">

                <span>
                  Per niente
                </span>

                <span>
                  Moltissimo
                </span>

              </div>


              <div className="navigation-buttons">

                <button
                  className="secondary-button"
                  onClick={() => {

                    if (
                      currentQuestion >
                      0
                    ) {

                      setCurrentQuestion(
                        currentQuestion -
                        1
                      )

                    }

                    else {

                      setCurrentSection(
                        'intro-interests'
                      )

                    }

                  }}
                >

                  Indietro

                </button>


                <button
                  className="primary-button"
                  disabled={
                    !answers[
                    question.id
                    ]
                  }
                  onClick={() => {

                    if (
                      currentQuestion <
                      interestQuestions.length -
                      1
                    ) {

                      setCurrentQuestion(
                        currentQuestion +
                        1
                      )

                      window.scrollTo({
                        top: 0,
                        behavior:
                          'smooth'
                      })

                    }

                    else {

                      setCurrentSection(
                        'intro-reflection'
                      )

                      window.scrollTo({
                        top: 0,
                        behavior:
                          'smooth'
                      })

                    }

                  }}
                >

                  {
                    currentQuestion ===
                      interestQuestions.length -
                      1
                      ? 'Continua'
                      : 'Avanti'
                  }

                </button>

              </div>

            </div>

          </main>

        </div>

      )

    }


    // ==============================================
    // INTRO SEZIONE C
    // ==============================================

    if (
      currentSection ===
      'intro-reflection'
    ) {

      return (

        <div className="app">

          <main className="main-container">
            <BrandHeader />

            <StepsOverview />


            <div className="transition-card">

              <div className="transition-label">
                PASSO 1 · SEZIONE 1C
              </div>

              <h1>
                Fermati un momento
                a riflettere
              </h1>

              <p>

                Hai appena espresso
                le tue preferenze
                rispetto alle aree
                professionali e alle
                attività dei diversi
                indirizzi.

              </p>

              <p>

                Prima di vedere il
                risultato, prova a
                spiegare con parole tue
                le motivazioni delle
                tue preferenze.

              </p>


              <button
                className="primary-button"
                onClick={() => {

                  setCurrentReflection(
                    0
                  )

                  setCurrentSection(
                    'reflection'
                  )

                }}
              >

                Continua

              </button>

            </div>

          </main>

        </div>

      )

    }


    // ==============================================
    // SEZIONE C - RIFLESSIONE
    // ==============================================

    if (
      currentSection ===
      'reflection'
    ) {

      const question =
        reflectionQuestions[
        currentReflection
        ]


      if (!question) {

        return (

          <div className="app">

            <main className="main-container">

              <div className="question-card">

                <h2>
                  Nessuna domanda
                  di riflessione
                  disponibile.
                </h2>

              </div>

            </main>

          </div>

        )

      }


      return (

        <div className="app">

          <main className="main-container">
            <BrandHeader />

            <StepsOverview />

            <SectionHeader
              section="reflection"
            />


            <div className="question-progress">

              <div className="progress-label">

                RIFLESSIONE {
                  currentReflection +
                  1
                } / {
                  reflectionQuestions.length
                }

              </div>

            </div>


            <div className="question-card">

              <h2>
                {
                  question.domanda
                }
              </h2>


              <textarea
                className="reflection-textarea"
                value={
                  reflectionAnswers[
                  question.id
                  ] || ''
                }
                onChange={event =>
                  updateReflection(
                    question.id,
                    event.target.value
                  )
                }
                placeholder="Scrivi qui la tua riflessione..."
              />


              <div className="navigation-buttons">

                <button
                  className="secondary-button"
                  onClick={() => {

                    if (
                      currentReflection >
                      0
                    ) {

                      setCurrentReflection(
                        currentReflection -
                        1
                      )

                    }

                    else {

                      setCurrentSection(
                        'intro-reflection'
                      )

                    }

                  }}
                >

                  Indietro

                </button>


                <button
                  className="primary-button"
                  onClick={() => {

                    if (
                      currentReflection <
                      reflectionQuestions.length -
                      1
                    ) {

                      setCurrentReflection(
                        currentReflection +
                        1
                      )

                    }

                    else {

                      submitResults()

                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      })
                    }

                  }}
                >

                  {
                    currentReflection ===
                      reflectionQuestions.length -
                      1
                      ? 'Vedi il risultato'
                      : 'Avanti'
                  }

                </button>

              </div>

            </div>

          </main>

        </div>

      )

    }

  }


  // ==========================
  // SEZIONE RISULTATI
  // ==========================

  if (
    currentSection ===
    'step1-results' &&
    result
  ) {

    const recommended =
      Array.isArray(result.recommended)
        ? result.recommended
        : result.recommended
          ? [result.recommended]
          : []


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={1}
          />


          <div className="step-result-card">

            <div className="transition-label">
              PASSO 1 COMPLETATO
            </div>


            <h1>
              Il tuo profilo di interessi
            </h1>


            <p className="step-result-intro">

              In base alle attività che hai
              indicato come più interessanti,
              questi sono gli indirizzi che
              risultano più vicini ai tuoi
              interessi.

            </p>


            {recommended.length === 1 ? (

              <div className="step-result-highlight">

                <span className="step-result-label">
                  Maggiore affinità
                </span>

                <strong>
                  {
                    trackNames[
                    recommended[0].indirizzo
                    ]
                  }
                </strong>

                <span>
                  {
                    recommended[0].punteggio
                  } punti
                </span>

              </div>

            ) : (

              <div className="step-result-highlight">

                <span className="step-result-label">
                  Affinità condivisa
                </span>

                {recommended.map(item => (

                  <div
                    className="step-result-tie"
                    key={item.indirizzo}
                  >

                    <strong>
                      {
                        trackNames[
                        item.indirizzo
                        ]
                      }
                    </strong>

                    <span>
                      {item.punteggio} punti
                    </span>

                  </div>

                ))}

              </div>

            )}


            <div className="step-result-ranking">

              {result.ranking.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={item.indirizzo}
                    className="step-result-row"
                  >

                    <div className="step-result-position">
                      {index + 1}
                    </div>

                    <div className="step-result-name">

                      {
                        trackNames[
                        item.indirizzo
                        ]
                      }

                    </div>

                    <strong>
                      {item.punteggio}
                    </strong>

                  </div>

                )
              )}

            </div>


            <div className="step-result-note">

              <strong>
                Attenzione:
              </strong>

              questo risultato riguarda
              solamente i tuoi interessi.

              Non rappresenta ancora
              l'esito finale del percorso
              di orientamento.

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  setCurrentReflection(
                    reflectionQuestions.length - 1
                  )

                  setCurrentSection(
                    'reflection'
                  )

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                onClick={() => {

                  setCurrentSection(
                    'intro-work'
                  )

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })

                }}
              >
                Continua al Passo 2
              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ============================
  // SEZIONE INTRO-WORK 
  // ============================

  if (
    currentSection === 'intro-work'
  ) {

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={2}
          />

          <div className="transition-card">

            <div className="transition-label">
              PASSO 2 · SEZIONE 2A
            </div>

            <h1>
              Nel lavoro vorrei trovare...
            </h1>

            <p>
              Il lavoro non è fatto soltanto
              dalle attività che svolgiamo.
            </p>

            <p>
              Pensa alle caratteristiche che
              vorresti trovare nel tuo futuro
              lavoro e ordinala in base alla
              loro importanza.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setCurrentSection(
                  'work-ranking'
                )
              }
            >
              Continua
            </button>

          </div>

        </main>

      </div>

    )
  }
  // ============================
  // SEZIONE WORK RANKING
  // ============================

  if (
    currentSection ===
    'work-ranking'
  ) {

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={2}
          />

          <SectionHeader
            section="work"
          />


          <div className="question-card">

            <h2>
              Cosa è importante
              nel tuo futuro lavoro?
            </h2>

            <p className="answer-instruction">

              Ordina le 14 caratteristiche.

              La posizione 1 rappresenta
              quella più importante per te,
              mentre la posizione 14
              quella meno importante.

            </p>


            <div className="ranking-list">

              {workRanking.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={item.id}
                    className={
                      highlightedWorkRankingId ===
                        item.id
                        ? 'ranking-item ranking-item-highlighted'
                        : 'ranking-item'
                    }
                    draggable

                    onDragStart={() => {
                      setDraggedRankingIndex(index)
                    }}

                    onDragOver={event => {
                      event.preventDefault()
                    }}

                    onDrop={() => {

                      if (
                        draggedRankingIndex === null ||
                        draggedRankingIndex === index
                      ) {
                        return
                      }

                      const newRanking =
                        reorderItems(
                          ranking,
                          draggedRankingIndex,
                          index
                        )

                      setRanking(newRanking)

                      setDraggedRankingIndex(null)
                    }}

                    onDragEnd={() => {
                      setDraggedRankingIndex(null)
                    }}
                  >

                    <div className="ranking-main">
                      <div className="ranking-drag-handle">
                        ⋮⋮
                      </div>

                      <div className="ranking-position">
                        {index + 1}
                      </div>

                      <div className="ranking-text">
                        {item.domanda}
                      </div>

                    </div>


                    <div className="ranking-buttons">

                      <button
                        type="button"
                        className="ranking-arrow"
                        onClick={() =>
                          moveWorkRankingUp(
                            index
                          )
                        }
                        disabled={
                          index === 0
                        }
                        aria-label="Sposta verso l'alto"
                      >
                        ↑
                      </button>


                      <button
                        type="button"
                        className="ranking-arrow"
                        onClick={() =>
                          moveWorkRankingDown(
                            index
                          )
                        }
                        disabled={
                          index ===
                          workRanking.length - 1
                        }
                        aria-label="Sposta verso il basso"
                      >
                        ↓
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setCurrentSection(
                    'intro-work'
                  )
                }
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setWorkRankingCompleted(true)

                  setCurrentSection(
                    'intro-work-competences'
                  )

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })

                }}
              >
                Continua
              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }
  // ============================
  // SEZIONE INTRO-WORK COMPETENCES
  // ============================

  if (
    currentSection ===
    'intro-work-competences'
  ) {

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={2}
          />

          <div className="transition-card">

            <div className="transition-label">
              PASSO 2 · SEZIONE 2B
            </div>

            <h1>
              Le mie competenze
            </h1>

            <p>
              Ora pensa a ciò che sai fare
              e alle caratteristiche che
              possiedi.
            </p>

            <p>
              Per ogni competenza indica
              quanto pensi di possederla,
              utilizzando una scala da
              1 a 7.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => {

                setCurrentWorkCompetence(0)

                setCurrentSection(
                  'work-competences'
                )

              }}
            >
              Continua
            </button>

          </div>

        </main>

      </div>

    )
  }

  // ============================
  // SEZIONE WORK COMPETENCES
  // ============================

  if (
    currentSection ===
    'work-competences'
  ) {

    const question =
      workCompetenceQuestions[
      currentWorkCompetence
      ]


    if (!question) {
      return null
    }


    const min =
      question.min || 1

    const max =
      question.max || 7


    const values =
      Array.from(
        {
          length:
            max - min + 1
        },
        (_, index) =>
          min + index
      )


    const progress =
      Math.round(
        (
          (
            currentWorkCompetence +
            1
          ) /
          workCompetenceQuestions.length
        ) *
        100
      )


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={2}
          />

          <SectionHeader
            section="competences"
          />


          <div className="question-progress">

            <div className="progress-label">

              COMPETENZA {
                currentWorkCompetence + 1
              } / {
                workCompetenceQuestions.length
              }

            </div>

            <div className="progress-percentage">
              {progress}%
            </div>

          </div>


          <div className="progress-bar">

            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>


          <div className="question-card">

            <h2>
              {question.domanda}
            </h2>


            <p className="answer-instruction">

              Quanto pensi di possedere
              questa competenza?

            </p>


            <div
              className="likert-scale"
              style={{
                gridTemplateColumns: `repeat(${values.length}, 1fr)`
              }}
            >
              {values.map(value => (

                <button
                  type="button"
                  key={value}
                  className={
                    workAnswers[
                      question.id
                    ] === value
                      ? 'likert-button selected'
                      : 'likert-button'
                  }
                  onClick={() =>
                    selectWorkAnswer(
                      question.id,
                      value
                    )
                  }
                >
                  {value}
                </button>

              ))}

            </div>


            <div className="likert-labels">

              <span>
                Per niente
              </span>

              <span>
                Del tutto
              </span>

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentWorkCompetence >
                    0
                  ) {

                    setCurrentWorkCompetence(
                      currentWorkCompetence - 1
                    )

                  } else {

                    setCurrentSection(
                      'intro-work-competences'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"

                disabled={
                  !workAnswers[
                  question.id
                  ]
                }
                onClick={() => {

                  if (
                    currentWorkCompetence <
                    workCompetenceQuestions.length -
                    1
                  ) {

                    setCurrentWorkCompetence(
                      currentWorkCompetence + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentSection(
                      'intro-work-reflection'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentWorkCompetence ===
                    workCompetenceQuestions.length -
                    1
                    ? 'Continua'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ============================
  // SEZIONE INTRO-WORK REFLECTIONS
  // ============================

  if (
    currentSection ===
    'intro-work-reflection'
  ) {

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={2}
          />

          <div className="transition-card">

            <div className="transition-label">
              PASSO 2 · SEZIONE 2C
            </div>

            <h1>
              Metti insieme
              le tue risposte
            </h1>

            <p>
              Hai indicato cosa vorresti
              trovare nel tuo futuro lavoro
              e quali competenze pensi
              di possedere.
            </p>

            <p>
              Ora prova a collegare
              questi due aspetti.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => {

                setCurrentWorkReflection(
                  0
                )

                setCurrentSection(
                  'work-reflection'
                )

              }}
            >
              Continua
            </button>

          </div>

        </main>

      </div>

    )
  }

  // ============================
  // SEZIONE WORK REFLECTIONS
  // ============================

  if (
    currentSection ===
    'work-reflection'
  ) {

    const question =
      workReflectionQuestions[
      currentWorkReflection
      ]


    if (!question) {
      return null
    }


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={2}
          />

          <SectionHeader
            section="workReflection"
          />


          <div className="question-progress">

            <div className="progress-label">

              RIFLESSIONE {
                currentWorkReflection + 1
              } / {
                workReflectionQuestions.length
              }

            </div>

          </div>


          <div className="question-card">

            <h2>
              {question.domanda}
            </h2>


            {workRanking[
              currentWorkReflection
            ] && (

                <div className="work-choice-reminder">

                  <strong>
                    {
                      currentWorkReflection === 0
                        ? '1ª caratteristica: '
                        : '2ª caratteristica: '
                    }
                  </strong>

                  {
                    workRanking[
                      currentWorkReflection
                    ].domanda
                  }

                </div>

              )}


            <textarea
              className="reflection-textarea"
              value={
                workReflectionAnswers[
                question.id
                ] || ''
              }
              onChange={event =>
                updateWorkReflection(
                  question.id,
                  event.target.value
                )
              }
              placeholder="Scrivi qui la tua riflessione..."
            />


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentWorkReflection >
                    0
                  ) {

                    setCurrentWorkReflection(
                      currentWorkReflection - 1
                    )

                  } else {

                    setCurrentSection(
                      'intro-work-reflection'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !workReflectionAnswers[
                    question.id
                  ]?.trim()
                }
                onClick={() => {

                  if (
                    currentWorkReflection <
                    workReflectionQuestions.length -
                    1
                  ) {

                    setCurrentWorkReflection(
                      currentWorkReflection + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    /*
                     * PASSO 2 COMPLETATO.
                     *
                     * Per ora non abbiamo
                     * ancora implementato
                     * il Passo 3.
                     */

                    setCurrentSection(
                      'work-completed'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentWorkReflection ===
                    workReflectionQuestions.length -
                    1
                    ? 'Completa il Passo 2'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  //  ===========================
  // SEZIONE LAVORO COMPLETATO
  // ============================

  if (
    currentSection ===
    'work-completed'
  ) {

    // Prime due caratteristiche
    // del lavoro scelte dallo studente
    const topWorkCharacteristics =
      workRanking.slice(0, 2)


    // Ordiniamo le competenze
    // in base al punteggio attribuito
    const rankedCompetences =
      workCompetenceQuestions

        .map(question => ({

          id:
            question.id,

          domanda:
            question.domanda,

          value:
            Number(
              workAnswers[
              question.id
              ] || 0
            )

        }))

        .sort(
          (a, b) =>
            b.value - a.value
        )


    // Mostriamo le prime 5
    const topCompetences =
      rankedCompetences.slice(0, 5)


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={2}
          />


          <div className="step-result-card">

            <div className="transition-label">
              PASSO 2 COMPLETATO
            </div>


            <h1>
              Il tuo profilo lavorativo
            </h1>


            <p className="step-result-intro">

              Le tue risposte descrivono
              quali aspetti consideri più
              importanti nel lavoro e quali
              competenze ritieni di possedere
              maggiormente.

            </p>


            {/* ======================================
              PRIME DUE CARATTERISTICHE
             ====================================== */}

            <div className="summary-section">

              <h2>
                Nel lavoro vorresti soprattutto...
              </h2>


              <div className="work-priorities">

                {topWorkCharacteristics.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="work-priority"
                      key={item.id}
                    >

                      <div className="work-priority-number">
                        {index + 1}
                      </div>

                      <div>
                        {item.domanda}
                      </div>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* ======================================
              COMPETENZE PIÙ FORTI
             ====================================== */}

            <div className="summary-section">

              <h2>
                Le competenze che ritieni
                di possedere maggiormente
              </h2>


              <div className="competence-summary">

                {topCompetences.map(
                  competence => (

                    <div
                      className="competence-summary-row"
                      key={competence.id}
                    >

                      <span>
                        {competence.domanda}
                      </span>

                      <strong>
                        {competence.value}/7
                      </strong>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* ======================================
              NOTA
             ====================================== */}

            <div className="step-result-note">

              Questo riepilogo non assegna
              un indirizzo.

              Serve a mettere in relazione
              ciò che cerchi nel tuo futuro
              lavoro con le competenze che
              riconosci in te stesso.

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  setCurrentWorkReflection(
                    workReflectionQuestions.length - 1
                  )

                  setCurrentSection(
                    'work-reflection'
                  )

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                onClick={() => {

                  setCurrentSection(
                    'intro-study'
                  )

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })

                }}
              >
                Continua al Passo 3
              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // PASSO 3 - INTRO METODO DI STUDIO
  // ==================================================

  if (
    currentSection ===
    'intro-study'
  ) {

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={3}
          />

          <div className="transition-card">

            <div className="transition-label">
              PASSO 3 · METODO DI STUDIO
            </div>

            <h1>
              Il tuo metodo di studio
            </h1>

            <p>
              Qualunque sia l'indirizzo
              che sceglierai, sarà importante
              affrontare il nuovo percorso
              con un metodo di studio efficace.
            </p>

            <p>
              In questa parte rifletterai
              sul tuo comportamento in
              quattro diverse situazioni:
            </p>


            <div className="study-areas-preview">

              <div className="study-area-preview">
                <strong>1</strong>
                <span>Studio a casa</span>
              </div>

              <div className="study-area-preview">
                <strong>2</strong>
                <span>Durante le lezioni</span>
              </div>

              <div className="study-area-preview">
                <strong>3</strong>
                <span>Durante le interrogazioni</span>
              </div>

              <div className="study-area-preview">
                <strong>4</strong>
                <span>Lavori di gruppo</span>
              </div>

            </div>


            <p>
              Per ogni affermazione indica
              quanto descrive il tuo comportamento
              utilizzando una scala da
              <strong> 1 = Per niente </strong>
              a
              <strong> 7 = Del tutto</strong>.
            </p>


            <button
              type="button"
              className="primary-button"
              onClick={() => {

                setCurrentSection(
                  'study-home'
                )

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })

              }}
            >
              Inizia il Passo 3
            </button>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // PASSO 3 - STUDIO A CASA
  // ==================================================

  if (
    currentSection ===
    'study-home'
  ) {

    const question =
      studyHomeQuestions[
      currentStudyQuestion
      ]

    if (!question) {
      return null
    }

    const min =
      question.min || 1

    const max =
      question.max || 7

    const values =
      Array.from(
        {
          length:
            max - min + 1
        },
        (_, index) =>
          min + index
      )

    const progress =
      Math.round(
        (
          (
            currentStudyQuestion + 1
          ) /
          studyHomeQuestions.length
        ) *
        100
      )

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={3}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 3 DI 4
            </div>

            <div className="section-code">
              SEZIONE 3A
            </div>

            <h1>
              Quando studio a casa...
            </h1>

            <p>
              Indica quanto questa frase
              descrive il tuo comportamento.
            </p>

          </div>


          <div className="question-progress">

            <div className="progress-label">

              DOMANDA {
                currentStudyQuestion + 1
              } / {
                studyHomeQuestions.length
              }

            </div>

            <div className="progress-percentage">
              {progress}%
            </div>

          </div>


          <div className="progress-bar">

            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>


          <div className="question-card">

            <h2>
              {question.domanda}
            </h2>


            <p className="answer-instruction">
              Quanto descrive il tuo
              comportamento?
            </p>


            <div
              className="likert-scale"
              style={{
                gridTemplateColumns:
                  `repeat(${values.length}, 1fr)`
              }}
            >

              {values.map(value => (

                <button
                  type="button"
                  key={value}
                  className={
                    studyAnswers[
                      question.id
                    ] === value
                      ? 'likert-button selected'
                      : 'likert-button'
                  }
                  onClick={() =>
                    selectStudyAnswer(
                      question.id,
                      value
                    )
                  }
                >
                  {value}
                </button>

              ))}

            </div>


            <div className="likert-labels">

              <span>
                Per niente
              </span>

              <span>
                Del tutto
              </span>

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentStudyQuestion >
                    0
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion - 1
                    )

                  } else {

                    setCurrentSection(
                      'intro-study'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !studyAnswers[
                  question.id
                  ]
                }
                onClick={() => {

                  if (
                    currentStudyQuestion <
                    studyHomeQuestions.length - 1
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentStudyQuestion(0)

                    setCurrentSection(
                      'study-lessons'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentStudyQuestion ===
                    studyHomeQuestions.length - 1
                    ? 'Continua'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // PASSO 3 - DURANTE LE LEZIONI
  // ==================================================

  if (
    currentSection ===
    'study-lessons'
  ) {

    const question =
      studyLessonQuestions[
      currentStudyQuestion
      ]

    if (!question) {
      return null
    }

    const min =
      question.min || 1

    const max =
      question.max || 7

    const values =
      Array.from(
        {
          length:
            max - min + 1
        },
        (_, index) =>
          min + index
      )

    const progress =
      Math.round(
        (
          (
            currentStudyQuestion + 1
          ) /
          studyLessonQuestions.length
        ) *
        100
      )

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={3}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 3 DI 4
            </div>

            <div className="section-code">
              SEZIONE 3B
            </div>

            <h1>
              Durante le lezioni...
            </h1>

            <p>
              Indica quanto questa frase
              descrive il tuo comportamento
              durante le lezioni.
            </p>

          </div>


          <div className="question-progress">

            <div className="progress-label">

              DOMANDA {
                currentStudyQuestion + 1
              } / {
                studyLessonQuestions.length
              }

            </div>

            <div className="progress-percentage">
              {progress}%
            </div>

          </div>


          <div className="progress-bar">

            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>


          <div className="question-card">

            <h2>
              {question.domanda}
            </h2>

            <p className="answer-instruction">
              Quanto descrive il tuo
              comportamento?
            </p>


            <div
              className="likert-scale"
              style={{
                gridTemplateColumns:
                  `repeat(${values.length}, 1fr)`
              }}
            >

              {values.map(value => (

                <button
                  type="button"
                  key={value}
                  className={
                    studyAnswers[
                      question.id
                    ] === value
                      ? 'likert-button selected'
                      : 'likert-button'
                  }
                  onClick={() =>
                    selectStudyAnswer(
                      question.id,
                      value
                    )
                  }
                >
                  {value}
                </button>

              ))}

            </div>


            <div className="likert-labels">

              <span>
                Per niente
              </span>

              <span>
                Del tutto
              </span>

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentStudyQuestion >
                    0
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion - 1
                    )

                  } else {

                    setCurrentStudyQuestion(
                      studyHomeQuestions.length - 1
                    )

                    setCurrentSection(
                      'study-home'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !studyAnswers[
                  question.id
                  ]
                }
                onClick={() => {

                  if (
                    currentStudyQuestion <
                    studyLessonQuestions.length - 1
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentStudyQuestion(0)

                    setCurrentSection(
                      'study-orals'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentStudyQuestion ===
                    studyLessonQuestions.length - 1
                    ? 'Continua'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // PASSO 3 - DURANTE LE INTERROGAZIONI
  // ==================================================

  if (
    currentSection ===
    'study-orals'
  ) {

    const question =
      studyOralQuestions[
      currentStudyQuestion
      ]

    if (!question) {
      return null
    }

    const min =
      question.min || 1

    const max =
      question.max || 7

    const values =
      Array.from(
        {
          length:
            max - min + 1
        },
        (_, index) =>
          min + index
      )

    const progress =
      Math.round(
        (
          (
            currentStudyQuestion + 1
          ) /
          studyOralQuestions.length
        ) *
        100
      )

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={3}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 3 DI 4
            </div>

            <div className="section-code">
              SEZIONE 3C
            </div>

            <h1>
              Durante le interrogazioni...
            </h1>

            <p>
              Indica quanto questa frase
              descrive il tuo comportamento
              durante le interrogazioni.
            </p>

          </div>


          <div className="question-progress">

            <div className="progress-label">

              DOMANDA {
                currentStudyQuestion + 1
              } / {
                studyOralQuestions.length
              }

            </div>

            <div className="progress-percentage">
              {progress}%
            </div>

          </div>


          <div className="progress-bar">

            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>


          <div className="question-card">

            <h2>
              {question.domanda}
            </h2>

            <p className="answer-instruction">
              Quanto descrive il tuo
              comportamento?
            </p>


            <div
              className="likert-scale"
              style={{
                gridTemplateColumns:
                  `repeat(${values.length}, 1fr)`
              }}
            >

              {values.map(value => (

                <button
                  type="button"
                  key={value}
                  className={
                    studyAnswers[
                      question.id
                    ] === value
                      ? 'likert-button selected'
                      : 'likert-button'
                  }
                  onClick={() =>
                    selectStudyAnswer(
                      question.id,
                      value
                    )
                  }
                >
                  {value}
                </button>

              ))}

            </div>


            <div className="likert-labels">

              <span>
                Per niente
              </span>

              <span>
                Del tutto
              </span>

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentStudyQuestion >
                    0
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion - 1
                    )

                  } else {

                    setCurrentStudyQuestion(
                      studyLessonQuestions.length - 1
                    )

                    setCurrentSection(
                      'study-lessons'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !studyAnswers[
                  question.id
                  ]
                }
                onClick={() => {

                  if (
                    currentStudyQuestion <
                    studyOralQuestions.length - 1
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentStudyQuestion(0)

                    setCurrentSection(
                      'study-group'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentStudyQuestion ===
                    studyOralQuestions.length - 1
                    ? 'Continua'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }
  // ==================================================
  // PASSO 3 - DURANTE I LAVORI DI GRUPPO
  // ==================================================

  if (
    currentSection ===
    'study-group'
  ) {

    const question =
      studyGroupQuestions[
      currentStudyQuestion
      ]

    if (!question) {
      return null
    }

    const min =
      question.min || 1

    const max =
      question.max || 7

    const values =
      Array.from(
        {
          length:
            max - min + 1
        },
        (_, index) =>
          min + index
      )

    const progress =
      Math.round(
        (
          (
            currentStudyQuestion + 1
          ) /
          studyGroupQuestions.length
        ) *
        100
      )

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={3}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 3 DI 4
            </div>

            <div className="section-code">
              SEZIONE 3D
            </div>

            <h1>
              Durante i lavori di gruppo...
            </h1>

            <p>
              Indica quanto questa frase
              descrive il tuo comportamento
              durante le attività di gruppo.
            </p>

          </div>


          <div className="question-progress">

            <div className="progress-label">

              DOMANDA {
                currentStudyQuestion + 1
              } / {
                studyGroupQuestions.length
              }

            </div>

            <div className="progress-percentage">
              {progress}%
            </div>

          </div>


          <div className="progress-bar">

            <div
              className="progress-bar-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>


          <div className="question-card">

            <h2>
              {question.domanda}
            </h2>

            <p className="answer-instruction">
              Quanto descrive il tuo
              comportamento?
            </p>


            <div
              className="likert-scale"
              style={{
                gridTemplateColumns:
                  `repeat(${values.length}, 1fr)`
              }}
            >

              {values.map(value => (

                <button
                  type="button"
                  key={value}
                  className={
                    studyAnswers[
                      question.id
                    ] === value
                      ? 'likert-button selected'
                      : 'likert-button'
                  }
                  onClick={() =>
                    selectStudyAnswer(
                      question.id,
                      value
                    )
                  }
                >
                  {value}
                </button>

              ))}

            </div>


            <div className="likert-labels">

              <span>
                Per niente
              </span>

              <span>
                Del tutto
              </span>

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentStudyQuestion >
                    0
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion - 1
                    )

                  } else {

                    setCurrentStudyQuestion(
                      studyOralQuestions.length - 1
                    )

                    setCurrentSection(
                      'study-orals'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !studyAnswers[
                  question.id
                  ]
                }
                onClick={() => {

                  if (
                    currentStudyQuestion <
                    studyGroupQuestions.length - 1
                  ) {

                    setCurrentStudyQuestion(
                      currentStudyQuestion + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentSection(
                      'study-results'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentStudyQuestion ===
                    studyGroupQuestions.length - 1
                    ? 'Vedi il risultato'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }
  // ==================================================
  // PASSO 3 - RISULTATI METODO DI STUDIO
  // ==================================================

  if (
    currentSection ===
    'study-results'
  ) {

    function calculateStudyScore(list) {

      return list.reduce(
        (total, question) =>
          total +
          Number(
            studyAnswers[
            question.id
            ] || 0
          ),
        0
      )
    }


    const homeScore =
      calculateStudyScore(
        studyHomeQuestions
      )

    const lessonScore =
      calculateStudyScore(
        studyLessonQuestions
      )

    const oralScore =
      calculateStudyScore(
        studyOralQuestions
      )

    const groupScore =
      calculateStudyScore(
        studyGroupQuestions
      )


    const studyAreas = [
      {
        label: 'Studio a casa',
        score: homeScore
      },
      {
        label: 'Durante le lezioni',
        score: lessonScore
      },
      {
        label: 'Durante le interrogazioni',
        score: oralScore
      },
      {
        label: 'Lavoro di gruppo',
        score: groupScore
      }
    ]


    const sortedAreas =
      [...studyAreas].sort(
        (a, b) =>
          b.score - a.score
      )


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={3}
          />


          <div className="step-result-card">

            <div className="transition-label">
              PASSO 3 COMPLETATO
            </div>


            <h1>
              Il tuo metodo di studio
            </h1>


            <p className="step-result-intro">

              Hai valutato il tuo comportamento
              in quattro diverse situazioni.

              Ogni area può ottenere un punteggio
              compreso tra 4 e 28.

            </p>


            <div className="study-results-list">

              {studyAreas.map(area => {

                const percentage =
                  Math.round(
                    (
                      area.score /
                      28
                    ) *
                    100
                  )

                return (

                  <div
                    className="study-result-item"
                    key={area.label}
                  >

                    <div className="study-result-header">

                      <span>
                        {area.label}
                      </span>

                      <strong>
                        {area.score}/28
                      </strong>

                    </div>


                    <div className="study-result-bar">

                      <div
                        className="study-result-bar-fill"
                        style={{
                          width:
                            `${percentage}%`
                        }}
                      />

                    </div>

                  </div>

                )

              })}

            </div>


            <div className="summary-section">

              <h2>
                Il tuo punto di forza
              </h2>

              <div className="step-result-highlight">

                <span className="step-result-label">
                  Area con il punteggio più alto
                </span>

                <strong>
                  {
                    sortedAreas[0].label
                  }
                </strong>

                <span>
                  {
                    sortedAreas[0].score
                  } / 28
                </span>

              </div>

            </div>


            <div className="step-result-note">

              Un punteggio più alto indica
              che utilizzi con maggiore
              frequenza comportamenti efficaci
              in quella specifica situazione.

              Questo risultato serve a
              individuare sia i tuoi punti
              di forza sia le aree sulle quali
              puoi ancora migliorare.

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  setCurrentStudyQuestion(
                    studyGroupQuestions.length - 1
                  )

                  setCurrentSection(
                    'study-group'
                  )

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                onClick={() => {

                  setCurrentSection(
                    'intro-choice'
                  )

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })

                }}
              >
                Continua al Passo 4
              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // PASSO 4 - INTRO LA SCELTA
  // ==================================================

  if (
    currentSection ===
    'intro-choice'
  ) {

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={4}
          />

          <div className="transition-card">

            <div className="transition-label">
              PASSO 4 · LA SCELTA
            </div>

            <h1>
              È il momento di scegliere
            </h1>

            <p>
              Hai riflettuto sui tuoi interessi,
              su ciò che vorresti trovare nel lavoro
              e sul tuo metodo di studio.
            </p>

            <p>
              Ora prova a mettere insieme
              quanto emerso nei primi tre passi
              e pensa all'indirizzo che senti
              più vicino a te.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => {

                setCurrentSection(
                  'choice-track'
                )

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })

              }}
            >
              Inizia il Passo 4
            </button>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // PASSO 4 - SCELTA DELL'INDIRIZZO
  // ==================================================

  if (
    currentSection ===
    'choice-track'
  ) {

    if (!trackChoiceQuestion) {
      return null
    }

    const tracks = [
      {
        id: 'informatica',
        label:
          'Informatica e Telecomunicazioni'
      },
      {
        id: 'elettronica',
        label:
          'Elettronica e Automazione'
      },
      {
        id: 'meccanica',
        label:
          'Meccanica, Meccatronica ed Energia'
      },
      {
        id: 'chimica',
        label:
          'Chimica, Materiali e Biotecnologie'
      },
      {
        id: 'cat',
        label:
          'Costruzioni, Ambiente e Territorio'
      }
    ]


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={4}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 4 DI 4
            </div>

            <div className="section-code">
              SEZIONE 4A
            </div>

            <h1>
              La tua scelta
            </h1>

            <p>
              Ora prova a indicare l'indirizzo
              che pensi di scegliere.
            </p>

          </div>


          <div className="question-card">

            <h2>
              {trackChoiceQuestion.domanda}
            </h2>


            <div className="track-choice-list">

              {tracks.map(track => (

                <button
                  type="button"
                  key={track.id}
                  className={
                    selectedTrack === track.id
                      ? 'track-choice selected'
                      : 'track-choice'
                  }
                  onClick={() =>
                    setSelectedTrack(
                      track.id
                    )
                  }
                >

                  <span className="track-choice-marker">

                    {
                      selectedTrack === track.id
                        ? '✓'
                        : ''
                    }

                  </span>

                  <span>
                    {track.label}
                  </span>

                </button>

              ))}

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setCurrentSection(
                    'intro-choice'
                  )
                }
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={!selectedTrack}
                onClick={() => {

                  setCurrentChoiceQuestion(0)

                  setCurrentSection(
                    'choice-motivation'
                  )

                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })

                }}
              >
                Continua
              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // PASSO 4 - MOTIVAZIONE DELLA SCELTA
  // ==================================================

  if (
    currentSection ===
    'choice-motivation'
  ) {

    const question =
      choiceMotivationQuestions[
      currentChoiceQuestion
      ]

    if (!question) {
      return null
    }

    const selectedTrackLabel =
      trackNames[selectedTrack]


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={4}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 4 DI 4
            </div>

            <div className="section-code">
              SEZIONE 4B
            </div>

            <h1>
              Motiva la tua scelta
            </h1>

            <p>
              Rifletti sul collegamento tra
              i tuoi interessi e l'indirizzo
              che hai scelto.
            </p>

          </div>


          <div className="question-progress">

            <div className="progress-label">

              RIFLESSIONE {
                currentChoiceQuestion + 1
              } / {
                choiceMotivationQuestions.length
              }

            </div>

          </div>


          <div className="question-card">

            <div className="choice-track-reminder">

              <span>
                Indirizzo scelto
              </span>

              <strong>
                {selectedTrackLabel}
              </strong>

            </div>


            <h2>
              {question.domanda}
            </h2>


            <textarea
              className="reflection-textarea"
              value={
                choiceAnswers[
                question.id
                ] || ''
              }
              onChange={event =>
                updateChoiceAnswer(
                  question.id,
                  event.target.value
                )
              }
              placeholder="Scrivi qui la tua risposta..."
            />


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentChoiceQuestion >
                    0
                  ) {

                    setCurrentChoiceQuestion(
                      currentChoiceQuestion - 1
                    )

                  } else {

                    setCurrentSection(
                      'choice-track'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !choiceAnswers[
                    question.id
                  ]?.trim()
                }
                onClick={() => {

                  if (
                    currentChoiceQuestion <
                    choiceMotivationQuestions.length - 1
                  ) {

                    setCurrentChoiceQuestion(
                      currentChoiceQuestion + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentChoiceQuestion(0)

                    setCurrentSection(
                      'choice-strengths'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentChoiceQuestion ===
                    choiceMotivationQuestions.length - 1
                    ? 'Continua'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }
  // ==================================================
  // PASSO 4 - PUNTI DI FORZA
  // ==================================================

  if (
    currentSection ===
    'choice-strengths'
  ) {

    const question =
      choiceStrengthQuestions[
      currentChoiceQuestion
      ]

    if (!question) {
      return null
    }

    const selectedTrackLabel =
      trackNames[selectedTrack]

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={4}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 4 DI 4
            </div>

            <div className="section-code">
              SEZIONE 4C
            </div>

            <h1>
              I tuoi punti di forza
            </h1>

            <p>
              Pensa a ciò che può aiutarti
              ad affrontare bene i prossimi
              tre anni di studio.
            </p>

          </div>


          <div className="question-progress">

            <div className="progress-label">

              PUNTO DI FORZA {
                currentChoiceQuestion + 1
              } / {
                choiceStrengthQuestions.length
              }

            </div>

          </div>


          <div className="question-card">

            <div className="choice-track-reminder">

              <span>
                Indirizzo scelto
              </span>

              <strong>
                {selectedTrackLabel}
              </strong>

            </div>


            <h2>
              {question.domanda}
            </h2>


            <textarea
              className="reflection-textarea"
              value={
                choiceAnswers[
                question.id
                ] || ''
              }
              onChange={event =>
                updateChoiceAnswer(
                  question.id,
                  event.target.value
                )
              }
              placeholder="Scrivi qui la tua risposta..."
            />


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentChoiceQuestion >
                    0
                  ) {

                    setCurrentChoiceQuestion(
                      currentChoiceQuestion - 1
                    )

                  } else {

                    setCurrentChoiceQuestion(
                      choiceMotivationQuestions.length - 1
                    )

                    setCurrentSection(
                      'choice-motivation'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !choiceAnswers[
                    question.id
                  ]?.trim()
                }
                onClick={() => {

                  if (
                    currentChoiceQuestion <
                    choiceStrengthQuestions.length - 1
                  ) {

                    setCurrentChoiceQuestion(
                      currentChoiceQuestion + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentChoiceQuestion(0)

                    setCurrentSection(
                      'choice-pros-cons'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentChoiceQuestion ===
                    choiceStrengthQuestions.length - 1
                    ? 'Continua'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }
  // ==================================================
  // PASSO 4 - VANTAGGI E SVANTAGGI
  // ==================================================

  if (
    currentSection ===
    'choice-pros-cons'
  ) {

    const question =
      choiceProsConsQuestions[
      currentChoiceQuestion
      ]

    if (!question) {
      return null
    }

    const selectedTrackLabel =
      trackNames[selectedTrack]

    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={4}
          />

          <div className="section-header">

            <div className="section-step">
              PASSO 4 DI 4
            </div>

            <div className="section-code">
              SEZIONE 4D
            </div>

            <h1>
              Vantaggi e svantaggi
            </h1>

            <p>
              Immagina ora il tuo futuro
              professionale collegato
              all'indirizzo che hai scelto.
            </p>

          </div>


          <div className="question-progress">

            <div className="progress-label">

              RIFLESSIONE {
                currentChoiceQuestion + 1
              } / {
                choiceProsConsQuestions.length
              }

            </div>

          </div>


          <div className="question-card">

            <div className="choice-track-reminder">

              <span>
                Indirizzo scelto
              </span>

              <strong>
                {selectedTrackLabel}
              </strong>

            </div>


            <h2>
              {question.domanda}
            </h2>


            <textarea
              className="reflection-textarea"
              value={
                choiceAnswers[
                question.id
                ] || ''
              }
              onChange={event =>
                updateChoiceAnswer(
                  question.id,
                  event.target.value
                )
              }
              placeholder="Scrivi qui la tua risposta..."
            />


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {

                  if (
                    currentChoiceQuestion >
                    0
                  ) {

                    setCurrentChoiceQuestion(
                      currentChoiceQuestion - 1
                    )

                  } else {

                    setCurrentChoiceQuestion(
                      choiceStrengthQuestions.length - 1
                    )

                    setCurrentSection(
                      'choice-strengths'
                    )

                  }

                }}
              >
                Indietro
              </button>


              <button
                type="button"
                className="primary-button"
                disabled={
                  !choiceAnswers[
                    question.id
                  ]?.trim()
                }
                onClick={() => {

                  if (
                    currentChoiceQuestion <
                    choiceProsConsQuestions.length - 1
                  ) {

                    setCurrentChoiceQuestion(
                      currentChoiceQuestion + 1
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  } else {

                    setCurrentSection(
                      'final-results'
                    )

                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })

                  }

                }}
              >

                {
                  currentChoiceQuestion ===
                    choiceProsConsQuestions.length - 1
                    ? 'Vedi il riepilogo finale'
                    : 'Avanti'
                }

              </button>

            </div>

          </div>

        </main>

      </div>

    )
  }

  // ==================================================
  // RISULTATO FINALE
  // ==================================================

  if (
    currentSection ===
    'final-results'
  ) {

    function calculateStudyScore(list) {

      return list.reduce(
        (total, question) =>
          total +
          Number(
            studyAnswers[
            question.id
            ] || 0
          ),
        0
      )
    }


    const homeScore =
      calculateStudyScore(
        studyHomeQuestions
      )

    const lessonScore =
      calculateStudyScore(
        studyLessonQuestions
      )

    const oralScore =
      calculateStudyScore(
        studyOralQuestions
      )

    const groupScore =
      calculateStudyScore(
        studyGroupQuestions
      )


    const studyAreas = [
      {
        label: 'Studio a casa',
        score: homeScore
      },
      {
        label: 'Durante le lezioni',
        score: lessonScore
      },
      {
        label: 'Durante le interrogazioni',
        score: oralScore
      },
      {
        label: 'Lavoro di gruppo',
        score: groupScore
      }
    ]


    const topWorkCharacteristics =
      workRanking.slice(0, 2)


    const rankedCompetences =
      workCompetenceQuestions
        .map(question => ({

          id: question.id,

          domanda:
            question.domanda,

          value:
            Number(
              workAnswers[
              question.id
              ] || 0
            )

        }))
        .sort(
          (a, b) =>
            b.value - a.value
        )


    const topCompetences =
      rankedCompetences.slice(0, 5)


    const recommended =
      Array.isArray(
        result?.recommended
      )
        ? result.recommended
        : result?.recommended
          ? [result.recommended]
          : []


    return (

      <div className="app">

        <main className="main-container">

          <BrandHeader />

          <StepsOverview
            activeStep={4}
          />


          <div className="final-result-card">

            <div className="transition-label">
              PERCORSO COMPLETATO
            </div>


            <h1>
              Il tuo profilo orientativo
            </h1>


            <p className="step-result-intro">
              Hai completato tutti e quattro
              i passi del percorso.
              Questo riepilogo raccoglie
              gli elementi principali emersi
              dalle tue risposte.
            </p>


            {/* ======================================
              SCELTA DELLO STUDENTE
             ====================================== */}

            <section className="final-section final-choice-section">

              <div className="final-section-number">
                4
              </div>

              <div className="final-section-content">

                <span className="final-section-label">
                  LA TUA SCELTA
                </span>

                <h2>
                  {trackNames[selectedTrack]}
                </h2>

                <p>
                  Questo è l'indirizzo che,
                  dopo il percorso di riflessione,
                  hai indicato come tua scelta.
                </p>

              </div>

            </section>


            {/* ======================================
              PASSO 1 - INTERESSI
             ====================================== */}

            <section className="final-section">

              <div className="final-section-number">
                1
              </div>

              <div className="final-section-content">

                <span className="final-section-label">
                  INTERESSI
                </span>

                <h2>
                  Le aree più vicine
                  ai tuoi interessi
                </h2>


                {recommended.length > 0 && (

                  <div className="final-highlight">

                    {recommended.map(
                      item => (

                        <div
                          key={
                            item.indirizzo
                          }
                          className="final-highlight-row"
                        >

                          <strong>
                            {
                              trackNames[
                              item.indirizzo
                              ]
                            }
                          </strong>

                          <span>
                            {item.punteggio} punti
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}


                <div className="final-ranking">

                  {result?.ranking?.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={
                          item.indirizzo
                        }
                        className="final-ranking-row"
                      >

                        <span>
                          {index + 1}.
                          {' '}
                          {
                            trackNames[
                            item.indirizzo
                            ]
                          }
                        </span>

                        <strong>
                          {item.punteggio}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </div>

            </section>


            {/* ======================================
              PASSO 2 - LAVORO
             ====================================== */}

            <section className="final-section">

              <div className="final-section-number">
                2
              </div>

              <div className="final-section-content">

                <span className="final-section-label">
                  LAVORO
                </span>

                <h2>
                  Cosa cerchi nel lavoro
                </h2>


                <div className="final-subsection">

                  <h3>
                    Le tue prime due priorità
                  </h3>

                  {topWorkCharacteristics.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={item.id}
                        className="final-priority-row"
                      >

                        <span className="final-priority-number">
                          {index + 1}
                        </span>

                        <span>
                          {item.domanda}
                        </span>

                      </div>

                    )
                  )}

                </div>


                <div className="final-subsection">

                  <h3>
                    Competenze che ritieni
                    più forti
                  </h3>

                  {topCompetences.map(
                    competence => (

                      <div
                        key={
                          competence.id
                        }
                        className="final-competence-row"
                      >

                        <span>
                          {
                            competence.domanda
                          }
                        </span>

                        <strong>
                          {
                            competence.value
                          }/7
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </div>

            </section>


            {/* ======================================
              PASSO 3 - METODO DI STUDIO
             ====================================== */}

            <section className="final-section">

              <div className="final-section-number">
                3
              </div>

              <div className="final-section-content">

                <span className="final-section-label">
                  METODO DI STUDIO
                </span>

                <h2>
                  Il tuo profilo di studio
                </h2>


                <div className="study-results-list">

                  {studyAreas.map(
                    area => {

                      const percentage =
                        Math.round(
                          (
                            area.score /
                            28
                          ) *
                          100
                        )

                      return (

                        <div
                          className="study-result-item"
                          key={area.label}
                        >

                          <div className="study-result-header">

                            <span>
                              {area.label}
                            </span>

                            <strong>
                              {area.score}/28
                            </strong>

                          </div>

                          <div className="study-result-bar">

                            <div
                              className="study-result-bar-fill"
                              style={{
                                width:
                                  `${percentage}%`
                              }}
                            />

                          </div>

                        </div>

                      )

                    }
                  )}

                </div>

              </div>

            </section>


            {/* ======================================
              MOTIVAZIONI FINALI
             ====================================== */}

            <section className="final-section">

              <div className="final-section-number">
                ✓
              </div>

              <div className="final-section-content">

                <span className="final-section-label">
                  LA TUA RIFLESSIONE
                </span>

                <h2>
                  Perché questa scelta?
                </h2>


                {choiceMotivationQuestions.map(
                  question => (

                    <div
                      key={question.id}
                      className="final-reflection"
                    >

                      <strong>
                        {question.domanda}
                      </strong>

                      <p>
                        {
                          choiceAnswers[
                          question.id
                          ]
                        }
                      </p>

                    </div>

                  )
                )}


                <h3 className="final-small-heading">
                  I tuoi punti di forza
                </h3>


                {choiceStrengthQuestions.map(
                  (
                    question,
                    index
                  ) => (

                    <div
                      key={question.id}
                      className="final-strength"
                    >

                      <span>
                        {index + 1}
                      </span>

                      <p>
                        {
                          choiceAnswers[
                          question.id
                          ]
                        }
                      </p>

                    </div>

                  )
                )}


                <div className="final-pros-cons">

                  {choiceProsConsQuestions.map(
                    (
                      question,
                      index
                    ) => (

                      <div
                        key={question.id}
                        className="final-pros-cons-box"
                      >

                        <h3>
                          {
                            index === 0
                              ? 'Vantaggi'
                              : 'Svantaggi'
                          }
                        </h3>

                        <p>
                          {
                            choiceAnswers[
                            question.id
                            ]
                          }
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </section>


            {/* ======================================
              CONCLUSIONE
             ====================================== */}

            <div className="final-note">

              <strong>
                Ricorda:
              </strong>

              il questionario non decide
              quale indirizzo devi scegliere.

              Serve a raccogliere in modo
              strutturato interessi,
              aspettative, competenze
              e riflessioni utili per
              prendere una decisione
              più consapevole.

            </div>


            <div className="navigation-buttons">

              <button
                type="button"
                className="secondary-button"
                onClick={restartQuestionnaire}
              >
                ↻ Ripeti il questionario
              </button>


              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  window.print()
                }
              >
                Stampa / Salva PDF
              </button>

            </div>

          </div>

        </main>

      </div>

    )


  }


  // ==================================================
  // FALLBACK
  // ==================================================

  return null

}


export default App
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
  }

}


// ======================================================
// COMPONENTE PRINCIPALE
// ======================================================

function App() {

  // ==================================================
  // STATO PRINCIPALE
  // ==================================================

  const [page, setPage] =
    useState('home')

  const [questions, setQuestions] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)


  // ==================================================
  // SEZIONE CORRENTE
  // ==================================================

  const [currentSection, setCurrentSection] =
    useState('intro-areas')


  // ==================================================
  // DOMANDE LIKERT
  // ==================================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0)

  const [answers, setAnswers] =
    useState({})


  // ==================================================
  // RANKING AREE PROFESSIONALI
  // ==================================================

  const [ranking, setRanking] =
    useState([])

  const [
    highlightedRankingId,
    setHighlightedRankingId
  ] = useState(null)


  // ==================================================
  // RIFLESSIONI
  // ==================================================

  const [
    reflectionAnswers,
    setReflectionAnswers
  ] = useState({})

  const [
    currentReflection,
    setCurrentReflection
  ] = useState(0)


  // ==================================================
  // RISULTATO
  // ==================================================

  const [result, setResult] =
    useState(null)


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


      const data =
        await response.json()


      setResult(data)

      setPage('results')

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

    }

    catch (error) {

      console.error(error)

      alert(
        'Errore durante il calcolo del risultato.'
      )

    }

  }


  // ==================================================
  // RIPARTI DA CAPO
  // ==================================================

  function restartQuestionnaire() {

    setAnswers({})

    setReflectionAnswers({})

    setCurrentQuestion(0)

    setCurrentReflection(0)

    setRanking(
      [...rankingQuestions]
    )

    setResult(null)

    setCurrentSection(
      'intro-areas'
    )

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
  // PANORAMICA DEI 4 PASSI
  // ==================================================

  function StepsOverview() {

    const steps = [

      {
        number: 1,
        title: 'Interessi',
        active: true
      },

      {
        number: 2,
        title: 'Lavoro',
        active: false
      },

      {
        number: 3,
        title: 'Metodo di studio',
        active: false
      },

      {
        number: 4,
        title: 'Scelta',
        active: false
      }

    ]


    return (

      <div className="steps-overview">

        {steps.map(step => (

          <div
            key={step.number}
            className={
              step.active
                ? 'step-item active'
                : 'step-item'
            }
          >

            <div className="step-number">
              {step.number}
            </div>

            <div className="step-title">
              {step.title}
            </div>

          </div>

        ))}

      </div>

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
                    >

                      <div className="ranking-main">

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


              <div className="likert-scale">

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


  // ==================================================
  // RISULTATI
  // ==================================================

  if (
    page === 'results' &&
    result
  ) {

    const recommended =
      Array.isArray(
        result.recommended
      )
        ? result.recommended
        : result.recommended
          ? [
            result.recommended
          ]
          : []


    return (

      <div className="app">

        <main className="main-container">

          <div className="results-page">

            <div className="results-label">
              PASSO 1 COMPLETATO
            </div>


            <h2 className="results-small-title">
              IL TUO RISULTATO
            </h2>


            {
              recommended.length ===
                1
                ? (

                  <>

                    <h1 className="result-main-title">

                      {
                        trackNames[
                        recommended[
                          0
                        ]
                          .indirizzo
                        ]
                      }

                    </h1>


                    <p className="answer-instruction">

                      Questo è
                      l'indirizzo
                      che, in questa
                      prima parte del
                      percorso,
                      risulta più
                      vicino ai tuoi
                      interessi.

                    </p>

                  </>

                )

                : (

                  <>

                    <h1 className="result-main-title">

                      Profilo
                      orientativo
                      condiviso

                    </h1>


                    <p className="answer-instruction">

                      Le tue risposte
                      mostrano la
                      stessa affinità
                      con più
                      indirizzi.

                    </p>


                    <div className="recommended-tie">

                      {
                        recommended.map(
                          item => (

                            <div
                              key={
                                item.indirizzo
                              }
                              className="recommended-tie-item"
                            >

                              <strong>

                                {
                                  trackNames[
                                  item
                                    .indirizzo
                                  ]
                                }

                              </strong>

                              <span>

                                {
                                  item
                                    .punteggio
                                } punti

                              </span>

                            </div>

                          )
                        )
                      }

                    </div>

                  </>

                )
            }


            <div className="results-ranking">

              {
                result.ranking.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="result-row"
                      key={
                        item.indirizzo
                      }
                    >

                      <span>

                        {
                          index +
                          1
                        }.{' '}

                        {
                          trackNames[
                          item
                            .indirizzo
                          ]
                        }

                      </span>


                      <strong>

                        {
                          item.punteggio
                        } punti

                      </strong>

                    </div>

                  )
                )
              }

            </div>


            <div className="results-note">

              <h3>
                Ricorda
              </h3>

              <p>

                Questo risultato non
                rappresenta una scelta
                definitiva.

                È uno strumento per
                aiutarti a riflettere
                sui tuoi interessi e
                sarà affiancato dagli
                altri passi del
                percorso di
                orientamento.

              </p>

            </div>


            <div className="navigation-buttons">

              <button
                className="secondary-button"
                onClick={() =>
                  setPage(
                    'home'
                  )
                }
              >

                Torna alla home

              </button>


              <button
                className="primary-button"
                onClick={
                  restartQuestionnaire
                }
              >

                Ripeti il Passo 1

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
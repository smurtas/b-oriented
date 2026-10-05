import { useEffect, useState } from 'react'

import './App.css'
import logoBuonarroti from './assets/Buonarroti_Icona.jpg'


function App() {
  const [page, setPage] = useState('home')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)


  /*useEffect(() => {

  fetch('https://script.google.com/a/macros/buonarroti.tn.it/s/AKfycbxNvaq8XME0SWQiF1Ngkesi4V6Z9PZtuQ_6qyIrwW8Ab1nvbLCY3JSqCTORHEN7lhOopQ/exec')
    .then(response => response.json())
    .then(data => {
      setQuestions(data)
    })
    .catch(error => {
      console.error('Errore nel caricamento delle domande:', error)
    })

}, []) */

  useEffect(() => {

    console.log('Sto caricando le domande...')

    /* fetch('https://script.google.com/a/macros/buonarroti.tn.it/s/AKfycbxNvaq8XME0SWQiF1Ngkesi4V6Z9PZtuQ_6qyIrwW8Ab1nvbLCY3JSqCTORHEN7lhOopQ/exec')
     
    .then(response => {
        console.log('Risposta HTTP:', response)
        return response.json()
      })
      .then(data => {
        console.log('JSON ricevuto:', data)
        console.log('Numero domande:', data.length)
  
        setQuestions(data)
      })
      .catch(error => {
        console.error('ERRORE FETCH:', error)
      })*/

    fetch('http://localhost:3000/api/questions')
      .then(response => response.json())
      .then(data => {
        console.log('Domande ricevute:', data)
        setQuestions(data)
      })
      .catch(error => {
        console.error('Errore nel caricamento delle domande:', error)
      })

  }, [])

  if (page === 'results' && result) {

    const names = {
      informatica: 'Informatica e Telecomunicazioni',
      elettronica: 'Elettronica e Automazione',
      meccanica: 'Meccanica, Meccatronica ed Energia',
      chimica: 'Chimica, Materiali e Biotecnologie',
      cat: 'Costruzioni, Ambiente e Territorio'
    }

    return (
      <div className="questionnaire-page">

        <header className="navbar">

          <div className="brand">
            <img
              src={logoBuonarroti}
              alt="ITT Buonarroti logo"
              className="school-logo"
            />

            <span>B_Oriented</span>
          </div>

          <div className="school">
            ITT Buonarroti
          </div>

        </header>


        <main className="questionnaire-container">

          <div className="question-card">

            <span className="question-category">
              IL TUO RISULTATO
            </span>

            <h1>
              {names[result.recommended.indirizzo]}
            </h1>

            <p className="answer-instruction">
              Questo è l'indirizzo che risulta più vicino
              alle tue risposte.
            </p>


            <div className="results-ranking">

              {result.ranking.map((item, index) => (

                <div
                  className="result-row"
                  key={item.indirizzo}
                >

                  <span>
                    {index + 1}. {names[item.indirizzo]}
                  </span>

                  <strong>
                    {item.punteggio} punti
                  </strong>

                </div>

              ))}

            </div>
            <div className="results-details">

              <h2>Dettaglio delle risposte</h2>

              <p className="details-intro">
                Di seguito trovi le risposte fornite durante il questionario
                e l'area di studio maggiormente associata a ciascuna domanda.
              </p>

              {result.details?.map((detail, index) => {

                const answerLabels = {
                  1: 'Per niente',
                  2: 'Poco',
                  3: 'Abbastanza',
                  4: 'Molto',
                  5: 'Moltissimo'
                }

                return (
                  <div
                    className="detail-row"
                    key={detail.id}
                  >

                    <div className="detail-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="detail-content">

                      <p className="detail-question">
                        {detail.domanda}
                      </p>

                      <div className="detail-info">

                        <span>
                          Risposta:
                          <strong>
                            {' '}
                            {answerLabels[detail.risposta]} ({detail.risposta}/5)
                          </strong>
                        </span>

                        <span>
                          Area associata:
                          <strong>
                            {' '}
                            {names[detail.mainArea]}
                          </strong>
                        </span>

                      </div>

                    </div>

                  </div>
                )

              })}

            </div>
            <div className="results-actions">

              <button
                className="repeat-button"
                onClick={() => {
                  setAnswers({})
                  setCurrentQuestion(0)
                  setResult(null)
                  setPage('questionnaire')
                }}
              >
                ↻ Ripeti il test
              </button>

              <button
                className="pdf-button"
                onClick={() => window.print()}
              >
                Scarica PDF
              </button>

            </div>

          </div>

        </main>

      </div>
    )
  }

  if (page === 'questionnaire') {
    const question = questions[currentQuestion]
    return (
      <div className="questionnaire-page">

        <header className="navbar">

          <div className="brand">

            <img
              src={logoBuonarroti}
              alt="ITT Buonarroti"
              className="school-logo"
            />

            <div>
              <strong>ITT M. Buonarroti</strong>
              <div style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#667085',
                marginTop: '3px'
              }}>
                B-Oriented · Orientamento
              </div>
            </div>

          </div>

          <div className="school">
            Trento
          </div>

        </header>

        <main className="questionnaire-container">

          <button
            className="back-button"
            onClick={() => setPage('home')}
          >
            ← Torna alla home
          </button>

          <div className="question-progress">

            <div className="progress-info">
              <span>
                DOMANDA {currentQuestion + 1} DI {questions.length}
              </span>

              <span>
                {questions.length > 0
                  ? Math.round(
                    ((currentQuestion + 1) / questions.length) * 100
                  )
                  : 0}%
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-value"
                style={{
                  width: questions.length > 0
                    ? `${((currentQuestion + 1) / questions.length) * 100}%`
                    : '0%'
                }}
              />
            </div>

          </div>


          {question ? (
            <div className="question-card">

              {/* CATEGORIA */}
              <span className="question-category">
                {question.categoria}
              </span>

              {/* DOMANDA */}
              <h1>
                {question.domanda}
              </h1>

              <p className="answer-instruction">
                Quanto ti riconosci in questa affermazione?
              </p>


              {/* RISPOSTE */}
              <div className="answer-scale">

                {[
                  { value: 1, label: 'Per niente' },
                  { value: 2, label: 'Poco' },
                  { value: 3, label: 'Abbastanza' },
                  { value: 4, label: 'Molto' },
                  { value: 5, label: 'Moltissimo' }
                ].map(answer => (

                  <button
                    key={answer.value}
                    className={`answer-option ${answers[question.id] === answer.value
                      ? 'selected'
                      : ''
                      }`}
                    onClick={() =>
                      setAnswers({
                        ...answers,
                        [question.id]: answer.value
                      })
                    }
                  >
                    <strong>{answer.value}</strong>
                    <span>{answer.label}</span>
                  </button>

                ))}

              </div>


              <div className="question-actions">

                {currentQuestion > 0 && (
                  <button
                    className="previous-button"
                    onClick={() =>
                      setCurrentQuestion(currentQuestion - 1)
                    }
                  >
                    ← Indietro
                  </button>
                )}

                <button
                  className="next-button"
                  disabled={!answers[question.id]}
                  onClick={() => {

                    // Se NON siamo all'ultima domanda,
                    // passa alla domanda successiva
                    if (currentQuestion < questions.length - 1) {

                      setCurrentQuestion(currentQuestion + 1)

                    } else {

                      // Siamo all'ultima domanda:
                      // inviamo tutte le risposte al backend
                      fetch('http://localhost:3000/api/results', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          answers: answers
                        })
                      })
                        .then(async response => {

                          console.log('STATUS:', response.status)


                          const data = await response.json()

                          console.log('RISPOSTA SERVER:', data)

                          if (!response.ok) {
                            throw new Error(data.error || 'Errore del server')
                          }

                          return data
                        })
                        .then(data => {

                          console.log('RISULTATO VALIDO:', data)

                          setResult(data)
                          setPage('results')

                        })
                        .catch(error => {

                          console.error('ERRORE RISULTATI:', error)

                        })

                    }

                  }}
                >
                  {currentQuestion === questions.length - 1
                    ? 'Termina'
                    : 'Avanti →'}
                </button>

              </div>

            </div>

          ) : (

            <p>Caricamento delle domande...</p>

          )}



        </main>

      </div>
    )
  }
  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <img src={logoBuonarroti} alt="ITT Buonarroti logo" className="school-logo" />

          <span>B_Oriented</span>
        </div>

        <div className="school">
          ITT Buonarroti
        </div>
      </header>

      {/* HERO */}
      <main className="hero">

        <div className="hero-content">
          <span className="eyebrow">
            ORIENTAMENTO
          </span>

          <h1>
            Trova il percorso
            <br />
            <span>più adatto a te.</span>
          </h1>

          <p className="hero-description">
            Rispondi ad alcune domande sui tuoi interessi,
            sulle tue attitudini e su ciò che ti piace fare.
            B_Oriented ti aiuterà a scoprire gli indirizzi
            del Buonarroti più vicini al tuo profilo.
          </p>

          <button className="start-button" onClick={() => setPage('questionnaire')}>
            Inizia il questionario
            <span>→</span>
          </button>

          <p className="time">
            Circa 10 minuti · Nessuna risposta giusta o sbagliata
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="orientation-card">

          <p className="card-label">
            I TUOI POSSIBILI PERCORSI
          </p>

          <div className="path">
            <span>01</span>
            <strong>Informatica e Telecomunicazioni</strong>
          </div>

          <div className="path">
            <span>02</span>
            <strong>Elettronica e Automazione</strong>
          </div>

          <div className="path">
            <span>03</span>
            <strong>Meccanica, Meccatronica ed Energia</strong>
          </div>

          <div className="path">
            <span>04</span>
            <strong>Chimica, Materiali e Biotecnologie</strong>
          </div>

          <div className="path">
            <span>05</span>
            <strong>Costruzioni, Ambiente e Territorio</strong>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer>
        B_Oriented · ITT Buonarroti Trento
      </footer>

    </div>
  )
}

export default App
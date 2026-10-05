import { useEffect, useState } from 'react'

import './App.css'
import logoBuonarroti from './assets/Buonarroti_Icona.jpg'


function App() {
  const [page, setPage] = useState('home')
  const [questions, setQuestions] = useState([])

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

  fetch('https://script.google.com/a/macros/buonarroti.tn.it/s/AKfycbxNvaq8XME0SWQiF1Ngkesi4V6Z9PZtuQ_6qyIrwW8Ab1nvbLCY3JSqCTORHEN7lhOopQ/exec')
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
    })

}, [])

if (page === 'questionnaire') {
  return (
    <div className="questionnaire">

      <h1>Questionario</h1>

      <p>
        Domande caricate: {questions.length}
      </p>

      {questions.map(question => (
        <div key={question.id}>
          <strong>{question.id}</strong>
          <p>{question.domanda}</p>
        </div>
      ))}

      <button onClick={() => setPage('home')}>
        ← Torna alla home
      </button>

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

          <button className="start-button" onClick={()=> setPage('questionnaire')}>
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
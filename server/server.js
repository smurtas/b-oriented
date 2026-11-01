const express = require('express')
const cors = require('cors')
const { google } = require('googleapis')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// ======================================================
// GOOGLE SHEETS
// ======================================================

// Credenziali del Service Account
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
})

// ID del Google Sheet B_Oriented_Data
const SPREADSHEET_ID = '1-QFNYsqm4kfoVucPQE_p--K8ftcqBxxDQeWBBOSIIlo'


// ======================================================
// TEST SERVER
// ======================================================

app.get('/api/test', (req, res) => {

    res.json({
        message: 'B_Oriented API funziona!'
    })

})


// ======================================================
// GET DOMANDE
// ======================================================

app.get('/api/questions', async (req, res) => {

    try {

        const sheets = google.sheets({
            version: 'v4',
            auth
        })

        // Nuova struttura del foglio:
        //
        // A  id
        // B  step
        // C  section
        // D  type
        // E  domanda
        // F  min
        // G  max
        // H  informatica
        // I  elettronica
        // J  meccanica
        // K  chimica
        // L  cat
        // M  ordine
        // N  attiva

        const response =
            await sheets.spreadsheets.values.get({

                spreadsheetId: SPREADSHEET_ID,

                range: 'Domande!A2:N'

            })


        const rows =
            response.data.values || []


        const questions = rows

            // Prendiamo solamente le domande attive
            .filter(row => {

                const active =
                    String(row[13] || '')
                        .trim()
                        .toUpperCase()

                // Google Sheets può restituire TRUE
                // oppure VERO a seconda della lingua
                return (
                    active === 'TRUE' ||
                    active === 'VERO'
                )

            })

            // Convertiamo ogni riga in un oggetto JS
            .map(row => ({

                id: row[0],

                step:
                    Number(row[1]),

                section:
                    row[2],

                type:
                    row[3],

                domanda:
                    row[4],

                min:
                    row[5]
                        ? Number(row[5])
                        : null,

                max:
                    row[6]
                        ? Number(row[6])
                        : null,

                weights: {

                    informatica:
                        Number(row[7] || 0),

                    elettronica:
                        Number(row[8] || 0),

                    meccanica:
                        Number(row[9] || 0),

                    chimica:
                        Number(row[10] || 0),

                    cat:
                        Number(row[11] || 0)

                },

                ordine:
                    Number(row[12] || 0)

            }))


        // Ordiniamo le domande
        questions.sort(
            (a, b) =>
                a.ordine - b.ordine
        )


        res.json(questions)

    }

    catch (error) {

        console.error(
            'Errore Google Sheets:',
            error
        )

        res.status(500).json({
            error:
                'Impossibile leggere le domande'
        })

    }

})


// ======================================================
// CALCOLO RISULTATI
// ======================================================

app.post('/api/results', async (req, res) => {

    try {

        // ==================================================
        // DATI RICEVUTI DAL FRONTEND
        // ==================================================

        // Risposte alle domande Likert
        //
        // esempio:
        //
        // {
        //   Q001: 5,
        //   Q002: 3,
        //   ...
        // }

        const answers =
            req.body.answers || {}


        // Ranking delle aree professionali
        //
        // esempio:
        //
        // [
        //   { id: "R003", posizione: 1 },
        //   { id: "R001", posizione: 2 }
        // ]

        const rankingAnswers =
            req.body.ranking || []


        // Risposte testuali
        //
        // esempio:
        //
        // {
        //   T001: "...",
        //   T002: "..."
        // }

        const reflections =
            req.body.reflections || {}


        // ==================================================
        // LETTURA GOOGLE SHEET
        // ==================================================

        const sheets = google.sheets({
            version: 'v4',
            auth
        })


        const response =
            await sheets.spreadsheets.values.get({

                spreadsheetId:
                    SPREADSHEET_ID,

                range:
                    'Domande!A2:N'

            })


        const rows =
            response.data.values || []


        // ==================================================
        // PUNTEGGI INIZIALI
        // ==================================================

        const scores = {

            informatica: 0,

            elettronica: 0,

            meccanica: 0,

            chimica: 0,

            cat: 0

        }


        // Qui salviamo il dettaglio
        // del calcolo di ogni domanda
        const details = []


        // ==================================================
        // CALCOLO
        // ==================================================

        rows.forEach(row => {

            const id =
                row[0]


            const section =
                String(row[2] || '')
                    .trim()


            const type =
                String(row[3] || '')
                    .trim()


            const domanda =
                row[4]


            const active =
                String(row[13] || '')
                    .trim()
                    .toUpperCase()


            // Ignoriamo righe non attive
            if (
                active !== 'TRUE' &&
                active !== 'VERO'
            ) {
                return
            }


            // Per il punteggio consideriamo
            // SOLO le domande Q001-Q030
            // della sezione interessi_indirizzi

            if (!id.startsWith('Q')) {
                return
            }


            if (type !== 'likert') {
                return
            }


            if (
                section !==
                'interessi_indirizzi'
            ) {
                return
            }


            // Risposta dello studente
            const answer =
                Number(answers[id])


            // Se la risposta non esiste
            // ignoriamo la domanda
            if (
                Number.isNaN(answer) ||
                answer <= 0
            ) {
                return
            }


            // ==================================================
            // PESI
            // ==================================================

            const weights = {

                informatica:
                    Number(row[7] || 0),

                elettronica:
                    Number(row[8] || 0),

                meccanica:
                    Number(row[9] || 0),

                chimica:
                    Number(row[10] || 0),

                cat:
                    Number(row[11] || 0)

            }


            // ==================================================
            // CONTRIBUTI DELLA DOMANDA
            // ==================================================

            const contributions = {

                informatica:
                    answer *
                    weights.informatica,

                elettronica:
                    answer *
                    weights.elettronica,

                meccanica:
                    answer *
                    weights.meccanica,

                chimica:
                    answer *
                    weights.chimica,

                cat:
                    answer *
                    weights.cat

            }


            // ==================================================
            // AGGIUNTA AI PUNTEGGI TOTALI
            // ==================================================

            scores.informatica +=
                contributions.informatica

            scores.elettronica +=
                contributions.elettronica

            scores.meccanica +=
                contributions.meccanica

            scores.chimica +=
                contributions.chimica

            scores.cat +=
                contributions.cat


            // ==================================================
            // AREA PRINCIPALE DELLA DOMANDA
            // ==================================================

            const mainArea =
                Object.entries(contributions)

                    .sort(
                        (a, b) =>
                            b[1] - a[1]
                    )[0][0]


            // ==================================================
            // DETTAGLIO
            // ==================================================

            details.push({

                id,

                domanda,

                risposta: answer,

                mainArea,

                contributions

            })


            // DEBUG
            console.log(
                id,
                'risposta:',
                answer,
                'pesi:',
                weights
            )

        })


        // ==================================================
        // CLASSIFICA FINALE
        // ==================================================

        const ranking =
            Object.entries(scores)

                .map(
                    ([indirizzo, punteggio]) => ({

                        indirizzo,

                        punteggio

                    })
                )

                .sort(
                    (a, b) =>
                        b.punteggio -
                        a.punteggio
                )


        // ==================================================
        // GESTIONE PARIMERITO
        // ==================================================

        const maxScore =
            ranking[0].punteggio


        // recommended è SEMPRE un array
        //
        // Se c'è un vincitore:
        // [ informatica ]
        //
        // Se c'è pareggio:
        // [ informatica, elettronica ]

        const recommended =
            ranking.filter(
                item =>
                    item.punteggio ===
                    maxScore
            )


        // ==================================================
        // RISPOSTA AL FRONTEND
        // ==================================================

        res.json({

            scores,

            ranking,

            recommended,

            details,

            professionalAreasRanking:
                rankingAnswers,

            reflections

        })

    }

    catch (error) {

        console.error(
            'Errore calcolo risultati:',
            error
        )

        res.status(500).json({

            error:
                'Impossibile calcolare il risultato'

        })

    }

})


// ======================================================
// AVVIO SERVER
// ======================================================

const server =
    app.listen(
        PORT,
        '127.0.0.1',
        () => {

            console.log(
                `B_Oriented API attiva su http://localhost:${PORT}`
            )

        }
    )


server.on(
    'error',
    error => {

        console.error(
            'Errore server:',
            error
        )

    }
)


server.on(
    'close',
    () => {

        console.log(
            'Il server HTTP è stato chiuso'
        )

    }
)
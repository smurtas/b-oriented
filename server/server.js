const express = require('express')
const cors = require('cors')
const { google } = require('googleapis')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Credenziali del Service Account
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
})

// ID del Google Sheet B_Oriented_Data
const SPREADSHEET_ID = '1-QFNYsqm4kfoVucPQE_p--K8ftcqBxxDQeWBBOSIIlo'

// Test del server
app.get('/api/test', (req, res) => {
    res.json({
        message: 'B_Oriented API funziona!'
    })
})

// Restituisce le domande presenti nel Google Sheet
app.get('/api/questions', async (req, res) => {
    try {
        const sheets = google.sheets({
            version: 'v4',
            auth
        })

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Domande!A2:I'
        })

        const rows = response.data.values || []

        const questions = rows
            .filter(row => row[8] === 'TRUE')
            .map(row => ({
                id: row[0],
                domanda: row[1],
                categoria: row[2],
                informatica: Number(row[3]),
                elettronica: Number(row[4]),
                meccanica: Number(row[5]),
                chimica: Number(row[6]),
                cat: Number(row[7])
            }))

        res.json(questions)

    } catch (error) {
        console.error('Errore Google Sheets:', error)
        res.status(500).json({
            error: 'Impossibile leggere le domande'
        })
    }
})
// Calcola il risultato del questionario
app.post('/api/results', async (req, res) => {

    try {

        // Risposte ricevute da React
        // Esempio: { Q001: 4, Q002: 2, Q003: 5 }
        const answers = req.body.answers

        if (!answers) {
            return res.status(400).json({
                error: 'Risposte mancanti'
            })
        }

        const sheets = google.sheets({
            version: 'v4',
            auth
        })

        // Leggiamo nuovamente domande e pesi dal Google Sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Domande!A2:I'
        })

        const rows = response.data.values || []

        // Punteggi iniziali
        const scores = {
            informatica: 0,
            elettronica: 0,
            meccanica: 0,
            chimica: 0,
            cat: 0
        }

        // Calcolo dei punteggi
        rows.forEach(row => {

            const id = row[0]
            const active = row[8] === 'TRUE'

            // Ignoriamo domande non attive
            if (!active) return

            const answer = Number(answers[id])

            // Se non esiste una risposta, ignoriamo la domanda
            if (!answer) return

            scores.informatica += answer * Number(row[3] || 0)
            scores.elettronica += answer * Number(row[4] || 0)
            scores.meccanica += answer * Number(row[5] || 0)
            scores.chimica += answer * Number(row[6] || 0)
            scores.cat += answer * Number(row[7] || 0)

        })
        const details = rows
            .filter(row => row[8] === 'TRUE')
            .map(row => {

                const id = row[0]
                const answer = Number(answers[id])

                const contributions = {
                    informatica: answer * Number(row[3] || 0),
                    elettronica: answer * Number(row[4] || 0),
                    meccanica: answer * Number(row[5] || 0),
                    chimica: answer * Number(row[6] || 0),
                    cat: answer * Number(row[7] || 0)
                }

                const mainArea = Object.entries(contributions)
                    .sort((a, b) => b[1] - a[1])[0][0]

                return {
                    id: id,
                    domanda: row[1],
                    categoria: row[2],
                    risposta: answer,
                    mainArea: mainArea,
                    contributions: contributions
                }

            })

        // Trasformiamo l'oggetto in array per poterlo ordinare
        const ranking = Object.entries(scores)
            .map(([indirizzo, punteggio]) => ({
                indirizzo,
                punteggio
            }))
            .sort((a, b) => b.punteggio - a.punteggio)

        res.json({
            scores,
            ranking,
            recommended: ranking[0],
            details
        })

    } catch (error) {

        console.error('Errore calcolo risultati:', error)

        res.status(500).json({
            error: 'Impossibile calcolare il risultato'
        })

    }

})

app.listen(PORT, () => {
    console.log(`B_Oriented API attiva su http://localhost:${PORT}`)
})  
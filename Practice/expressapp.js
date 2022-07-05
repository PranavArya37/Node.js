const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/about', (req, res) => {
    res.send('This is an about page!')
  })

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
const path = require('path')
const express = require('express')

const getWeather = require('./getWeatherApi.js')

const app = express()
app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.get('/getTemperature', (req, res) => {
  getWeather(res)
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.get('/*', (req, res) => {
  res.redirect('/')
})

module.exports = app

const axios = require('axios')
const client = require('./redisClient.js')
const TOMORROWIOTTL = process.env.TOMORROWIOTTL || 60
const OPENWEATHERMAPTTL = process.env.OPENWEATHERMAPTTL || 600
const TOMORROWIOAPIKEY = process.env.TOMORROWIOAPIKEY
const OPENWEATHERMAPAPIKEY = process.env.OPENWEATHERMAPAPIKEY

if (!TOMORROWIOAPIKEY || !OPENWEATHERMAPAPIKEY) throw new Error('some api keys has not been provided')

function fromKelvinToCelsius(temp) {
  return temp - 273.15
}

const apis = [                                  /*       Moscow coordinates       */
  `https://api.tomorrow.io/v4/timelines?location=55.75229171943665,37.61562069597532&fields=temperature&timesteps=1h&units=metric&apikey=${TOMORROWIOAPIKEY}`,
  `https://api.openweathermap.org/data/2.5/weather?q=Moscow,ru&APPID=${OPENWEATHERMAPAPIKEY}`
]

const tomorrowIoMethod = res => {
  const city = '55.75229171943665,37.61562069597532'

  client.get(city, (err, value) => {
    if (err) return res.sendStatus(500)
    if (value) return res.json({temperature: value, source: 'tomorrow.io'})

    axios.get(apis[0])
      .then(response => {
        const temperature = Math.round(response.data.data.timelines[0].intervals[0].values.temperature)
        res.json({temperature, source: 'tomorrow.io'})
        client.set(city, temperature, 'EX', TOMORROWIOTTL)
      })
      .catch(err => res.sendStatus(500))
  })
}

const openWeatherMapMethod = res => {
  const city = 'Moscow'

  client.get(city, (err, value) => {
    if (err) return res.sendStatus(500)
    if (value) return res.json({temperature: value, source: 'openweathermap'})

    axios.get(apis[1])
      .then(response => {
        const temperature = Math.round(fromKelvinToCelsius(response.data.main.temp))
        res.json({temperature, source: 'openweathermap'})
        client.set(city, temperature, 'EX', OPENWEATHERMAPTTL)
      })
      .catch(err => res.sendStatus(500))
  })
}

const apiMethods = [tomorrowIoMethod, openWeatherMapMethod]

const apisAmount = apiMethods.length
let currentApi = 0

function setNextApi() {
  if (currentApi + 1 < apisAmount) {
    currentApi++
  } else {
    currentApi = 0
  }
}

function getWeather(res) {
  apiMethods[currentApi](res)
  setNextApi()
}

module.exports = getWeather

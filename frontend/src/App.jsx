import './App.css'
import axios from 'axios'
import { useState } from 'react'
import WeatherCard from './weatherCard.jsx'

function App() {
  const [weather, setWeather] = useState(null)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function getWeather() {
    setIsLoading(true)
    axios.get('/getTemperature')
      .then(res => {
        setWeather({temperature: res.data.temperature, source: res.data.source})
        setIsLoading(false)
      })
      .catch(err => {
        setIsError(true)
        setIsLoading(false)
      })
  }

  return (
    <div>
      <header>Weather web application</header>
      <div className='app' >
        <button disabled={isLoading} className='request-button' onClick={getWeather} >get weather</button>
        <WeatherCard isError={isError} weather={weather} />
      </div>
    </div>
  )
}

export default App;

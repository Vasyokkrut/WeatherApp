function getTime() {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return hours + ':' + minutes
}

function WeatherCard({isError, weather}) {
  const currentTime = getTime()

  if (isError) return <div>sorry, we can not load the weather for you now</div>

  if (!weather) {
    return <div>Press button above to find out what is the weather today</div>
  }

  return (
    <div className='info' >
      <div>
        <div>Temperature: {weather.temperature}</div>
        <div>
          <div>Moscow</div>
          <div>{currentTime}</div>
        </div>
      </div>
      <hr />
      <div>
        powered by: {weather.source}
      </div>
    </div>
  )
}

export default WeatherCard

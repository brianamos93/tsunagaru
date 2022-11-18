import { useState, useEffect } from 'react'
import loginService from './services/login'

import Beer from './components/Beer'
import Notification from './components/Notification'
import Footer from './components/Footer'
import beerService from './services/beers'

const App = () => {
  const [beers, setBeers] = useState([])
  const [newBeer, setNewBeer] = useState('')
  const [newBrewery, setNewBrewery] = useState('')
  const [newAbv, setNewAbv] = useState('')
  const [newIbu, setNewIbu] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newStyle, setNewStyle] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    beerService
      .getAll()
      .then(initialBeers => {
        setBeers(initialBeers)
      })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {      
      const user = await loginService.login({        
        username, password,      
      })      
      setUser(user)      
      setUsername('')      
      setPassword('')    
    } catch (exception) {      
      setErrorMessage('Wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)    
    }  
  }

  const addBeer = (event) => {
    event.preventDefault()
    const beerObject = {
      name: newBeer,
      brewery: newBrewery,
      style: newStyle,
      abv: newAbv,
      ibu: newIbu,
      color: newColor,
      producedNow: Math.random() > 0.5,
      id: beers.length + 1,
    }

    beerService
      .create(beerObject)
      .then(returnedBeer => {
        setBeers(beers.concat(returnedBeer))
        setNewBeer('')
        setNewBrewery('')
        setNewAbv('')
        setNewIbu('')
        setNewColor('')
      })
  }

  const handleBeerChange = (event) => {
    setNewBeer(event.target.value)
    setNewBrewery(event.target.value)
    setNewStyle(event.target.value)
    setNewAbv(event.target.value)
    setNewIbu(event.target.value)
    setNewColor(event.target.value)
  }

  const toggleImportanceOf = id => {
    const beer = beers.find(n => n.id === id)
    const changedBeer = { ...beer, producedNow: !beer.producedNow }
  
    beerService
      .update(id, changedBeer)
      .then(returnedBeer => {
        setBeers(beers.map(beer => beer.id !== id ? beer : returnedBeer))
      })
      .catch(error => {
        setErrorMessage(
          `Beer '${beer.name}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBeers(beers.filter(n => n.id !== id))
      })
  }

  const beersToShow = showAll
    ? beers
    : beers.filter(beer => beer.producedNow)

  return (
    <div>
      <h1>Beers</h1>
      <Notification message={errorMessage} />

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>   
      <ul>
        {beersToShow.map(beer => 
          <Beer
            key={beer.id}
            beer={beer}
            toggleImportance={() => toggleImportanceOf(beer.id)}
          />
        )}
      </ul>
      <form onSubmit={addBeer}>
        <input
          value={newBeer}
          onChange={handleBeerChange}
        />
        <input
          value={newBrewery}
          onChange={handleBeerChange}
        />
        <input
          value={newStyle}
          onChange={handleBeerChange}
        />
        <input
          value={newAbv}
          onChange={handleBeerChange}
        />
        <input
        value={newIbu}
        onChange={handleBeerChange}
        />
        <input
          value={newColor}
          onChange={handleBeerChange}
        />
        <input
          value={newProducedNow}
          onChange={handleBeerChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
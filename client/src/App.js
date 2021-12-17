import React, { useState } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

function App() {
  const [input, setInput] = useState("")
  const [imageUrl, setImageUrl] = useState('')
  const [box, setBox] = useState({})
  const [route, setRoute] = useState('signin')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  })

  const loadUser = data => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
    setImageUrl('')
  }

  const calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = box => {
    setBox(box)
  }

  const onInputChange = e => {
    e.preventDefault()
    setInput(e.target.value)
  }

  const onButtonSubmit = () => {
    setImageUrl(input)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Key ${process.env.REACT_APP_CLARIFAI_API_KEY}`
      },
      body: JSON.stringify({
        "user_app_id": {
          "user_id": `${process.env.REACT_APP_CLARIFAI_USER_ID}`,
          "app_id": `${process.env.REACT_APP_CLARIFAI_APP_ID}`
        },
        "inputs": [
          {
            "data": {
              "image": {
                "url": input
              }
            }
          }
        ]
      })
    }

    fetch(`https://api.clarifai.com/v2/models/a403429f2ddf4b49b307e318f00e528b/outputs`, requestOptions)
    .then(response => response.text())
    .then(result => {
      if (result) {
        fetch('https://image-recognition-app-server.herokuapp.com/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id
          })
        })
        .then(response => response.json())
          .then(count => {
            setUser({ ...user, entries: count })
          })
      }
      displayFaceBox(calculateFaceLocation(JSON.parse(result)))
    })
    .catch(error => console.log('error', error));
  }

  const onRouteChange = route => {
    if (route === 'signout') {
      setIsSignedIn(false)
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route)
  }

  return (
    <div className="App">
      <Particles className='particles'
        params={particlesOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {
        route === 'home' ?
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div> : (route === 'signin' ? <Signin loadUser={loadUser} onRouteChange={onRouteChange}/> : <Register loadUser={loadUser} onRouteChange={onRouteChange}/>)
      }
    </div>
  );
}

export default App;

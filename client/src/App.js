import React, { useState } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

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
    fetch(`https://api.clarifai.com/v2/models/${process.env.REACT_APP_CLARIFAI_MODEL_ID}/outputs`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(JSON.parse(result, null, 2).outputs[0].data))
    .catch(error => console.log('error', error));
  //   app.models
  //   .predict(
  // // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
  // // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
  // // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
  // // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
  // // is to use a different version of their model that works like the ones found here: https://github.com/Clarifai/clarifai-javascript/blob/master/src/index.js
  // // so you would change from:
  // // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  // // to:
  // // .predict('53e1df302c079b3db8a0a36033ed2d15', this.state.input)
  //     Clarifai.FACE_DETECT_MODEL,
  //     this.state.input)
  //   .then(response => {
  //     console.log('hi', response)
  //     if (response) {
  //       fetch('http://localhost:3000/image', {
  //         method: 'put',
  //         headers: {'Content-Type': 'application/json'},
  //         body: JSON.stringify({
  //           id: this.state.user.id
  //         })
  //       })
  //         .then(response => response.json())
  //         .then(count => {
  //           this.setState(Object.assign(this.state.user, { entries: count}))
  //         })

  //     }
  //   })
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
      <Navigation />
      <Logo />
      <Rank name={user.name} entries={user.entries} />
      <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
      {/* <FaceRecogniton /> */}
    </div>
  );
}

export default App;

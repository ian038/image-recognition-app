import React, { useState } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

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
    fetch(`https://api.clarifai.com/v2/models/a403429f2ddf4b49b307e318f00e528b/outputs`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(JSON.parse(result).outputs[0].data))
    .catch(error => console.log('error', error));
    // Use below url as sample test
    // https://samples.clarifai.com/metro-north.jpg
    // https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528
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
      <FaceRecognition box={box} imageUrl={imageUrl} />
    </div>
  );
}

export default App;

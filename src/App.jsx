import './App.css';
import {useState, useEffect} from 'react';
import {Button} from '@material-ui/core';
import Amplify,{Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import SongList from './Components/SongList';
import SignIn from  './Components/SignIn';
import ReactPlayer from 'react-player';
import {Switch, Route,Link} from  'react-router-dom';


Amplify.configure(awsconfig); 
function App() {
  const [audioUrl, setAudioUrl] = useState('');
  const [playing,setPlaying] = useState(false);
  const [loggedIn,setLoggedIn] = useState(false);

  useEffect(()=>{
    Auth.currentAuthenticatedUser().then(()=>{
      setLoggedIn(true);
    }).catch(()=>{
      setLoggedIn(false);
    })
  },[])

  const signOut = async () => {
    try{
      await Auth.signOut();
      setLoggedIn(false);
    }catch(error){
      console.log('sign out error: ', error);
    }
  }

  const signIn = () => {
    setLoggedIn(true);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Music Uploader</h2>
        { 
          loggedIn?<Button variant='contained' color="primary" onClick={signOut}>Sign Out</Button>
          : <Link to="/signIn">
            <Button variant="contained" color="primary">Sign In</Button>
          </Link>
        }
      </header>
      <Switch>
        <Route exact path="/">
          <SongList setAudio={setAudioUrl}/>
        </Route>
        <Route exact path="signIn">
          <SignIn onSignin={signIn}/>
        </Route>
      </Switch>
      <div className="playerContainer">
        <div className="myAudioPlayer">
          <ReactPlayer 
            url={audioUrl}
              controls
              playing={playing}
              height="50px"
              onPause={()=>{setPlaying(prevState => !prevState)}}
          />
        </div>
      </div>

    </div>
  );
}

export default App;


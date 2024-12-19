import Upload from './Upload'
import { useEffect, useNavigate, useState } from 'react';
import PoseView from './PoseView';
import Landing from './Landing';
import Playground from './Playground';
import logo from './assets/logo.png';

import './styles/index.css';


function App() {
  const [processID, setProcessID] = useState(null);
  const [difference, setDifference] = useState(0);
  const [fetchAble, setFetchAble] = useState(false);

  const [frontVideo, setFrontVideo] = useState(0);
  const [backVideo, setBackVideo] = useState(0);

  const [playground, setPlayground] = useState(false);

  const handleClick = () => {
    setPlayground(true);
  }

  const handleHome = () => {
    // Reset the states to go back to the initial "home" screen
    setPlayground(false);
    setFetchAble(false);
    setProcessID(null);
    setDifference(0);
    setFrontVideo(0);
    setBackVideo(0);
  };

  return (
    <>
      <div className="heading" >
        <div className='logo-container' onClick={handleHome}>
            <img className="logo" src={logo} />
            <p className='title'>Rory Rater</p>
        </div>
        <div className='header-buttons'>
          <button className="play-button" onClick={handleClick} >Playground</button>
          <button className="upload-button" onClick={handleHome} >Home</button>
        </div>
      </div>
      {!playground && (
        !fetchAble ? (
          <>
            <Landing setPlayground={setPlayground} />
            <Upload 
              setProcessID={setProcessID} 
              setDifference={setDifference}
              setBackVideo={setBackVideo}
              setFrontVideo={setFrontVideo}
              setFetchAble={setFetchAble}
            />
          </>
        ) : (
          <PoseView 
            frontVideo={frontVideo} 
            backVideo={backVideo}
            processID={processID}
            difference={difference}
            fetchAble={fetchAble}
            setFetchAble={setFetchAble}
          />
        )
      )}
      {playground && (
        <Playground setPlayground={setPlayground}/>
      )}
    </>
  );
}

export default App

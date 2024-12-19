import { useEffect, useState, useRef } from 'react'
import './styles/VidSlider.css'

function VidSlider({ videoFile }) {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);
  
  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    console.log(time)
    setCurrentTime(time);
    videoRef.current.currentTime = time;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };


  return (
    <div className='slider-view'>
      <p>Slide to the frame where you make contact:</p>
      <video 
        ref={videoRef} 
        src={videoFile} 
        width="600" 
        onTimeUpdate={handleTimeUpdate} 
        style={{ display: 'block', marginBottom: '10px' }} 
      />
      <input 
        type="range" 
        min="0" 
        max={duration} 
        step="0.01"
        value={currentTime} 
        onChange={handleSliderChange} 
      />
    </div>
  );
}

export default VidSlider;

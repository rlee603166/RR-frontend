import { useState, useEffect, useRef } from "react";
import './styles/GetVid.css';
import uploadImg from './assets/upload.png';

function GetVid ({ swingType, setVid, video, gifUrl, setGifUrl, vidURL, setVidURL, currentTime, setCurrentTime, sliderBool, setSliderBool, duration, setDuration }) {
    const videoRef = useRef(null);
    
    const handleFileChange = (event) => {
        const video = event.target.files[0];
        setVid(video);
        if (video && (video.type === 'video/mp4')) {
            try {
                const url = URL.createObjectURL(video);
                setSliderBool(true);
                setVidURL(url);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log('File type not supported');
        }
    }
    
    useEffect(() => {
        if (!video) {
            setVidURL(null);
        }
    }, [video]); 

    useEffect(() => {
        const video = videoRef.current;
    
        if (video) {
            const handleLoadedMetadata = () => {
                setDuration(video.duration);
            };
        
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
        
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [vidURL]);

    const handleSliderChange = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current){
            videoRef.current.currentTime = time;
        }
    };
    
    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    return (
        <>
            <div className="getvid">
                <p className='swing-head' >{swingType} side:</p>
                <div className='previews'>
                    {gifUrl ? (
                        <div>
                            <img className="gif" src={gifUrl} alt='upload gif' />
                        </div>
                    ) : (vidURL ? (
                        <>
                            <div className='slider-view'>
                                <video 
                                    ref={videoRef} 
                                    src={vidURL} 
                                    width="600" 
                                    onTimeUpdate={handleTimeUpdate} 
                                    style={{ display: 'block', marginBottom: '10px' }} 
                                />
                            </div>
                        </>
                        ) : (
                            <div id="rectangle">
                                <label htmlFor='inputTag'>
                                    <img id='upload-img' src={uploadImg} />
                                    <input 
                                        id='inputTag' 
                                        type='file' 
                                        accept='video/mp4' 
                                        onChange={handleFileChange} 
                                    />
                                </label>
                            </div>
                        )
                    )}

                </div>
                <input 
                    type="range" 
                    min="0" 
                    max={duration}
                    step="0.01"
                    value={currentTime}
                    onChange={handleSliderChange}
                    disabled={!sliderBool}
                />
            </div>
        </>
    );
}

export default GetVid;
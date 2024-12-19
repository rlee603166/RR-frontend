import { useEffect, useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import GetVid from "./GetVid"
import './styles/Upload.css'


function Upload({ setProcessID, setDifference, setBackVideo, setFrontVideo, setFetchAble }) {
    const [front, setFront] = useState(null);
    const [back, setBack] = useState(null);

    const [frontGifUrl, setFrontGifUrl] = useState(null);
    const [backGifUrl, setBackGifUrl] = useState(null);

    const [frontURL, setFrontURL] = useState(null);
    const [backURL, setBackURL] = useState(null);

    const [frontTime, setFrontTime] = useState(0);   
    const [backTime, setBackTime] = useState(0);   
    const [frontDuration, setFrontDuration] = useState(0);
    const [backDuration, setBackDuration] = useState(0);

    const [frontSlider, setFrontSlider] = useState(false);
    const [backSlider, setBackSlider] = useState(false);

    const [open, setOpen] = useState(false);
    const url = 'http://127.0.0.1:5000/';

    const handleClear = () => {
        setFront(null);
        setBack(null);
        setFrontGifUrl(null);
        setBackGifUrl(null);
        setFrontURL(null);
        setBackURL(null);
        setFrontTime(0);
        setBackTime(0);
        setFrontSlider(false);
        setBackSlider(false);
    }

    const handleSubmit = async () => {
        let upload_url = url + 'upload';
        if (!front && !back) {
            alert("Please select a file first!");
            return;
        }
        setDifference(frontTime - backTime);
        handleOpen();
        const formData = new FormData();
        formData.append('file', front);
        formData.append('file', back);    
        formData.append('front_impact_time', (frontTime / frontDuration));
        formData.append('back_impact_time', (backTime / backDuration));
        saveToLocal();

        setDifference((frontTime - backTime))

        try {
            const response = await fetch(upload_url, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.process_id);
                setProcessID(data.process_id);
                handleClose();
                setFetchAble(true);
            } else {
                alert("File upload failed.");
            }
        } catch (error) {
            console.log(error);
            alert("Error uploading file.");
        }
    }

    const saveToLocal = () => {
        localStorage.setItem('frontUrl', frontURL);
        localStorage.setItem('backUrl', backURL);
    }

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div className="upload-page">
            <p className='title-box'>Upload videos of you swing!</p>
            <p>Slide to the frame where you make contact:</p>
            <div className="upload-body">
                <div className="getvid-card">
                    <GetVid
                        swingType='Front'
                        video={front}
                        setVid={setFront}
                        gifUrl={frontGifUrl}
                        setGifUrl={setFrontGifUrl}
                        vidURL={frontURL}
                        setVidURL={setFrontURL}
                        currentTime={frontTime} 
                        setCurrentTime={setFrontTime}
                        sliderBool={frontSlider}
                        setSliderBool={setFrontSlider}
                        duration={frontDuration}
                        setDuration={setFrontDuration}
                    />
                </div>
                <div className="getvid-card">
                    <GetVid
                        swingType='Back'
                        video={back}
                        setVid={setBack}
                        gifUrl={backGifUrl}
                        setGifUrl={setBackGifUrl}
                        vidURL={backURL}
                        setVidURL={setBackURL}
                        currentTime={backTime}
                        setCurrentTime={setBackTime}
                        sliderBool={backSlider}
                        setSliderBool={setBackSlider}
                        duration={backDuration}
                        setDuration={setBackDuration}
                    />
                </div>
            </div>
            <div id="buttons">
                <button className="submit" onClick={handleSubmit}>Submit</button>
                <button className="clear" onClick={handleClear}>Clear</button>
            </div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display: 'flex', flexDirection:'column' })}
                open={open}
            >
                <h2>This may take a couple minutes<br></br>Analyzing...</h2>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default Upload;
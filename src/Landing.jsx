import { useAutocomplete } from '@mui/material';
import background from './assets/rory-back.jpg';
import roryFront from './assets/rory-front.png'
import './styles/Landing.css';

function Landing({ setPlayground }) {
    
    return (
        <>
            <div className='image-container'>
                <img className='rory-background' src={background} />
                <div className='text-container'>
                    <p className='animated-text one'>Upgrade your swing</p>
                    <p className='animated-text two'>Leveraging AI</p>
                </div>
                <img className='rory-background overlay' src={roryFront} />
            </div>
            <div className='body'>
                <div className='word-container' >
                    <div className='words'>

                        <div className='content-text'>Unlock pro-level analysis</div>
                        <div className='content-text2'>With AI-driven insights</div>
                    </div>
                </div>
                <div className="example">
                    <img src='/rotation2.gif' className='pose-gif'/>
                    <img src='/thunder_back.gif' className='back-gif'/>
                </div>
            </div>
            <div className='body2'>
                <div className="example2">
                    <img src='/poseview.gif' className='pose2-gif'/>
                </div>
                <div className='word-container' >
                    <div className='words'>
                        <div className='content-text2'>Compare with Rory</div>
                        <div className='content-text'>Using 3D technology</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Landing;
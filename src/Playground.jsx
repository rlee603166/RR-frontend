import { useEffect, useRef, useState } from "react";
import SwingView from "./SwingView";
import "./styles/Playground.css";

import roryFront from "./assets/rory-front.mp4";
import roryBack from "./assets/rory-back.mp4";

function Playground({ setPlayground }) {
    const [RoryGifData, setRoryGifData] = useState([]);
    const [roryGifDuration, setRoryGifDuration] = useState(0);
    const [roryLoading, setRoryLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth * 0.33,
        height: window.innerHeight * 0.9,
    });

    let rory_url = "http://127.0.0.1:5000/get-rory";

    //     try {
    //         await new Promise(resolve => setTimeout(resolve, 100));
    //         const rory_data = roryData.prediction;
    //         setRoryGifData(rory_data);
    //         setRoryGifDuration(rory_data.back_kps.length - 1);
    //     } catch (error) {
    //         console.error("Error loading data:", error);
    //     } finally {
    //         setRoryLoading(false);
    //         console.log(roryLoading);
    //     }
    // };

    useEffect(() => {
        // Check if window is defined (only run in browser environment)
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setDimensions({
                    width: window.innerWidth * 0.3,
                    height: window.innerHeight * 0.95,
                });
            };

            // Add the event listener
            window.addEventListener("resize", handleResize);

            // Cleanup function to remove the event listener
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    const handleClick = () => {
        setPlayground(false);
    };

    return (
        <div className="play-container">
            <SwingView
                width={dimensions.width}
                height={dimensions.height}
                gifData={RoryGifData}
                videoFront={roryFront}
                videoBack={roryBack}
                isLoading={false}
                isLeft={false}
                gifDuration={roryGifDuration}
                difference={0}
                isPlayground={false}
            />
            <div className="controls">
                <button className="reupload" onClick={handleClick}>
                    Back
                </button>
            </div>
        </div>
    );
}

export default Playground;

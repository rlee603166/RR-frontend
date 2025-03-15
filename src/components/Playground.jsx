import { useEffect, useRef, useState } from "react";
import SwingView from "./SwingView";
import "../styles/Playground.css";

import roryFront from "../assets/rory-front.mp4";
import roryBack from "../assets/rory-back.mp4";

function Playground({ setPlayground }) {
    const [RoryGifData, setRoryGifData] = useState([]);
    const [roryGifDuration, setRoryGifDuration] = useState(0);
    const [roryLoading, setRoryLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth * 0.33,
        height: window.innerHeight * 0.9,
    });

    let rory_url = "http://127.0.0.1:5000/get-rory";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setDimensions({
                    width: window.innerWidth * 0.3,
                    height: window.innerHeight * 0.95,
                });
            };

            window.addEventListener("resize", handleResize);

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
       </div>
    );
}

export default Playground;

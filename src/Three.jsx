import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';


function Three() {
    // const [processID, setProcessID] = useState(null);
    const [keypointsF, setKeypointsF] = useState([]);
    const [edgesF, setEdgesF] = useState([]);
    const [keypointsB, setKeypointsB] = useState([]);
    const [edgesB, setEdgesB] = useState([]);

    let url = `http://127.0.0.1:5000/get/0e3a32e6-35d6-42c1-945c-30bc08b1708c`;

    const fetchPredictions = async () => {
        const response = await fetch(url);
        const data = await response.json();
        const predictions = data.prediction;
        console.log(predictions);
        setKeypointsF(predictions.front_kps);
        setKeypointsB(predictions.back_kps);
    }

    useEffect(() => {
        fetchPredictions();
    }, [])

    return (
        <>
            Front Keypoints
            <ol>
                {keypointsF ? keypointsB.map((kp, index) => (
                    <li key={index}>{kp.length}</li>
                )) : null}
            </ol>
        </>
    );
}

export default Three;
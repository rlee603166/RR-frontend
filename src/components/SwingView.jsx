import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "../styles/SwingView.css";

function SwingView({
    width,
    height,
    videoFront,
    videoBack,
    isLoading,
    isLeft,
    difference,
    isPlayground,
}) {
    const mountRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const spheresRef = useRef([]);
    const linesRef = useRef([]);
    const videoRefFront = useRef(null);
    const videoRefBack = useRef(null);

    const [gif, setGif] = useState(null);
    const [currFrontKps, setCurrFrontKps] = useState([]);
    const [currBackKps, setCurrBackKps] = useState([]);
    const [gifDuration, setGifDuration] = useState(null);
    const [frameIndex, setFrameIndex] = useState(0);
    const [videoFrontDuration, setVideoFrontDuration] = useState(0);
    const [roryLoading, setRoryLoading] = useState(null);

    const scaleFactor = 3;
    const edges = [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [0, 5],
        [0, 6],
        [5, 7],
        [7, 9],
        [6, 8],
        [8, 10],
        [5, 6],
        [5, 11],
        [6, 12],
        [11, 12],
        [11, 13],
        [13, 15],
        [12, 14],
        [14, 16],
    ];

    const fetchRory = async () => {
        setRoryLoading(true);
        try {
            const response = await fetch("/rory.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.prediction) {
                setGif(data.prediction);
                setGifDuration(data.prediction.back_kps.length - 1);

                setCurrBackKps(data.prediction.back_kps[0]);
                setCurrFrontKps(data.prediction.front_kps[0]);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setRoryLoading(false);
        }
    };

    const initLights = scene => {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(-3, 10, -10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = -2;
        dirLight.shadow.camera.left = -2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        scene.add(dirLight);
    };

    const initGrid = scene => {
        const gridHelper = new THREE.GridHelper(5, 10);
        scene.add(gridHelper);
    };

    const initScene = () => {
        if (!mountRef.current) return;

        if (rendererRef.current) {
            const existingCanvas = mountRef.current.querySelector("canvas");
            if (existingCanvas) {
                mountRef.current.removeChild(existingCanvas);
            }
            rendererRef.current.dispose();
            rendererRef.current.forceContextLoss();
            rendererRef.current = null; 
        } 

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa0a0a0);
        scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0.5, 1.5);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width - 50, height - 50);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener("change", () => renderer.render(scene, camera));
        controls.target.set(0, 0.5, 0);
        controls.minDistance = 0.05;
        controls.maxDistance = 3;
        controls.enablePan = false;
        controls.enableZoom = true;

        initLights(scene);
        initGrid(scene);

        rendererRef.current = renderer;
        sceneRef.current = scene;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    };

    const createSpheres = scene => {
        const geometry = new THREE.SphereGeometry(0.015, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });

        currFrontKps.forEach((kp, index) => {
            const sphere = new THREE.Mesh(geometry, material);
            const z = currBackKps[index][0];
            sphere.position.set(kp[0], kp[1], z);
            scene.add(sphere);
            spheresRef.current.push(sphere);
        });
    };

    const createLines = scene => {
        const lineMaterial = new THREE.LineBasicMaterial({ color: "#000000" });

        edges.forEach(edge => {
            const points = [
                new THREE.Vector3(
                    currFrontKps[edge[0]][0],
                    currFrontKps[edge[0]][1],
                    currBackKps[edge[0]][0]
                ),
                new THREE.Vector3(
                    currFrontKps[edge[1]][0],
                    currFrontKps[edge[1]][1],
                    currBackKps[edge[1]][0]
                ),
            ];

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            linesRef.current.push(line);
        });
    };

    const cleanupVisualization = scene => {
        spheresRef.current.forEach(sphere => scene.remove(sphere));
        linesRef.current.forEach(line => scene.remove(line));
        spheresRef.current = [];
        linesRef.current = [];
    };

    const updateVisualization = () => {
        if (
            !rendererRef.current ||
            !sceneRef.current ||
            !currBackKps?.length ||
            !currFrontKps?.length ||
            !Array.isArray(currBackKps) ||
            !Array.isArray(currFrontKps)
        )
            return;

        const scene = sceneRef.current;
        cleanupVisualization(scene);
        createSpheres(scene);
        createLines(scene);
    };
    useEffect(() => {
        initScene();

        fetchRory();
        return () => {
            if (mountRef.current && rendererRef.current) {
                const canvas = mountRef.current.querySelector("canvas");
                if (canvas) {
                    mountRef.current.removeChild(canvas);
                }
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
                rendererRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        updateVisualization();
    }, [currFrontKps, currBackKps]);

    useEffect(() => {
        if (rendererRef.current && cameraRef.current) {
            const renderer = rendererRef.current;
            const camera = cameraRef.current;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        }
    }, [width, height, isLoading]);

    useEffect(() => {
        if (gif && !isLoading) {
            setCurrBackKps(gif.back_kps[frameIndex]);
            setCurrFrontKps(gif.front_kps[frameIndex]);
        }
    }, [frameIndex]);

    useEffect(() => {
        if (videoRefFront.current && videoRefBack.current) {
            videoRefFront.current.load();
            videoRefBack.current.load();
            videoRefFront.current.onloadedmetadata = () => {
                setVideoFrontDuration(videoRefFront.current.duration);
            };
            
            videoRefFront.current.oncanplaythrough = () => {
            };
            videoRefBack.current.oncanplaythrough = () => {
            };
        }
    }, [videoFront, videoBack]);

    const handleSliderChange = e => {
        const frame = parseFloat(e.target.value);
        setFrameIndex(frame);
        const userTime = (frame / gifDuration) * videoFrontDuration;

        const clampedTime = Math.min(Math.max(0, userTime), videoFrontDuration);
    
        try {
            videoRefFront.current.currentTime = clampedTime;
            videoRefBack.current.currentTime = Math.max(0, clampedTime - difference);
        } catch (error) {
            console.error('Error updating video time:', error);
        }
    };

    return (
        <div className="swing-view">
            <div className="analytics">
                {isPlayground && (
                    <>
                        {isLeft && (
                            <div className="videos">
                                <div className="video-container">
                                    <video
                                        ref={videoRefFront}
                                        src={videoFront}
                                        width="600"
                                        style={{ display: "block", marginBottom: "10px" }}
                                    />
                                </div>
                                <div className="video-container">
                                    <video
                                        ref={videoRefBack}
                                        src={videoBack}
                                        width="600"
                                        style={{ display: "block", marginBottom: "10px" }}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="three">
                            <div
                                ref={mountRef}
                                style={{ width: `${width}`, height: `${height}` }}
                            ></div>
                        </div>
                        {!isLeft && (
                            <div className="videos">
                                <div className="video-container">
                                    <video
                                        ref={videoRefFront}
                                        src={videoFront}
                                        width="600"
                                        style={{ display: "block", marginBottom: "10px" }}
                                    />
                                </div>
                                <div className="video-container">
                                    <video
                                        ref={videoRefBack}
                                        src={videoBack}
                                        width="600"
                                        style={{ display: "block", marginBottom: "10px" }}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {!isPlayground && (
                <div className="playground">
                    <div className="playground-container">
                        <div className="video-playground">
                            <video
                                ref={videoRefFront}
                                src={videoFront}
                                width="600"
                                style={{ display: "block", marginBottom: "10px" }}
                            />
                        </div>
                        <div className="three">
                            <div
                                ref={mountRef}
                                style={{ width: `${width}`, height: `${height}` }}
                            ></div>
                        </div>
                        <div className="video-playground">
                            <video
                                ref={videoRefBack}
                                src={videoBack}
                                width="1500"
                                style={{ display: "block", marginBottom: "10px" }}
                            />
                        </div>
                    </div>
                </div>
            )}
            <input
                type="range"
                min="0"
                max={gifDuration}
                step="1"
                onChange={handleSliderChange}
                value={frameIndex}
                style={{
                    width: "15vw",
                    height: "8px",
                    borderRadius: "5px",
                }}
            />
        </div>
    );
}

export default SwingView;

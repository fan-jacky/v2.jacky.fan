'use client'

import React, { Suspense, useRef, useState, useEffect, useContext } from "react"
import { Canvas } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { calcRotation } from "@/helpers/calcRotation";
import { motion } from "framer-motion";
import { LoadingScreenContext } from "@/contexts/LoadingContext";
import { LocomotiveScrollPositionContext } from "@/contexts/LocomotiveScrollPositionContext";
    
export default function Magnifier3D() {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);
    const [modelRotation, setModelRotation] = useState([calcRotation(90), calcRotation(30), calcRotation(0)]);

    const [gltf, setGltf] = useState<any>(undefined);
    const [topValue, setTopValue] = useState(6);

    const { isLoadingDone, setIsLoadingDone } = useContext(LoadingScreenContext);
    const {scrollPos, setScrollPos} = useContext(LocomotiveScrollPositionContext);

    const [isResized, setIsResized] = useState(false);

    useEffect(() => {
        new GLTFLoader().load(`/magnifier.glb`,
            async (gltf) => {
                setGltf(gltf.scene);
                setIsLoadingDone ? setIsLoadingDone(true) : null;
            },
        );
    }, [])

    useEffect(()=>{
        if (!inView) { return; }
        let posY = ((scrollPos?.scroll.y ?? 0) / (scrollPos?.limit.y ?? 0));
        
        let newX = calcRotation(posY * 360 / 4 + 200), 
            newY = calcRotation(posY * 360 / 8 - 250),
            newZ = calcRotation(posY * 360 / 8 - 40)
        if (newX <= 4.70779210639 && newY <= -3.754756328 && newZ <= 0.089564899) {
            setModelRotation([newX, newY, newZ]);
        }
        setTopValue(posY * 15);
    }, [scrollPos])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            {
                rootMargin: "0px",
                threshold: [0, 1],
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }

        window.addEventListener("resize", ()=> {
            setIsResized(true);

            setTimeout(()=>{
                setIsResized(false);
            }, 50)
        });
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    // debug
    // useEffect(()=>{
    //     console.log(modelRotation);
    // }, [modelRotation])

    return (
        <>
            <motion.div
                ref={ref}
                animate={{
                    top: `-${topValue}rem`,
                }}
                className={`!hidden xl:!grid place-items-center h-full w-[66vw] absolute -bottom-4 -z-10 -right-[20vw]`}
            >
                <motion.div
                    className="w-full h-full"
                    animate={{
                        y: [0, 15, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeIn",
                    }}
                >
                    {(inView && !isResized) && (
                        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
                            {/* <pointLight position={[0, 1, 1]} intensity={2} />
                            <pointLight position={[0, 0, 1]} intensity={2} />
                            <pointLight position={[0, -1, 1]} intensity={2} />
                            <pointLight position={[0, -2, 1]} intensity={2} />
                            <spotLight intensity={3} />/ */}

                            <ambientLight intensity={0.5} />
                            <directionalLight position={[1, 0, 2]} intensity={2} />
                            <directionalLight position={[-1, 0, 2]} intensity={0.5} />
                            <Suspense fallback={null}>
                                {/* <Model /> */}
                                {gltf && <primitive object={gltf} scale={.0013} rotation={modelRotation} />}

                                {/* although it looks good with env, I removed it to reduce loading time */}
                                {/* <Environment preset="city" /> */}
                                {/* <Environment files="/img/kloofendal_misty_morning_puresky_1k.hdr" /> */}
                            </Suspense>
                            {/* <OrbitControls autoRotate={false} /> */}
                        </Canvas>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
}
import React, {useEffect, useState, useRef} from "react";
import {Stat} from "./Stat";

interface DisplayProps {
    messageState: any
}

export const Display: React.FC<DisplayProps> = ({messageState}) => {

    const MODE_MAIN = 0;
    const MODE_STATS = 1;
    const HEIGHT = 42;
    const WIDTH = 48;
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    const [mode, setMode] = useState<number>(MODE_MAIN);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageRect, setImageRect] = useState<{left: number, top: number, width: number, height: number}>({left: 0, top: 0, width: 0, height: 0});

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationFrame(animationFrame => (animationFrame + 1) % 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function updateRect() {
            if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                setImageRect({
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                });
            }
        }
        updateRect();
        window.addEventListener('resize', updateRect);
        return () => window.removeEventListener('resize', updateRect);
    }, []);

    function getPercent(imageSize: number, pixelCount: number): number {
      return  100 / (256 - imageSize) * pixelCount;
    }

    const spriteStyle = {
        position: 'absolute' as 'absolute',
        backgroundImage: 'url(/tamabotchi-sprites.png)',
        zIndex: '4'
    }

    // Tamabotchi image's native size
    const TAMABOTCHI_NATIVE_WIDTH = 1024;
    const TAMABOTCHI_NATIVE_HEIGHT = 1024;

    // Calculate scale and offset for overlays
    const scale = Math.min(
        imageRect.width / TAMABOTCHI_NATIVE_WIDTH,
        imageRect.height / TAMABOTCHI_NATIVE_HEIGHT
    );
    const offsetLeft = imageRect.left;
    const offsetTop = imageRect.top;

    // Update buildImage to use scale and offset
    function buildImage(
        positionX: number,
        positionY: number,
        width: number,
        height: number,
        textureX: number,
        textureY: number,
        flipX: boolean,
        blurry: boolean = false
    ): any {
        const style = {
            ...spriteStyle,
            position: 'absolute' as 'absolute',
            left: `${offsetLeft + positionX * scale}px`,
            top: `${offsetTop + positionY * scale}px`,
            width: `${width * scale}px`,
            height: `${height * scale}px`,
            backgroundPosition: `${getPercent(width, textureX)}% ${getPercent(height, textureY)}%`,
            backgroundSize: `${25600 / width}% ${25600 / height}%`,
            transform: flipX ? 'scaleX(-1)' : 'scaleX(1)',
            filter: blurry ? 'blur(2px)' : undefined,
            opacity: blurry ? 0.3 : 1,
            zIndex: blurry ? '3' : '4',
            pointerEvents: 'none' as React.CSSProperties['pointerEvents']
        };
        return <div style={style}></div>;
    }

    const images = [];
    for (let i = 0; i < (messageState.health ?? 3); i++) {
        // Blurry background
        images.push(
            buildImage(
                i * 8,
                HEIGHT - 8,
                8,
                8,
                ((animationFrame % 2) == 0 && i == messageState.health - 1) ? 16 : 8,
                176,
                false,
                true // blurry
            )
        );
        // Crisp foreground
        images.push(
            buildImage(
                i * 8,
                HEIGHT - 8,
                8,
                8,
                ((animationFrame % 2) == 0 && i == messageState.health - 1) ? 16 : 8,
                176,
                false,
                false // crisp
            )
        );
    }

    if (messageState.badStats && messageState.badStats.length > 0) {
        const stat = messageState.badStats[animationFrame % messageState.badStats.length];
        const statIndex = Object.values(Stat).indexOf(stat);
        // Blurry background
        images.push(
            buildImage(
                0,
                8,
                48,
                8,
                Math.floor(statIndex / 8) * 48,
                192 + 8 * (statIndex % 8),
                false,
                true // blurry
            )
        );
        // Crisp foreground
        images.push(
            buildImage(
                0,
                8,
                48,
                8,
                Math.floor(statIndex / 8) * 48,
                192 + 8 * (statIndex % 8),
                false,
                false // crisp
            )
        );
    }


    let frame = 0;

    // Add a function to toggle modes
    function toggleMode() {
        setMode(prev => prev === MODE_MAIN ? MODE_STATS : MODE_MAIN);
    }

    return (
        <div ref={containerRef} style={{position: 'relative', width: '100%', height: '100%'}}>
            <img
                ref={imageRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    zIndex: 1
                }}
                src={'/tamabotchi.png'}
                alt="Tamagotchi-style hand-held electronic game"
            />
            {/* Button overlay for toggling modes */}
            <div
                style={{
                    position: 'absolute',
                    left: `${475 / 1024 * 100}%`,
                    top: `${740 / 1024 * 100}%`,
                    width: `${(550 - 475) / 1024 * 100}%`,
                    height: `${(820 - 740) / 1024 * 100}%`,
                    zIndex: 10,
                    cursor: 'pointer'
                }}
                onClick={toggleMode}
            />
            <div style={{imageRendering: 'pixelated'}}>
                {mode === MODE_MAIN ? (
                    <>
                        {images}
                        {/* Blurry background */}
                        {buildImage(
                            16,
                            16,
                            16,
                            16,
                            (messageState.masculine ? 128 : 0) + frame * 16,
                            messageState.characterType * 16,
                            (animationFrame % 2) == 0,
                            true // blurry
                        )}
                        {/* Crisp foreground */}
                        {buildImage(
                            16,
                            16,
                            16,
                            16,
                            (messageState.masculine ? 128 : 0) + frame * 16,
                            messageState.characterType * 16,
                            (animationFrame % 2) == 0,
                            false // crisp
                        )}
                    </>
                ) : (
                    // Placeholder for Stat mode images
                    <div style={{position: 'absolute', top: '50%', left: '50%', color: 'white', zIndex: 20, transform: 'translate(-50%, -50%)'}}>
                        {/* Display some stats or information here */}
                        <h1 style={{fontSize: '2rem'}}>Stat Mode</h1>
                        <p>Here you can show the stats like health, happiness, etc.</p>
                    </div>
                )}
            </div>
        </div>);
};

import React, {useEffect, useState} from "react";
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
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationFrame(animationFrame => (animationFrame + 1) % 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function getPercent(imageSize: number, pixelCount: number): number {
      return  100 / (256 - imageSize) * pixelCount;
    }

    const spriteStyle = {
        position: 'absolute' as 'absolute',
        backgroundImage: 'url(/tamabotchi-sprites.png)',
        zIndex: '4'
    }

    function buildImage(positionX: number, positionY: number, width: number, height: number, textureX: number, textureY: number, flipX: boolean): any {
        return <div style={{
            ...spriteStyle,
            top: `${66 - ((positionY + height) * 0.625)}%`,
            left: `${35 + (positionX * 0.625)}%`,
            width: `${width * 0.625}%`,
            height: `${height * 0.625}%`,
            backgroundPosition: `${getPercent(width, textureX)}% ${getPercent(height, textureY)}%`,
            backgroundSize: `${25600 / width}% ${25600 / height}%`,
            transform: flipX ? 'scaleX(-1)' : 'scaleX(1)'
        }}></div>
    }

    const images = [];
    for (let i = 0; i < messageState.health ?? 3; i++) {
        images.push(buildImage(i * 8, HEIGHT - 8, 8, 8, ((animationFrame % 2) == 0 && i == messageState.health - 1) ? 16 : 8, 176, false));
    }

    if (messageState.badStats && messageState.badStats.length > 0) {
        const stat = messageState.badStats[animationFrame % messageState.badStats.length];
        const statIndex = Object.values(Stat).indexOf(stat);
        console.log(`${stat}:${statIndex}`);
        images.push(buildImage(0, 8, 48, 8, Math.floor(statIndex / 8) * 48, 192 + 8 * (statIndex % 8), false));
    }


    let frame = 0;

    return <div style={{imageRendering: 'pixelated'}}>
        {images}
        {buildImage(16, 16, 16, 16, (messageState.masculine ? 128 : 0) + frame * 16, messageState.characterType * 16, (animationFrame % 2) == 0)}
    </div>;
};

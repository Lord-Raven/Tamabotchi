import React, {useEffect, useState} from "react";

interface DisplayProps {
    messageState: any
}

export const Display: React.FC<DisplayProps> = ({messageState}) => {
    const [animationFrame, setAnimationFrame] = useState<number>(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationFrame(animationFrame => (animationFrame + 1) % 2);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function getPercent(imageSize: number, pixelCount: number): number {
      return  100 / (256 - imageSize) * pixelCount;
    }


    const spriteStyle = {
        position: 'absolute' as 'absolute',
        backgroundImage: 'url(/tamabotchi-sprites.png)',
        backgroundSize: '1600% 1600%',
        zIndex: '4'
    }

    function buildImage(positionX: number, positionY: number, width: number, height: number, textureX: number, textureY: number, flipX: boolean): any {
        return <div style={{
            ...spriteStyle,
            top: `${70 - (positionY * 0.625)}%`,
            left: `${35 + (positionX * 0.625)}%`,
            width: `${width * 0.625}%`,
            height: `${height * 0.625}%`,
            backgroundPosition: `${getPercent(width, textureX)}% ${getPercent(height, textureY)}%`,
            backgroundSize: `${25600 / width}% ${25600 / height}%`,
            transform: flipX ? 'scaleX(-1)' : 'scaleX(1)'
        }}></div>
    }

    const healthDivs = [];
    for (let i = 0; i < messageState.health ?? 3; i++) {
        healthDivs.push(buildImage(i * 8, 48 - 8, 8, 8, (animationFrame == 0 && i == messageState.health - 1) ? 16 : 8, 176, false));
    }

    return <div style={{imageRendering: 'pixelated'}}>
        {healthDivs}
        {buildImage(16, 16, 16, 16, 0, 16, animationFrame == 0)}
    </div>;
};

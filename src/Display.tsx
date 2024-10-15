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

    const healthDivs = [];
    for (let i = 0; i < messageState.health ?? 3; i++) {
        healthDivs.push(<div className='sprite' style={{
            top: '40%',
            left: `${35 + i * 5}%`,
            width: '5%',
            height: '5%',
            backgroundPosition: `${(animationFrame == 0 && i == messageState.health - 1) ? '6.2745098' : '3.1372549'}% 69.0196078%`,
            backgroundSize: '3200% 3200%'

        }}>
        </div>);
    }

    return <div style={{imageRendering: 'pixelated'}}>
        <style>{`
                .sprite {
                    position: 'absolute',
                    backgroundImage: 'url(/tamabotchi-sprites.png)',
                    backgroundSize: '1600% 1600%',
                    zIndex: '4'
                }
            `}</style>
        {healthDivs}
        <div className='sprite' style={{
            top: '47%',
            left: '45%',
            width: '10%',
            height: '10%',
            backgroundPosition: '0% 0%',
            transform: (animationFrame == 0) ? 'scaleX(1)' : 'scaleX(-1)'
        }}>
        </div>
    </div>;
};

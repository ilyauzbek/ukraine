import React, { useEffect, useState } from 'react';
import './Hero.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Hero = () => {
    const getInitialPositions = () => {
        const savedPositions = localStorage.getItem('cardPositions');
        if (savedPositions) {
            return JSON.parse(savedPositions);
        }
        const cardCount = 10;
        return Array.from({ length: cardCount }).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 2 - 1,
        }));
    };

    const [positions, setPositions] = useState(getInitialPositions);
    const [explosions, setExplosions] = useState([]);

    useEffect(() => {
        localStorage.setItem('cardPositions', JSON.stringify(positions));
    }, [positions]);

    useEffect(() => {
        const moveCards = () => {
            setPositions((prev) =>
                prev.map((pos) => {
                    let { x, y, dx, dy } = pos;

                    if (x + 150 > window.innerWidth || x < 0) dx = -dx;
                    if (y + 100 > window.innerHeight || y < 0) dy = -dy;

                    return {
                        x: x + dx,
                        y: y + dy,
                        dx,
                        dy,
                    };
                })
            );
            requestAnimationFrame(moveCards);
        };

        const animationId = requestAnimationFrame(moveCards);
        return () => cancelAnimationFrame(animationId);
    }, []);

    const handleExplosion = (index, x, y) => {
        setExplosions((prev) => [...prev, { x, y, id: Date.now() }]);
        setTimeout(() => {
            setPositions((prev) => prev.filter((_, i) => i !== index));
        }, 0);
    };

    useEffect(() => {
        const timeoutIds = explosions.map(({ id }) =>
            setTimeout(() => {
                setExplosions((prev) => prev.filter((explosion) => explosion.id !== id));
            }, 1000)
        );
        return () => timeoutIds.forEach((id) => clearTimeout(id));
    }, [explosions]);

    const resetCards = () => {
        const newPositions = Array.from({ length: 40 }).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 2 - 1,
        }));
        setPositions(newPositions);
    };

    return (
        <div className="hero-container">
            {positions.map((position, i) => (
                <div
                    key={i}
                    className="rainbow-card"
                    data-aos="flip-up"
                    data-aos-delay={`${i * 50}`}
                    onClick={() => handleExplosion(i, position.x, position.y)}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transition: 'transform 0.02s linear',
                    }}
                >
                    <img src={`https://flagmakers.co.uk/media/t5dbmcrv/flag_of_ukraine.png?anchor=center&mode=crop&width=100&height=100&rnd=132906154057230000=${i}`} alt={`zelenskiy ${i}`} />
                    <h2>Zelenskiy {i + 1}</h2>
                </div>
            ))}

            {explosions.map((explosion) => (
                <div
                    key={explosion.id}
                    className="explosion"
                    style={{
                        top: explosion.y,
                        left: explosion.x,
                    }}
                />
            ))}

            <button className="reset-button" onClick={resetCards}>
                Сбросить карточки
            </button>
        </div>
    );
};

export default Hero;

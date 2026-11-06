import React from 'react';

const FloatingHearts: React.FC = () => {
  const hearts = [
    { id: 1, left: '10%', delay: '0s', duration: '7s', size: '18px' },
    { id: 2, left: '25%', delay: '2s', duration: '9s', size: '24px' },
    { id: 3, left: '45%', delay: '4s', duration: '8s', size: '16px' },
    { id: 4, left: '65%', delay: '1s', duration: '10s', size: '22px' },
    { id: 5, left: '80%', delay: '3s', duration: '7.5s', size: '20px' },
    { id: 6, left: '92%', delay: '5s', duration: '8.5s', size: '15px' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute text-pink-300/40 select-none animate-float-heart"
          style={{
            left: h.left,
            bottom: '-20px',
            fontSize: h.size,
            animationDelay: h.delay,
            animationDuration: h.duration,
          }}
        >
          {h.id % 2 === 0 ? '💕' : '💖'}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;

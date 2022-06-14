import React from 'react';

type Props = {
  progress: number;
  animationDuration: number;
};
const Bar = ({ progress, animationDuration }: Props) => (
  <div
    style={{
      background: '#000e9c',
      position: 'fixed',
      zIndex: 10000,
      height: 4,
      top: 0,
      left: 0,
      width: '100%',
      marginLeft: `${(-1 + progress) * 100}%`,
      transition: `margin-left ${animationDuration}ms linear`,
    }}
  >
    <div
      style={{
        display: 'block',
        position: 'absolute',
        right: 0,
        width: 100,
        boxShadow: '0 0 10px #000e9c, 0 0 5px #000e9c',
        opacity: 1,
        height: '100%',
        transform: 'rotate(3deg) translate(0px, -4px)',
      }}
    />
  </div>
);

export default Bar;

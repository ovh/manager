import React from 'react';

type Props = {
  animationDuration: number;
  isFinished: boolean;
  children: React.ReactNode;
};
const Container = ({ animationDuration, children, isFinished }: Props) => (
  <div
    style={{
      opacity: isFinished ? 0 : 1,
      pointerEvents: 'none',
      transition: `opacity ${animationDuration}ms linear`,
    }}
  >
    {children}
  </div>
);

export default Container;

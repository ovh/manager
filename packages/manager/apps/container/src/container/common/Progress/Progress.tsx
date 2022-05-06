import React from 'react';
import { NProgress } from '@tanem/react-nprogress';
import Container from './Container';
import Bar from './Bar';

type Props = {
  isAnimating: boolean;
};
const Progress = ({ isAnimating }: Props): JSX.Element => (
  <NProgress isAnimating={isAnimating}>
    {({ animationDuration, isFinished, progress }) => (
      <Container animationDuration={animationDuration} isFinished={isFinished}>
        <Bar animationDuration={animationDuration} progress={progress} />
      </Container>
    )}
  </NProgress>
);

export default Progress;

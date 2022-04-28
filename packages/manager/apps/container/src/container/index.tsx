import React from 'react';

import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { useShell } from '@/context';

export default function Container(): JSX.Element {
  const { isLoading, betaVersion, useBeta } = useProductNavReshuffle();
  const shell = useShell();
  if (isLoading) {
    return <></>;
  }
  shell.getPlugin('ux').setIsBetaNavigation(betaVersion && useBeta);
  return (
    <>
      {betaVersion && useBeta ? <NavReshuffleContainer /> : <LegacyContainer />}
    </>
  );
}

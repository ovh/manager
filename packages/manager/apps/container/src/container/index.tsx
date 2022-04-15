import React from 'react';

import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

export default function Container(): JSX.Element {
  const { isLoading, betaVersion, useBeta } = useProductNavReshuffle();
  if (isLoading) {
    return <></>;
  }
  return (
    <>
      {betaVersion && useBeta ? <NavReshuffleContainer /> : <LegacyContainer />}
    </>
  );
}

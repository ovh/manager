import React from 'react';
import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

export default function Container() {
  const { isLoading, isBeta } = useProductNavReshuffle();
  if (isLoading) {
    return <></>;
  }
  return <>{isBeta ? <NavReshuffleContainer /> : <LegacyContainer />}</>;
}

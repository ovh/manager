import React from 'react';

import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { ProductNavReshuffleProvider } from '@/core/product-nav-reshuffle';
import { ProgressProvider } from '@/context/progress';

export default function Container(): JSX.Element {
  const { isLoading, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const isNavReshuffle = betaVersion && useBeta;
  if (isLoading) {
    return <></>;
  }
  if (isNavReshuffle) {
    shell.getPlugin('ux').showMenuSidebar();
  }
  return (
    <ProgressProvider>
      {isNavReshuffle ? (
        <ProductNavReshuffleProvider>
          <NavReshuffleContainer />
        </ProductNavReshuffleProvider>
      ) : (
        <LegacyContainer />
      )}
    </ProgressProvider>
  );
}

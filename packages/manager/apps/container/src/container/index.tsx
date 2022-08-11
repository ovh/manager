import React, { useEffect, Suspense } from 'react';

import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { ProductNavReshuffleProvider } from '@/core/product-nav-reshuffle';
import { ProgressProvider } from '@/context/progress';
import CookiePolicy from '@/cookie-policy/CookiePolicy';
import SSOAuthModal from '@/sso-auth-modal/SSOAuthModal';

export default function Container(): JSX.Element {
  const { isLoading, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const isNavReshuffle = betaVersion && useBeta;

  useEffect(() => {
    if (!isLoading) {
      const tracking = shell.getPlugin('tracking');
      tracking.waitForConfig().then(() => {
        if (isNavReshuffle) {
          if (betaVersion === 1) {
            tracking.trackMVTest({
              test: '[product-navigation-reshuffle]',
              waveId: 1,
              creation: '[full-services]',
            });
          } else if (betaVersion === 2) {
            tracking.trackMVTest({
              test: '[product-navigation-reshuffle]',
              waveId: 1,
              creation: '[customer-services]',
            });
          }
        }
      });
      shell.getPlugin('ux').showMenuSidebar();
    }
  }, [isLoading]);

  return isLoading ? (
    <></>
  ) : (
    <>
      <ProgressProvider>
        {isNavReshuffle ? (
          <ProductNavReshuffleProvider>
            <NavReshuffleContainer />
          </ProductNavReshuffleProvider>
        ) : (
          <LegacyContainer />
        )}
      </ProgressProvider>
      <Suspense fallback="">
        <SSOAuthModal />
      </Suspense>
      <Suspense fallback="...">
        <CookiePolicy shell={shell} />
      </Suspense>
    </>
  );
}

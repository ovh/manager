import React, { Suspense, useEffect, useState } from 'react';

import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { ProductNavReshuffleProvider } from '@/core/product-nav-reshuffle';
import { ProgressProvider } from '@/context/progress';
import CookiePolicy from '@/cookie-policy/CookiePolicy';
import SSOAuthModal from '@/sso-auth-modal/SSOAuthModal';
import PaymentModal from '@/payment-modal/PaymentModal';
import { IdentityDocumentsModal } from '@/identity-documents-modal/IdentityDocumentsModal';
// import LiveChat from '@/components/livechat/LiveChat.component';
const LiveChat = React.lazy(() =>
  import('@/container/livechat/LiveChat.component'),
);
export default function Container(): JSX.Element {
  const { isLoading, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const [isCookiePolicyApplied, setIsCookiePolicyApplied] = useState(false);

  const isNavReshuffle = betaVersion && useBeta;

  const cookiePolicyHandler = (isApplied: boolean): void =>
    setIsCookiePolicyApplied(isApplied);

  useEffect(() => {
    if (!isLoading) {
      const tracking = shell.getPlugin('tracking');
      tracking.waitForConfig().then(() => {
        if (isNavReshuffle) {
          tracking.trackMVTest({
            test: '[product-navigation-reshuffle]',
            waveId: 2,
            creation: '[full-services_v3]',
          });
        }
      });
      if (isNavReshuffle) {
        shell.getPlugin('ux').showMenuSidebar();
      }
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
          <>
            <LegacyContainer />
          </>
        )}
        <Suspense fallback="">
          <LiveChat
            closeLiveChat={() => shell.getPlugin('ux').closeChatbot()}
          />
        </Suspense>
      </ProgressProvider>

      <Suspense fallback="">
        <SSOAuthModal />
      </Suspense>
      {isCookiePolicyApplied && (
        <Suspense fallback="">
          <PaymentModal />
        </Suspense>
      )}
      {isCookiePolicyApplied && (
        <Suspense fallback="">
          <IdentityDocumentsModal />
        </Suspense>
      )}
      <Suspense fallback="...">
        <CookiePolicy shell={shell} onValidate={cookiePolicyHandler} />
      </Suspense>
    </>
  );
}

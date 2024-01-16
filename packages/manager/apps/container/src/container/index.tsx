import React, { Suspense, useEffect } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { ProductNavReshuffleProvider } from '@/core/product-nav-reshuffle';
import { ProgressProvider } from '@/context/progress';
import CookiePolicy from '@/cookie-policy/CookiePolicy';
import SSOAuthModal from '@/sso-auth-modal/SSOAuthModal';
import PaymentModal from '@/payment-modal/PaymentModal';
import LiveChat from '@/components/LiveChat';

export default function Container(): JSX.Element {
  const {
    isLoading,
    betaVersion,
    useBeta,
    chatbotOpen,
    chatbotReduced,
    setChatbotReduced,
  } = useContainer();
  const shell = useShell();
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const language = environment.getUserLanguage();
  const { ovhSubsidiary, supportLevel } = environment.getUser();

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
        <LiveChat
          supportLevel={supportLevel?.level}
          language={language}
          subsidiary={ovhSubsidiary}
          open={chatbotOpen}
          reduced={chatbotReduced}
          onReduce={() => setChatbotReduced(true)}
          onClose={() => shell.getPlugin('ux').closeChatbot()}
          style={{ position: 'absolute' }}
        ></LiveChat>
      </ProgressProvider>

      <Suspense fallback="">
        <SSOAuthModal />
      </Suspense>
      <Suspense fallback="">
        <PaymentModal />
      </Suspense>
      <Suspense fallback="...">
        <CookiePolicy shell={shell} />
      </Suspense>
    </>
  );
}

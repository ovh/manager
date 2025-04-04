import React, { Suspense, useEffect, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { ProductNavReshuffleProvider } from '@/core/product-nav-reshuffle';
import { ProgressProvider } from '@/context/progress';
import CookiePolicy from '@/cookie-policy/CookiePolicy';
import SSOAuthModal from '@/sso-auth-modal/SSOAuthModal';
import LiveChat from '@/components/LiveChat';
import { ModalsProvider } from '@/context/modals';

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
  const [isCookiePolicyApplied, setIsCookiePolicyApplied] = useState(false);
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const language = environment.getUserLanguage();
  const { ovhSubsidiary, supportLevel } = environment.getUser();

  const isNavReshuffle = betaVersion && useBeta;

  const cookiePolicyHandler = (isApplied: boolean): void => setIsCookiePolicyApplied(isApplied);

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
      {isCookiePolicyApplied && <ModalsProvider />}
      <Suspense fallback="...">
        <CookiePolicy shell={shell} onValidate={cookiePolicyHandler} />
      </Suspense>
    </>
  );
}

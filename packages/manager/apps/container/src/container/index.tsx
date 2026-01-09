import { Suspense, useEffect, useState, lazy } from 'react';

import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { ProductNavReshuffleProvider } from '@/core/product-nav-reshuffle';
import { ProgressProvider } from '@/context/progress';
import CookiePolicy from '@/cookie-policy/CookiePolicy';
import SSOAuthModal from '@/components/sso-auth-modal/SSOAuthModal.component';
import LiveChat from '@/container/livechat/LiveChat.component';
import AIChatbot from '@/container/ai-chatbot/AIChatbot.component';

export default function Container(): JSX.Element {
  const { isLoading, betaVersion, useBeta, isAIChatbotEnabled, setAIChatbotOpen } = useContainer();
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

  useEffect(() => {
    if (!isLoading && isAIChatbotEnabled) {
      const hasAutoOpened = sessionStorage.getItem('ai-chatbot-auto-opened-session');

      if (!hasAutoOpened) {
        const timer = setTimeout(() => {
          setAIChatbotOpen(true);
          sessionStorage.setItem('ai-chatbot-auto-opened-session', 'true');

          const tracking = shell.getPlugin('tracking');
          tracking.trackClick({
            name: 'ai-chatbot::auto-open',
            type: 'action',
            chapter1: 'container',
          });
        }, 10000);

        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isAIChatbotEnabled, setAIChatbotOpen, shell]);

  return isLoading ? (
    <></>
  ) : (
    <>
      <ProgressProvider>
        {isNavReshuffle ? (
          <ProductNavReshuffleProvider>
            <NavReshuffleContainer isCookiePolicyModalClosed={isCookiePolicyApplied}/>
          </ProductNavReshuffleProvider>
        ) : (
          <>
            <LegacyContainer isCookiePolicyModalClosed={isCookiePolicyApplied}/>
          </>
        )}
        <Suspense fallback="">
          <LiveChat
            closeLiveChat={() => shell.getPlugin('ux').closeChatbot()}
          />
        </Suspense>
        <Suspense fallback="">
          <AIChatbot />
        </Suspense>
      </ProgressProvider>

      <Suspense fallback="">
        <SSOAuthModal />
      </Suspense>
      <Suspense fallback="...">
        <CookiePolicy shell={shell} onValidate={cookiePolicyHandler} />
      </Suspense>
    </>
  );
}

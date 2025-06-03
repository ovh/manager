import { createElement, Suspense, useEffect, useState } from 'react';
import { useShell } from '@/context';

import SuggestionModal from '@/components/SuggestionModal/SuggestionModal.component';
import AgreementsUpdateModal from '@/components/AgreementsUpdateModal/AgreementsUpdateModal.component';
import PaymentModal from '@/payment-modal/PaymentModal';
import { IdentityDocumentsModal } from '@/identity-documents-modal/IdentityDocumentsModal';

const MODALS_TO_DISPLAY: (() => JSX.Element)[] = [
  IdentityDocumentsModal,
  PaymentModal,
  AgreementsUpdateModal,
  SuggestionModal,
];

export default function ModalsProvider(): JSX.Element {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const [isReady, setIsReady] = useState(false);
  const [current, setCurrent] = useState<() => JSX.Element | null>(
    null,
  );

  useEffect(() => {
    if (current === null) return;
    uxPlugin.registerModalActionDoneListener((id: string) => {
      if (id === current?.name) {
        setCurrent((previous) => {
          const nextConfigurationIndex = MODALS_TO_DISPLAY.indexOf(current) + 1;
          if (
            previous === null ||
            nextConfigurationIndex === MODALS_TO_DISPLAY.length
          ) {
            return null;
          }
          return MODALS_TO_DISPLAY[nextConfigurationIndex];
        });
      }
    });
  }, [current]);

  useEffect(() => {
    // On the first inner app full display we'll start managing modals lifecycle
    const initModalLifeCycleManagement = () => setIsReady(true);
    uxPlugin.onHidePreloader(initModalLifeCycleManagement, { once: true });
  }, []);

  useEffect(() => {
    if (isReady) {
      setCurrent(() => MODALS_TO_DISPLAY[0]);
    }
  }, [isReady]);

  if (current === null) return null;

  return (
    <Suspense>
      { createElement(current) }
    </Suspense>
  );
};

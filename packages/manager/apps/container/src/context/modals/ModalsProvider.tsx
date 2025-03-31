import React, { Suspense, useEffect, useState } from 'react';
import ModalsContext, { ModalsContextType } from './modals.context';

import { useShell } from '@/context';
import { AgreementsUpdateModalConfiguration } from '@/components/AgreementsUpdateModal/AgreementsUpdateModal.constants';
import { IdentityDocumentsModalConfiguration } from '@/identity-documents-modal/IdentityDocumentsModal.constants';
import { PaymentModalConfiguration } from '@/payment-modal/PaymentModal.constants';
import { useModalManager } from '@/context/modals/useModalManager';
import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';

const MODALS_TO_DISPLAY: ModalToDisplayConfiguration[] = [
  IdentityDocumentsModalConfiguration,
  PaymentModalConfiguration,
  AgreementsUpdateModalConfiguration,
];

export const ModalsProvider = (): JSX.Element => {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const [isReady, setIsReady] = useState(false);
  const [current, setCurrent] = useState<ModalToDisplayConfiguration | null>(
    null,
  );
  const { isDisplayed, data } = useModalManager(current);

  useEffect(() => {
    if (current === null) return;
    uxPlugin.registerModalActionDoneListener((id: string) => {
      if (id === current?.component.name) {
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

  useEffect(() => {
    if (isDisplayed === false) {
      uxPlugin.notifyModalActionDone(current?.component.name);
    }
  }, [isDisplayed]);

  const modalsContext: ModalsContextType = {
    data,
  };

  return (
    <ModalsContext.Provider value={modalsContext}>
      {isDisplayed && (
        <Suspense>
          <current.component></current.component>
        </Suspense>
      )}
    </ModalsContext.Provider>
  );
};

export default ModalsProvider;

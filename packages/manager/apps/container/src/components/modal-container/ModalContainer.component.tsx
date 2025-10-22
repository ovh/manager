import {
  FC,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import { useShell } from '@/context';

import SuggestionModal from '@/components/suggestion-modal/SuggestionModal.component';
import AgreementsUpdateModal from '@/components/agreements-update-modal/AgreementsUpdateModal.component';
import PaymentModal from '@/components/payment-modal/PaymentModal.component';
import { IdentityDocumentsModal } from '@/components/identity-documents-modal/IdentityDocumentsModal.component';

const MODALS: FC[] = [
  IdentityDocumentsModal,
  PaymentModal,
  AgreementsUpdateModal,
  SuggestionModal,
];

type ModalContainerProps = {
  isPreloaderVisible: boolean;
};

export default function ModalContainer({
  isPreloaderVisible
}: ModalContainerProps) {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    // If the preloader is already hidden we start managing modals lifecycle
    // Otherwise we listen for the hidding of the preloader to do so
    if (!isPreloaderVisible) {
      setIsReady(true);
      return;
    }
    
    const initModalLifeCycleManagement = () => setIsReady(true);
    uxPlugin.onHidePreloader(initModalLifeCycleManagement, { once: true });
    return () => {
      uxPlugin.removeOnHidePreloader(initModalLifeCycleManagement);
    };
  }, []);

  // Launch the first modal when ready
  useEffect(() => {
    if (isReady) {
      setCurrentIndex(0);
    }
  }, [isReady]);

  // Move to the next modal when the action is completed
  const handleActionDone = useCallback((id: string) => {
    if (currentIndex === null) return;
    const CurrentModal = MODALS[currentIndex];
    if (id === CurrentModal.displayName || id === CurrentModal.name) {
      const next = currentIndex + 1;
      setCurrentIndex(next < MODALS.length ? next : null);
    }
  }, [currentIndex]);

  // Register the listener synchronously before rendering using useLayoutEffect
  // This ensures the listener is registered before any modal's useEffect runs
  useLayoutEffect(() => {
    if (currentIndex === null) return;
    uxPlugin.registerModalActionDoneListener(handleActionDone);
    return () => {
      uxPlugin.unregisterModalActionDoneListener(handleActionDone);
    };
  }, [currentIndex, uxPlugin, handleActionDone]);

  if (currentIndex === null) return null;

  const ActiveModal = MODALS[currentIndex];
  return (
    <Suspense fallback={null}>
      <ActiveModal />
    </Suspense>
  );
};

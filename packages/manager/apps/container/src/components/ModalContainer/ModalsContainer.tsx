import {
  FC,
  Suspense,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useShell } from '@/context';

import SuggestionModal from '@/components/SuggestionModal/SuggestionModal.component';
import AgreementsUpdateModal from '@/components/AgreementsUpdateModal/AgreementsUpdateModal.component';
import PaymentModal from '@/payment-modal/PaymentModal';
import { IdentityDocumentsModal } from '@/identity-documents-modal/IdentityDocumentsModal';

const MODALS: FC[] = [
  IdentityDocumentsModal,
  PaymentModal,
  AgreementsUpdateModal,
  SuggestionModal,
];

type ModalsContainerProps = {
  isPreloaderVisible: boolean;
};

export default function ModalsContainer({
  isPreloaderVisible
}: ModalsContainerProps) {
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

  useEffect(() => {
    if (currentIndex === null) return;
    uxPlugin.registerModalActionDoneListener(handleActionDone);
    // TODO: implement the unregisterModalActionDoneListener in order to clean up this event listener (MANAGER-18813)
    /*return () => {
      uxPlugin.unregisterModalActionDoneListener(handleActionDone);
    };*/
  }, [currentIndex, uxPlugin, handleActionDone]);

  if (currentIndex === null) return null;

  const ActiveModal = MODALS[currentIndex];
  return (
    <Suspense fallback={null}>
      <ActiveModal />
    </Suspense>
  );
};

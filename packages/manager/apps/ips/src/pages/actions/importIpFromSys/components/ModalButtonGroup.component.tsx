import { useTranslation } from 'react-i18next';

import { Button, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

const trackingStepName = {
  1: 'select-ip',
  2: 'select-server',
  3: 'select-duration',
  4: 'accept-agreements',
  5: 'go-to-order',
};

type ModalButtonGroupProps = {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onCancel?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isNextButtonDisabled?: boolean;
  isNextButtonLoading?: boolean;
  onConfirm?: () => void;
};

export function ModalButtonGroup({
  onCancel,
  onConfirm,
  onNext,
  isNextButtonDisabled,
  isNextButtonLoading,
  onPrevious,
  currentStep,
}: ModalButtonGroupProps) {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const { trackClick } = useOvhTracking();

  return (
    <div className="z-[2] mt-4 flex gap-4">
      {onCancel && (
        <Button
          variant={BUTTON_VARIANT.outline}
          onClick={() => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: [
                'import_sys-ip',
                trackingStepName[currentStep],
                'cancel',
              ],
            });
            onCancel?.();
          }}
        >
          {t('cancel')}
        </Button>
      )}
      {onPrevious && (
        <Button
          variant={BUTTON_VARIANT.ghost}
          onClick={() => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: [
                'import_sys-ip',
                trackingStepName[currentStep],
                'previous',
              ],
            });
            onPrevious?.();
          }}
        >
          {t('previous')}
        </Button>
      )}
      {onNext && (
        <Button
          disabled={isNextButtonDisabled}
          loading={isNextButtonLoading}
          onClick={() => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['import_sys-ip', trackingStepName[currentStep], 'next'],
            });
            onNext?.();
          }}
        >
          {t('next')}
        </Button>
      )}
      {onConfirm && (
        <Button
          onClick={() => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: [
                'import_sys-ip',
                trackingStepName[currentStep],
                'confirm',
              ],
            });
            onConfirm?.();
          }}
        >
          {t('confirm')}
        </Button>
      )}
    </div>
  );
}

export default ModalButtonGroup;

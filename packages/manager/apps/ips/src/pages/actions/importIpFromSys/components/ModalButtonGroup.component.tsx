import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

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
    <div className="z-[2] mt-4 flex gap-3" slot="actions">
      {onCancel && (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('cancel')}
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
        />
      )}
      {onPrevious && (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.ghost}
          label={t('previous')}
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
        />
      )}
      {onNext && (
        <OdsButton
          label={t('next')}
          isDisabled={isNextButtonDisabled}
          isLoading={isNextButtonLoading}
          onClick={() => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['import_sys-ip', trackingStepName[currentStep], 'next'],
            });
            onNext?.();
          }}
        />
      )}
      {onConfirm && (
        <OdsButton
          label={t('confirm')}
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
        />
      )}
    </div>
  );
}

export default ModalButtonGroup;

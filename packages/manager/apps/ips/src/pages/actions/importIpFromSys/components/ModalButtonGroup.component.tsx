import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

type ModalButtonGroupProps = {
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
}: ModalButtonGroupProps) {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  return (
    <div className="flex mt-4 gap-3 z-[2]" slot="actions">
      {onCancel && (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('cancel')}
          onClick={onCancel}
        />
      )}
      {onPrevious && (
        <OdsButton
          variant={ODS_BUTTON_VARIANT.ghost}
          label={t('previous')}
          onClick={onPrevious}
        />
      )}
      {onNext && (
        <OdsButton
          label={t('next')}
          onClick={onNext}
          isDisabled={isNextButtonDisabled}
          isLoading={isNextButtonLoading}
        />
      )}
      {onConfirm && <OdsButton label={t('confirm')} onClick={onConfirm} />}
    </div>
  );
}

export default ModalButtonGroup;

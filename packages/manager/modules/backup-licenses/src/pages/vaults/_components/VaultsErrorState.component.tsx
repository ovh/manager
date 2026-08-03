import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

export type VaultsErrorStateProps = {
  onRetry: () => void;
};

export const VaultsErrorState = ({ onRetry }: VaultsErrorStateProps) => {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.VAULTS);

  return (
    <OdsMessage color={ODS_MESSAGE_COLOR.critical} isDismissible={false}>
      <div className="flex flex-wrap items-center gap-4">
        <span>{t('state.error.message')}</span>
        <OdsButton
          data-testid="vaults-retry"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('state.error.retry')}
          onClick={onRetry}
        />
      </div>
    </OdsMessage>
  );
};

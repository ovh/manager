import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

interface BillingErrorProps {
  onRetry: () => void;
}

/**
 * Calque exact de `LinkedServersError` (§8 de la spec BKP-1225) : réservé à l'échec de
 * résolution des vaults, l'utilisateur garde ses onglets et le réessai est un `refetch()`
 * ciblé plutôt qu'un rechargement complet.
 */
export default function BillingError({ onRetry }: BillingErrorProps) {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.BILLING, NAMESPACES.ACTIONS]);

  return (
    <OdsMessage color={ODS_MESSAGE_COLOR.critical} isDismissible={false}>
      <div className="flex flex-wrap items-center gap-4">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${BACKUP_LICENSES_NAMESPACES.BILLING}:error.loading`)}
        </OdsText>
        <OdsButton
          data-testid="billing-retry"
          variant={ODS_BUTTON_VARIANT.outline}
          size={ODS_BUTTON_SIZE.sm}
          label={t(`${NAMESPACES.ACTIONS}:retry`)}
          onClick={onRetry}
        />
      </div>
    </OdsMessage>
  );
}

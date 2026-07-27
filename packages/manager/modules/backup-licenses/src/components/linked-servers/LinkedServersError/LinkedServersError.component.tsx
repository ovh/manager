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

interface LinkedServersErrorProps {
  onRetry: () => void;
}

/**
 * Échec du chargement de la liste. Traité dans l'onglet, et non par un `ErrorBanner` pleine
 * page : l'utilisateur garde ses onglets, et le réessai est un `refetch()` ciblé plutôt qu'un
 * rechargement complet. L'`ErrorBanner` reste réservé à l'échec de résolution du service.
 */
export default function LinkedServersError({ onRetry }: LinkedServersErrorProps) {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS, NAMESPACES.ACTIONS]);

  return (
    <OdsMessage color={ODS_MESSAGE_COLOR.critical} isDismissible={false}>
      <div className="flex flex-wrap items-center gap-4">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:error.loading`)}
        </OdsText>
        <OdsButton
          data-testid="linked-servers-retry"
          variant={ODS_BUTTON_VARIANT.outline}
          size={ODS_BUTTON_SIZE.sm}
          label={t(`${NAMESPACES.ACTIONS}:retry`)}
          onClick={onRetry}
        />
      </div>
    </OdsMessage>
  );
}

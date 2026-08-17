import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

interface BillingTopbarProps {
  isLoading: boolean;
  onRefresh: () => void;
}

/**
 * Bouton textuel `ghost`, comme `LinkedServersTopbar`, et non le bouton icône seule de
 * `backup-agent` : la cohérence interne au module prime (§8/§13 de la spec BKP-1225).
 */
export default function BillingTopbar({ isLoading, onRefresh }: BillingTopbarProps) {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <OdsButton
      id="refresh-billing"
      data-testid="refresh-billing"
      variant={ODS_BUTTON_VARIANT.ghost}
      size={ODS_BUTTON_SIZE.md}
      label={t('refresh')}
      isDisabled={isLoading}
      onClick={onRefresh}
    />
  );
}

import React from 'react';

import {
  BillingInformationsTileStandard,
} from '@ovh-ux/manager-billing-informations';

export type BillingInformationsTileProps = {
  resourceName: string;
};

/**
 * Subscription tile equivalent for Angular `billing-subscription-tile`.
 *
 * We rely on the shared "billing-informations" module, which is the React successor
 * used by other Manager apps.
 */
export function BillingInformationsTile({
  resourceName,
}: BillingInformationsTileProps) {
  return <BillingInformationsTileStandard resourceName={resourceName} />;
}

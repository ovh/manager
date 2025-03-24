import React, { useMemo } from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { BillingInformationsTileContext } from './BillingInformationsTile.context';
import { BillingInformationsCreationDate } from './components/CreationDate/CreationDate';
import { BillingInformationsEngagement } from './components/EngagementBadge/EngagementBadge';
import { BillingInformationsNextBilling } from './components/NextBillingDate/NextBillingDate';
import { BillingInformationsState } from './components/State/State';
import { BillingInformationsResiliateLink } from './components/ResiliateLink/ResiliateLink';

export type BillingInformationsTileProps = {
  resourceName?: string;
} & React.PropsWithChildren;

export default function BillingInformationsTile({
  resourceName,
  children,
}: BillingInformationsTileProps) {
  const BillingInformationsTileContextValues = useMemo(
    () => ({
      resourceName,
    }),
    [resourceName],
  );
  return (
    <BillingInformationsTileContext.Provider
      value={BillingInformationsTileContextValues}
    >
      <ManagerTile>{children}</ManagerTile>
    </BillingInformationsTileContext.Provider>
  );
}

BillingInformationsTile.Title = ManagerTile.Title;
BillingInformationsTile.Item = ManagerTile.Item;
BillingInformationsTile.Divider = ManagerTile.Divider;
BillingInformationsTile.EngagementBadge = BillingInformationsEngagement;
BillingInformationsTile.CreationDate = BillingInformationsCreationDate;
BillingInformationsTile.NextBillingDate = BillingInformationsNextBilling;
BillingInformationsTile.State = BillingInformationsState;
BillingInformationsTile.ResiliateLink = BillingInformationsResiliateLink;

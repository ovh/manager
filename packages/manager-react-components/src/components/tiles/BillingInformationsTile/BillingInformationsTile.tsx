import React from 'react';
import { BillingInformationContext } from './BillingInformationsContext';
import { ManagerTile } from '../../content/ManagerTile/manager-tile.component';
import { BillingInformationsContacts } from './Items/Contacts/Contacts';
import { BillingInformationsCreationDate } from './Items/CreationDate/CreationDate';
import { BillingInformationsEngagement } from './Items/EngagementBadge/EngagementBadge';
import { BillingInformationsNextBilling } from './Items/NextBillingDate/NextBillingDate';
import { BillingInformationsState } from './Items/State/State';
import { BillingInformationsResiliateLink } from './Items/ResiliateLink/ResiliateLink';

export type BillingInformationsTileProps = {
  resourceName?: string;
} & React.PropsWithChildren;

export const BillingInformationsTile = ({
  resourceName,
  children,
}: BillingInformationsTileProps) => {
  return (
    <BillingInformationContext.Provider value={{ resourceName }}>
      <ManagerTile>{children}</ManagerTile>
    </BillingInformationContext.Provider>
  );
};

BillingInformationsTile.Title = ManagerTile.Title;
BillingInformationsTile.Item = ManagerTile.Item;
BillingInformationsTile.Divider = ManagerTile.Divider;
BillingInformationsTile.Contacts = BillingInformationsContacts;
BillingInformationsTile.EngagementBadge = BillingInformationsEngagement;
BillingInformationsTile.CreationDate = BillingInformationsCreationDate;
BillingInformationsTile.NextBillingDate = BillingInformationsNextBilling;
BillingInformationsTile.State = BillingInformationsState;
BillingInformationsTile.ResiliateLink = BillingInformationsResiliateLink;

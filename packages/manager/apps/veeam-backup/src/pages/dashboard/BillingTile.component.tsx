import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import { VeeamBackup } from '@ovh-ux/manager-module-vcd-api';
import { BillingLink } from '@/components/Links/BillingLink.component';

import { ConsumedVms } from './ConsumedVms.component';
import { OfferProgress } from './OfferProgress.component';
import { ActivateOfferGold } from './ActivateOfferGold.component';

type BillingTileProps = {
  id: string;
  backup: VeeamBackup;
};

export const BillingTile: React.FC<BillingTileProps> = ({ id, backup }) => {
  const { t } = useTranslation('dashboard');
  const hasGoldOffer = backup?.currentState.offers.some(
    (offer) => offer.name === 'GOLD',
  );

  const consumedVmsItem = {
    id: 'consumedVms',
    label: t('consumed_vms'),
    value: <ConsumedVms id={id} backup={backup} />,
  };

  const billingLinkItem = {
    id: 'billingModalities',
    value: <BillingLink className="tile__link--breakable" />,
  };

  const offerItems = (backup?.currentState.offers || []).map((offer) => ({
    id: offer.name,
    label: `${offer.name.charAt(0).toUpperCase()}${offer.name
      .slice(1)
      .toLowerCase()}`,
    value: <OfferProgress offer={offer} id={id} />,
  }));

  const goldItem = !hasGoldOffer
    ? {
        id: 'gold',
        label: 'Gold',
        value: ActivateOfferGold(id),
      }
    : null;
  return (
    <DashboardTile
      title={t('billing')}
      items={[consumedVmsItem, ...offerItems, goldItem, billingLinkItem].filter(
        Boolean,
      )}
    />
  );
};

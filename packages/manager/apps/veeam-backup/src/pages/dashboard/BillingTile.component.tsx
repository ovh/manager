import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import { VeeamBackup } from '@ovh-ux/manager-module-vcd-api';
import { BillingLink } from '@/components/Links/BillingLink.component';

import { ConsumedVms } from './ConsumedVms.component';
import { OfferProgress } from './OfferProgress.component';
import { ActivateOfferGold } from './ActivateOfferGold.component';
import { OFFER_CREATING_STATUS, GOLD_OFFER_LABEL } from '@/constants';

type BillingTileProps = {
  id: string;
  backup: VeeamBackup;
};

const capitalize = (label: string) =>
  `${label.charAt(0).toUpperCase()}${label.slice(1).toLowerCase()}`;

export const BillingTile: React.FC<BillingTileProps> = ({ id, backup }) => {
  const { t } = useTranslation('dashboard');

  const offers = backup?.currentState.offers || [];
  const goldOffer = offers.find((offer) => offer.name === 'GOLD');
  const isGoldOfferEnabled =
    !!goldOffer && goldOffer?.status !== OFFER_CREATING_STATUS;

  const bronzeAndSilverItems = offers
    .filter((offer) => offer.name !== 'GOLD')
    .map((offer) => ({
      id: offer.name,
      label: capitalize(offer.name),
      value: <OfferProgress offer={offer} id={id} />,
    }));

  const goldItem = {
    id: 'gold',
    label: GOLD_OFFER_LABEL,
    value: isGoldOfferEnabled ? (
      <OfferProgress offer={goldOffer} id={id} />
    ) : (
      <ActivateOfferGold id={id} status={goldOffer?.status} />
    ),
  };

  const consumedVmsItem = {
    id: 'consumedVms',
    label: t('consumed_vms'),
    value: <ConsumedVms id={id} backup={backup} />,
  };

  const billingLinkItem = {
    id: 'billingModalities',
    value: <BillingLink />,
  };

  return (
    <DashboardTile
      title={t('billing')}
      items={[
        consumedVmsItem,
        ...bronzeAndSilverItems,
        goldItem,
        billingLinkItem,
      ].filter(Boolean)}
    />
  );
};

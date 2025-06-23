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

  return (
    <DashboardTile
      title={t('billing')}
      items={[
        {
          id: 'consumedVms',
          label: t('consumed_vms'),
          value: <ConsumedVms id={id} backup={backup} />,
        },
        ...(backup?.currentState?.offers?.map((offer) => ({
          id: offer.name,
          label: `${offer.name.at(0).toUpperCase()}${offer.name
            .substring(1)
            .toLowerCase()}`,
          value: <OfferProgress offer={offer} id={id} />,
        })) || []),
        backup?.currentState.offers.every((offer) => offer.name !== 'GOLD') && {
          id: 'gold',
          label: 'Gold',
          value: <ActivateOfferGold id={id} />,
        },
        {
          id: 'bilingModalities',
          value: <BillingLink />,
        },
      ].filter(Boolean)}
    />
  );
};

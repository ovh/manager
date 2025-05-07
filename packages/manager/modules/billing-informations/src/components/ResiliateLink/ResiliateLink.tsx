import React from 'react';
import '../../translations';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  Links,
  LinksProps,
  LinkType,
  ManagerTile,
} from '@ovh-ux/manager-react-components';
import { useBillingInformationsContextServiceDetails } from '../../BillingInformationsTile.context';

export const BillingInformationsResiliateLink = (
  props: Partial<LinksProps>,
) => {
  const { t } = useTranslation('billing-informations-tile');
  const {
    data: serviceDetails,
    isLoading,
  } = useBillingInformationsContextServiceDetails();
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Description>
        {isLoading ? (
          <OdsSkeleton className="part-skeleton:max-w-xs" />
        ) : (
          <Links
            className="part-link:py-2"
            label={t('billing_informations_tile_field_label_resiliate')}
            isDisabled={
              serviceDetails?.billing.lifecycle.current.state === 'terminated'
            }
            type={LinkType.next}
            {...props}
          />
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};

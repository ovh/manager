import '../../translations';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '../../../../content/ManagerTile/manager-tile.component';
import { ServiceStateBadge } from '../../../../ServiceStateBadge/ServiceStateBadge';
import { useBillingInformationContextServiceDetails } from '../../BillingInformationsContext';

export const BillingInformationsState = () => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } =
    useBillingInformationContextServiceDetails();

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('billing_informations_tile_field_label_state')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {isLoading ? (
          <OdsSkeleton className="part-skeleton:max-w-xs" />
        ) : (
          <span>
            <ServiceStateBadge state={serviceDetails?.resource?.state} />
          </span>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};

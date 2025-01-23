import '../../translations';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '../../../../content/ManagerTile/manager-tile.component';
import { useBillingInformationContextServiceDetails } from '../../BillingInformationsContext';
import { Links, LinksProps, LinkType } from '../../../../typography';

export const BillingInformationsResiliateLink = (
  props: Partial<LinksProps>,
) => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } =
    useBillingInformationContextServiceDetails();
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

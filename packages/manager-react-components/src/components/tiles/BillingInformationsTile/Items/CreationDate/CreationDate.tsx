import '../../translations';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { DateFormat } from '../../../../../hooks';
import { ManagerTile } from '../../../../content/ManagerTile/manager-tile.component';
import { FormattedDate } from '../../../../formatted-date/FormattedDate';
import { useBillingInformationContextServiceDetails } from '../../BillingInformationsContext';

export const BillingInformationsCreationDate = () => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } =
    useBillingInformationContextServiceDetails();

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('billing_informations_tile_field_label_creation_date')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {isLoading ? (
          <OdsSkeleton className="part-skeleton:max-w-xs" />
        ) : (
          <OdsText preset={ODS_TEXT_PRESET.span}>
            <FormattedDate
              dateString={
                serviceDetails?.billing.lifecycle.current.creationDate
              }
              format={DateFormat.compact}
            />
          </OdsText>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};

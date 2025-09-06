import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { DateFormat, ManagerTile, useFormattedDate } from '@ovh-ux/manager-react-components';

import { useBillingInformationsContextServiceDetails } from '../../BillingInformationsTile.context';
import '../../translations';

export const BillingInformationsCreationDate = () => {
  const { t } = useTranslation('billing-informations-tile');
  const { data: serviceDetails, isLoading } = useBillingInformationsContextServiceDetails();
  const formattedDate = useFormattedDate({
    dateString: serviceDetails?.billing.lifecycle.current.creationDate ?? '',
    format: DateFormat.fullDisplay,
  });

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('billing_informations_tile_field_label_creation_date')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        {isLoading ? (
          <OdsSkeleton className="part-skeleton:max-w-xs" />
        ) : (
          <OdsText preset={ODS_TEXT_PRESET.span}>{formattedDate}</OdsText>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};

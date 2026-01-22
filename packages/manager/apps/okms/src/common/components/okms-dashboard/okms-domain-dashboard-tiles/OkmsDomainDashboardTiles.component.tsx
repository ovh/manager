import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';

import { SECRET_MANAGER_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';

import { PageSpinner } from '../../page-spinner/PageSpinner.component';
import { BillingTile } from '../billing-tile/BillingTile.component';
import { GeneralInformationsTile } from '../general-informations-tile/GeneralInformationsTile.component';
import { KmipObjectsTile } from '../kmip-objects-tile/KmipObjectsTile.component';
import { KmipTile } from '../kmip-tile/KmipTile.component';
import { RestApiTile } from '../rest-api-tile/RestApiTile.component';
import { SecretConfigTile } from '../secret-config-tile/SecretConfigTile.component';
import { SecretsTile } from '../secrets-tile/SecretsTile.component';
import { ServiceKeysTile } from '../service-keys-tile/ServiceKeysTile.component';
import { OKMS_DOMAIN_DASHBOARD_TILES_TEST_IDS } from './OkmsDomainDashboardTiles.constants';

type OkmsDomainDashboardTilesProps = {
  okms: OKMS;
};

export const OkmsDomainDashboardTiles = ({ okms }: OkmsDomainDashboardTilesProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const { data: features, isPending } = useFeatureAvailability([SECRET_MANAGER_FEATURES.PRODUCT]);

  if (isPending) {
    return <PageSpinner />;
  }

  return (
    <div
      className="flex flex-col gap-8"
      data-testid={OKMS_DOMAIN_DASHBOARD_TILES_TEST_IDS.okmsDashboardTiles}
    >
      <section className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xxl:grid-cols-4">
        <GeneralInformationsTile okms={okms} />
        <KmipTile okms={okms} />
        <RestApiTile okms={okms} />
        {features?.[SECRET_MANAGER_FEATURES.PRODUCT] && <SecretConfigTile okms={okms} />}
      </section>
      <section className="flex flex-col gap-4">
        <Text preset="heading-3">{t('okms_services')}</Text>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xxl:grid-cols-4">
          <BillingTile okms={okms} />
          {features?.[SECRET_MANAGER_FEATURES.PRODUCT] && <SecretsTile okms={okms} />}
          <ServiceKeysTile okms={okms} />
          <KmipObjectsTile okms={okms} />
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { OKMS } from '@key-management-service/types/okms.type';
import { GeneralInformationsTile } from './generalInformationsTile/GeneralInformationsTile.component';
import { KmipTile } from './kmipTile/KmipTile.component';
import { RestApiTile } from './restApiTile/RestApiTile.component';
import { BillingTile } from './billingTile/BillingTile.component';
import { SecretConfigTile } from './secretConfigTile/SecretConfigTile.component';
import { SecretsTile } from './secretsTile/SecretsTile.component';
import { ServiceKeysTile } from './serviceKeysTile/ServiceKeysTile.component';
import { KmipObjectsTile } from './kmipObjectsTile/KmipObjectsTile.component';

type OkmsDomainDashboardTilesProps = {
  okms: OKMS;
};

export const OkmsDomainDashboardTiles = ({
  okms,
}: OkmsDomainDashboardTilesProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        <GeneralInformationsTile okms={okms} />
        <KmipTile okms={okms} />
        <RestApiTile okms={okms} />
        <BillingTile okms={okms} />
        <SecretConfigTile okms={okms} />
      </section>
      <section className="flex flex-col gap-4">
        <OdsText preset="heading-3">{t('okms_services')}</OdsText>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          <SecretsTile okms={okms} />
          <ServiceKeysTile okms={okms} />
          <KmipObjectsTile okms={okms} />
        </div>
      </section>
    </div>
  );
};

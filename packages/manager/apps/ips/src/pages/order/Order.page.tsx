import React from 'react';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsBadge, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { urls } from '@/routes/routes.constant';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { IpVersionSection } from './IpVersionSection.component';
import { ServiceSelectionSection } from './ServiceSelectionSection.component';
import { RegionSelectionSection } from './RegionSelectionSection.component';
import { IpVersion } from './order.constant';

export const OrderPage: React.FC = () => {
  const { t } = useTranslation('order');
  const navigate = useNavigate();
  const [ipVersion, setIpVersion] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState(null);

  return (
    <BaseLayout
      backLinkLabel={t('back_link')}
      onClickReturn={() => navigate(urls.listing)}
      header={{
        title: t('title'),
      }}
      breadcrumb={<Breadcrumb />}
    >
      <IpVersionSection ipVersion={ipVersion} setIpVersion={setIpVersion} />
      {ipVersion === IpVersion.ipv4 && (
        <ServiceSelectionSection
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
      )}
      {ipVersion === IpVersion.ipv4 && !!selectedService && (
        <RegionSelectionSection
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
      )}
    </BaseLayout>
  );
};

export default OrderPage;

import React from 'react';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constant';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { IpVersionSection } from './IpVersionSection.component';
import { ServiceSelectionSection } from './ServiceSelectionSection.component';
import { RegionSelectionSection } from './RegionSelectionSection.component';
import { IpVersion } from './order.constant';
import { OfferSelectionSection } from './OfferSelectionSection.component';
import { GeolocationSection } from './GeolocationSection.component';
import { OrganisationSection } from './OrganisationSection.component';
import { useAdditionalIpsOrder } from './order.utils';

export const OrderPage: React.FC = () => {
  const { t } = useTranslation('order');
  const navigate = useNavigate();
  const [ipVersion, setIpVersion] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState(null);
  const [selectedOffer, setSelectedOffer] = React.useState(null);
  const [selectedPlanCode, setSelectedPlanCode] = React.useState(null);
  const [selectedGeolocation, setSelectedGeolocation] = React.useState(null);
  const [selectedOrganisation, setSelectedOrganisation] = React.useState(null);
  const { getExpressOrderLink } = useAdditionalIpsOrder();

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
      {ipVersion === IpVersion.ipv4 &&
        !!selectedService &&
        !!selectedRegion && (
          <OfferSelectionSection
            ipVersion={ipVersion}
            selectedRegion={selectedRegion}
            selectedOffer={selectedOffer}
            setSelectedOffer={setSelectedOffer}
            setSelectedPlanCode={setSelectedPlanCode}
            selectedPlanCode={selectedPlanCode}
          />
        )}
      {ipVersion === IpVersion.ipv4 &&
        !!selectedService &&
        !!selectedOffer &&
        !!selectedRegion &&
        !!selectedPlanCode && (
          <GeolocationSection
            setSelectedGeolocation={setSelectedGeolocation}
            selectedGeolocation={selectedGeolocation}
            selectedPlanCode={selectedPlanCode}
            selectedRegion={selectedRegion}
          />
        )}
      {ipVersion === IpVersion.ipv4 &&
        !!selectedService &&
        !!selectedOffer &&
        !!selectedRegion &&
        !!selectedPlanCode &&
        !!selectedGeolocation && (
          <OrganisationSection
            selectedOrganisation={selectedOrganisation}
            setSelectedOrganisation={setSelectedOrganisation}
          />
        )}
      {ipVersion &&
        selectedService &&
        selectedOffer &&
        selectedRegion &&
        selectedPlanCode &&
        selectedGeolocation &&
        selectedOrganisation && (
          <div className="flex gap-3">
            <OdsButton
              color={ODS_BUTTON_COLOR.primary}
              size={ODS_BUTTON_SIZE.md}
              label={t('order_button_label')}
              onClick={() => {
                window.open(
                  getExpressOrderLink({
                    ipVersion,
                    geolocation: selectedGeolocation,
                    offer: selectedOffer,
                    organisation: selectedOrganisation,
                    planCode: selectedPlanCode,
                    region: selectedRegion,
                    serviceName: selectedService,
                  }),
                  '_blank',
                  'noopener,noreferrer',
                );
                navigate(urls.listing);
              }}
            />
            <OdsButton
              color={ODS_BUTTON_COLOR.primary}
              size={ODS_BUTTON_SIZE.md}
              variant={ODS_BUTTON_VARIANT.ghost}
              label={t('cancel_button_label')}
              onClick={() => navigate(urls.listing)}
            />
          </div>
        )}
    </BaseLayout>
  );
};

export default OrderPage;

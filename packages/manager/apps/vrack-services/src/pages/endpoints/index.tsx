import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OsdsIcon,
  OsdsButton,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { OnboardingLayout, PageLayout } from '@/components/layout-helpers';
import { hasSubnet, isEditable, useVrackService } from '@/utils/vs-utils';
import { EndpointDatagrid } from './components/EndpointDataGrid';
import { urls } from '@/router/constants';

const Endpoints: React.FC = () => {
  const { t } = useTranslation('vrack-services/endpoints');
  const { data: vrackServices, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const navigateToCreateEndpointPage = async () => {
    trackClick({
      path: 'endpoints',
      value: '::create-endpoint',
      type: 'action',
    });
    navigate(urls.createEndpoint.replace(':id', id));
  };

  if (isLoading) {
    return (
      <div className="mt-5">
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
      </div>
    );
  }

  if (
    vrackServices?.currentState.subnets.some(
      (subnet) => subnet.serviceEndpoints.length > 0,
    ) ||
    vrackServices?.targetSpec.subnets.some(
      (subnet) => subnet.serviceEndpoints.length > 0,
    )
  ) {
    return (
      <PageLayout noBreacrumb>
        <OsdsButton
          disabled={!isEditable(vrackServices) || undefined}
          className="my-4"
          inline
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={navigateToCreateEndpointPage}
        >
          {t('createEndpointButtonLabel')}
          <span slot="start">
            <OsdsIcon
              name={ODS_ICON_NAME.ADD}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
        </OsdsButton>

        <section>
          <EndpointDatagrid />
        </section>
      </PageLayout>
    );
  }

  return (
    <OnboardingLayout
      secondaryButtonLabel={t('createEndpointButtonLabel')}
      secondaryOnClick={navigateToCreateEndpointPage}
      secondaryButtonIcon={ODS_ICON_NAME.ADD}
      secondaryButtonSize={ODS_BUTTON_SIZE.sm}
      secondaryButtonIconPosition="start"
      secondaryButtonDisabled={
        !isEditable(vrackServices) || !hasSubnet(vrackServices) || undefined
      }
      title={t('onboardingTitle')}
      description={t('onboardingDescription')}
      imageSrc={onboardingImgSrc}
      noBreadcrumb
    />
  );
};

export default Endpoints;

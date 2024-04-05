import React from 'react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OnboardingLayout } from '@/components/layout-helpers/OnboardingLayout';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { hasSubnet, isEditable, useVrackService } from '@/utils/vs-utils';
import { urls } from '@/router/constants';
import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  getClickProps,
} from '@/utils/tracking';

export default function EndpointsOnboarding() {
  const { t } = useTranslation('vrack-services/endpoints');
  const { data: vrackServices } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    shell: {
      tracking: { trackClick },
    },
  } = React.useContext(ShellContext);

  const navigateToCreateEndpointPage = async () => {
    trackClick(
      getClickProps({
        pageType: PageType.onboarding,
        pageName: PageName.endpoints,
        buttonType: ButtonType.button,
        location: PageLocation.page,
        actions: ['create-endpoint'],
      }),
    );
    navigate(urls.createEndpoint.replace(':id', id));
  };

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
}

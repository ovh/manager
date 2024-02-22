import React from 'react';
import {
  ODS_SPINNER_SIZE,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsMessage,
  OsdsIcon,
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OnboardingLayout } from '@/components/layout-helpers/OnboardingLayout';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { isEditable, useVrackService } from '@/utils/vs-utils';
import { PageLayout } from '@/components/layout-helpers';
import { SubnetDatagrid } from './components/SubnetDataGrid';
import { urls } from '@/router/constants';

const Subnets: React.FC = () => {
  const { t } = useTranslation('vrack-services/subnets');
  const { data: vrackServices, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const navigateToCreateSubnetPage = async () => {
    trackClick({
      path: 'subnets',
      value: '::create-subnet',
      type: 'action',
    });
    navigate(urls.createSubnet.replace(':id', id));
  };

  if (isLoading) {
    return (
      <div className="mt-5">
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
      </div>
    );
  }

  if (
    vrackServices?.currentState.subnets.length === 0 &&
    vrackServices?.targetSpec.subnets.length === 0
  ) {
    return (
      <OnboardingLayout
        secondaryButtonLabel={t('createSubnetButtonLabel')}
        secondaryOnClick={navigateToCreateSubnetPage}
        secondaryButtonIcon={ODS_ICON_NAME.ADD}
        secondaryButtonSize={ODS_BUTTON_SIZE.sm}
        secondaryButtonIconPosition="start"
        secondaryButtonDisabled={!isEditable(vrackServices) || undefined}
        secondaryButtonDataTracking="vrack-services::subnets::create-subnet"
        title={t('onboardingTitle')}
        description={t('onboardingDescription')}
        imageSrc={onboardingImgSrc}
        noBreadcrumb
      />
    );
  }

  return (
    <PageLayout noBreacrumb>
      <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.info}>
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('betaSubnetLimitMessage')}
        </OsdsText>
      </OsdsMessage>
      <OsdsButton
        // Disabled because for the beta user can only have 1 subnet per vRack Services
        disabled
        // TODO: Uncomment after the beta
        // disabled={!isEditable(vrackServices) || undefined}
        className="my-4"
        inline
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={navigateToCreateSubnetPage}
      >
        {t('createSubnetButtonLabel')}
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
      </OsdsButton>

      <section>
        <SubnetDatagrid />
      </section>
    </PageLayout>
  );
};

export default Subnets;

import React from 'react';
import i18next from 'i18next';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OnboardingLayout } from '@/components/layout-helpers/OnboardingLayout';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { isEditable, useVrackService } from '@/utils/vs-utils';
import { ErrorPage } from '@/components/Error';
import { PageLayout } from '@/components/layout-helpers';
import { SubnetDatagrid } from './components/SubnetDataGrid';

export function breadcrumb() {
  return i18next.t('vrack-services/dashboard:subnetsTabLabel');
}

const Subnets: React.FC = () => {
  const { t } = useTranslation('vrack-services/subnets');
  const { data: vrackServices, error, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();

  const navigateToCreateSubnetPage = () =>
    navigate(`/${id}/createsubnet`, { replace: true });

  if (error) {
    return <ErrorPage error={error} />;
  }

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
        title={t('onboardingTitle')}
        description={t('onboardingDescription')}
        imageSrc={onboardingImgSrc}
        noBreadcrumb
      />
    );
  }

  return (
    <PageLayout noBreacrumb>
      <OsdsButton
        disabled={!isEditable(vrackServices) || undefined}
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

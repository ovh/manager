import React from 'react';
import i18next from 'i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components/icon';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components/button';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '../../../components/layout-helpers/OnboardingLayout';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { useVrackService } from './utils';
import { ApiError, ErrorPage } from '@/components/Error';
import { PageLayout } from '@/components/layout-helpers';

export function breadcrumb() {
  return i18next.t('vrack-services/dashboard:subnetsTabLabel');
}

const Subnets: React.FC = () => {
  const { t } = useTranslation('vrack-services/subnets');
  const { data: vrackServices, error, isLoading } = useVrackService();
  const { id } = useParams();
  const navigate = useNavigate();

  if (error) {
    return <ErrorPage error={error as ApiError} />;
  }

  if (isLoading) {
    return (
      <div>
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
      </div>
    );
  }

  if (vrackServices?.currentState.subnets.length === 0) {
    return (
      <OnboardingLayout
        secondaryButtonLabel={t('onboardingButtonLabel')}
        secondaryOnClick={() =>
          navigate(`/createSubnet?vs=${id}`, { replace: true })
        }
        secondaryButtonIcon={ODS_ICON_NAME.ADD}
        secondaryButtonSize={ODS_BUTTON_SIZE.sm}
        secondaryButtonIconPosition="start"
        title={t('onboardingTitle')}
        description={t('onboardingDescription')}
        imageSrc={onboardingImgSrc}
        noBreadcrumb
      />
    );
  }

  return <PageLayout noBreacrumb>datagrid</PageLayout>;
};

export default Subnets;

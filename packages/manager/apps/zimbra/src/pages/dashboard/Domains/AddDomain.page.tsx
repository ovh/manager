import React from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useGenerateUrl } from '@/hooks';
import { ADD_DOMAIN } from '@/tracking.constant';
import AddDomainForm from './AddDomainForm.component';

export default function AddDomain() {
  const { t } = useTranslation(['domains/form', 'common']);
  const navigate = useNavigate();
  const { trackPage } = useOvhTracking();
  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const goBack = () => navigate(goBackUrl);

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: ADD_DOMAIN,
    });
    addSuccess(
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('common:add_success_message')}
      </OdsText>,
      true,
    );
  };

  const onError = (error: ApiError) => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: ADD_DOMAIN,
    });
    addError(
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('common:add_error_message', {
          error: error?.response?.data?.message,
        })}
      </OdsText>,
      true,
    );
  };

  return (
    <AddDomainForm
      onSuccess={onSuccess}
      onError={onError}
      onSettled={goBack}
      backUrl=".."
      pageTrackingName={ADD_DOMAIN}
    />
  );
}

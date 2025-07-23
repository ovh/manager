import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useGenerateUrl } from '@/hooks';
import { ADD_DOMAIN } from '@/tracking.constants';

import DomainForm from '../DomainForm.component';

export const AddDomain = () => {
  const { t } = useTranslation(['domains/form', 'common']);
  const navigate = useNavigate();
  const { trackPage } = useOvhTracking();
  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: ADD_DOMAIN,
    });
    addSuccess(
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('common:add_success_message')}</OdsText>,
      true,
    );
    navigate(goBackUrl);
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
    <DomainForm
      onSuccess={onSuccess}
      onError={onError}
      backUrl=".."
      pageTrackingName={ADD_DOMAIN}
    />
  );
};

export default AddDomain;

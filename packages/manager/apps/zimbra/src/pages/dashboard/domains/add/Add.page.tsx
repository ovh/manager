import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';

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
    addSuccess(<Text preset={TEXT_PRESET.paragraph}>{t('common:add_success_message')}</Text>, true);
    navigate(goBackUrl);
  };

  const onError = (error: ApiError) => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: ADD_DOMAIN,
    });
    addError(
      <Text preset={TEXT_PRESET.paragraph}>
        {t('common:add_error_message', {
          error: error?.response?.data?.message,
        })}
      </Text>,
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

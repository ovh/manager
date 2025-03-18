import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import AddDomainForm from '@/pages/dashboard/Domains/AddDomainForm.component';
import { ONBOARDING_CONFIGURE_DOMAIN } from '@/tracking.constant';
import { useDomains, useGenerateUrl, useOrganizationList } from '@/hooks';

export const ConfigureDomain: React.FC = () => {
  const { trackPage } = useOvhTracking();
  const { addError } = useNotifications();
  const navigate = useNavigate();
  const { data: organizations } = useOrganizationList({ gcTime: 0 });
  const { data: domains } = useDomains();
  const { t } = useTranslation(['onboarding', 'common']);
  const configureOrganizationUrl = useGenerateUrl('../organization', 'path');
  const configureEmailUrl = useGenerateUrl('../email_accounts', 'path');
  const next = () => navigate(configureEmailUrl);
  const previous = () => navigate(configureOrganizationUrl);

  useEffect(() => {
    // domain already configured, redirect to emails
    if (domains && domains.length) {
      next();
    }
  }, [domains]);

  useEffect(() => {
    // organisation not already configured, redirect to orgs
    if (organizations && organizations.length) {
      previous();
    }
  }, [domains]);

  const onError = (error: ApiError) => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: ONBOARDING_CONFIGURE_DOMAIN,
    });
    addError(
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('common:add_error_message', {
          error: error.response?.data?.message,
        })}
      </OdsText>,
      true,
    );
  };

  return (
    <AddDomainForm
      subtitle={
        <OdsText preset={ODS_TEXT_PRESET.heading4}>
          {t('common:add_domain')}
        </OdsText>
      }
      organizationId={organizations?.[0]?.id}
      showOrganization={false}
      onError={onError}
      onSettled={(_, error) => {
        if (!error) {
          next();
        }
      }}
      pageTrackingName={ONBOARDING_CONFIGURE_DOMAIN}
      submitButtonLabel={`${t('common:next')} 2/3`}
    />
  );
};

export default ConfigureDomain;

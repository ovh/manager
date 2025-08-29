import React, { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { Loading } from '@/components';
import { useDomains } from '@/data/hooks';
import AddDomainForm from '@/pages/dashboard/domains/DomainForm.component';
import { ONBOARDING_CONFIGURE_DOMAIN } from '@/tracking.constants';

export const ConfigureDomain: React.FC = () => {
  const { t } = useTranslation(['onboarding', 'common', NAMESPACES.ACTIONS]);
  const { trackPage } = useOvhTracking();
  const { addError } = useNotifications();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organization');

  const { data: domains, isLoading: isLoadingDomains } = useDomains();
  const next = (domainId: string) => navigate(`../email_accounts?domain=${domainId}`);
  const previous = () => navigate('../organization');

  useEffect(() => {
    if (domains?.length) {
      next(domains[domains.length - 1].id);
    }
  }, [domains]);

  useEffect(() => {
    if (!organizationId) {
      previous();
    }
  }, [organizationId]);

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

  if (isLoadingDomains) {
    return <Loading />;
  }

  return (
    <AddDomainForm
      subtitle={<OdsText preset={ODS_TEXT_PRESET.heading4}>{t('common:add_domain')}</OdsText>}
      showOrganization={false}
      onError={onError}
      onSettled={(domain, error) => {
        if (domain && !error) {
          next(domain.id);
        }
      }}
      pageTrackingName={ONBOARDING_CONFIGURE_DOMAIN}
      submitButtonLabel={`${t(`${NAMESPACES.ACTIONS}:next`)} 2/3`}
    />
  );
};

export default ConfigureDomain;

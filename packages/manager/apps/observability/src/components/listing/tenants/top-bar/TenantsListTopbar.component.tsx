import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { getTenantCreationUrl } from '@/routes/Routes.utils';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export default function TenantsListTopbar() {
  const navigate = useNavigate();

  const { t } = useTranslation(['tenants']);
  const { selectedService, isLoading } = useObservabilityServiceContext();

  const addNewTenant = () => {
    navigate(getTenantCreationUrl({ resourceName: selectedService?.id ?? '' }));
  };

  return (
    <div className="mb-4 mr-4 flex w-full items-center justify-between">
      <Button
        id="create-tenant"
        onClick={addNewTenant}
        variant={BUTTON_VARIANT.default}
        urn={selectedService?.iam?.urn ?? ''}
        iamActions={IAM_ACTIONS.CREATE_TENANT}
        isIamTrigger={true}
        displayTooltip={true}
        disabled={isLoading}
        loading={isLoading}
      >
        {t('tenants:listing.create_tenant_button')}
      </Button>
    </div>
  );
}

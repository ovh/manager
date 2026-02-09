import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { getManagedDashboardCreationUrl } from '@/routes/Routes.utils';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export default function ManagedDashboardsListTopbar() {
  const navigate = useNavigate();

  const { t } = useTranslation(['managed-dashboards']);
  const { selectedService, isLoading } = useObservabilityServiceContext();

  const addNewManagedDashboard = () => {
    navigate(getManagedDashboardCreationUrl({ resourceName: selectedService?.id ?? '' }));
  };

  return (
    <div className="mb-4 mr-4 flex w-full items-center justify-between">
      <Button
        id="create-grafana"
        onClick={addNewManagedDashboard}
        variant={BUTTON_VARIANT.default}
        urn={selectedService?.iam?.urn ?? ''}
        iamActions={IAM_ACTIONS.CREATE_GRAFANA}
        displayTooltip={true}
        disabled={isLoading}
        loading={isLoading}
      >
        {t('managed-dashboards:listing.create_grafana_button')}
      </Button>
    </div>
  );
}

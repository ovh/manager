import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { ManagerButton } from '@ovh-ux/manager-react-components';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export default function TenantsListTopbar() {
  const navigate = useNavigate();

  const { t } = useTranslation(['tenants']);
  const { selectedService, isLoading } = useObservabilityServiceContext();

  const addNewTenant = () => {
    navigate('addNew');
  };

  return (
    <div className="flex justify-between w-full items-center mr-4">
      <ManagerButton
        id="assign-tag"
        label={t('tenants:listing.create_tenant_button')}
        onClick={addNewTenant}
        variant={ODS_BUTTON_VARIANT.default}
        urn={selectedService?.iam?.urn ?? ''}
        iamActions={IAM_ACTIONS.CREATE_TENANT}
        displayTooltip={true}
        isDisabled={isLoading}
        isLoading={isLoading}
      ></ManagerButton>
    </div>
  );
}

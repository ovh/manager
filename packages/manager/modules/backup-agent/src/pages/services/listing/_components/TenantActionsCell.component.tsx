import { useId } from 'react';

import { useNavigate } from 'react-router-dom';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { buildDeleteTenantUrl } from '@/utils/buildSearchQuery.utils';

export const TenantActionCell = (tenant: Resource<Tenant | VSPCTenant>) => {
  const id = useId();
  const navigate = useNavigate();

  return (
    <DataGridTextCell>
      <OdsButton
        id={id}
        label=""
        icon="trash"
        variant="ghost"
        onClick={() => {
          navigate(buildDeleteTenantUrl({ tenantId: tenant.id, origin: 'listing' }));
        }}
      />
    </DataGridTextCell>
  );
};

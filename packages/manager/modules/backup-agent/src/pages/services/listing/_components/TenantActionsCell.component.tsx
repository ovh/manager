import { useNavigate } from 'react-router-dom';

import {OdsButton, OdsTooltip} from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { buildDeleteTenantUrl } from '@/utils/buildSearchQuery.utils';
import {useId} from "react";
import { useTranslation } from "react-i18next";
import {BACKUP_AGENT_NAMESPACES, SERVICES_NAMESPACE_PREFIX} from "@/BackupAgent.translations";

export const TenantActionCell = (tenant: Resource<Tenant | VSPCTenant>) => {
  const id = useId();
  const navigate = useNavigate();
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.SERVICE_LISTING);

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
        isDisabled
      />
      <OdsTooltip triggerId={id} withArrow>{t(`${BACKUP_AGENT_NAMESPACES.SERVICE_LISTING}:delete_tenant_tooltip_disabled`)}</OdsTooltip>
    </DataGridTextCell>
  );
};

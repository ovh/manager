import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DatagridColumn } from '@ovh-ux/manager-react-components';

import {VSPCTenantWithAzName} from '@/types/VspcTenant.type';

import {
  TenantActionCell,
  TenantReferenceCell,
  VSPCTenantNameCell,
} from '../_components';

import {ResourceLocationCell} from "@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.components";
import {ResourceRegionCell} from "@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.components";
import {ResourceStatusCell} from "@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.components";
import {Resource} from "@/types/Resource.type";
import {TenantWithAzName} from "@/types/Tenant.type";

export function useVspcListingColumns(): DatagridColumn<Resource<TenantWithAzName | VSPCTenantWithAzName>>[] {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.REGION, NAMESPACES.STATUS]);

  return useMemo<DatagridColumn<Resource<TenantWithAzName | VSPCTenantWithAzName>>[]>(() => [
      {
        id: 'name',
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        isSortable: false,
        cell: VSPCTenantNameCell,
      },
      {
        id: 'location',
        label: t(`${NAMESPACES.REGION}:localisation`),
        isSortable: false,
        cell: ResourceLocationCell,
      },
      {
        id: 'region',
        label: t(`${NAMESPACES.REGION}:region`),
        isSortable: false,
        cell: ResourceRegionCell,
      },
      {
        id: 'reference',
        label: t(`${NAMESPACES.DASHBOARD}:reference`),
        isSortable: false,
        cell: TenantReferenceCell,
      },
      {
        id: 'status',
        label: t(`${NAMESPACES.STATUS}:status`),
        isSortable: false,
        cell: ResourceStatusCell,
      },
      {
        id: 'action',
        label: '',
        isSortable: false,
        cell: TenantActionCell,
      },
    ], [t]);
}

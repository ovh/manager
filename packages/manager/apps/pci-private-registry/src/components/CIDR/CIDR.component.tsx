import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  Headers,
  Notifications,
  PciGuidesHeader,
  useDataGrid,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { useCallback, useEffect } from 'react';
import {
  QueryClient,
  QueryKey,
  useMutationState,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useFormContext } from 'react-hook-form';
import {
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsSpinner,
  OsdsText,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import { useDatagridColumn } from '@/pages/CIDR/useDatagridColumn';
import Filters from '@/components/CIDR/Filters';
import {
  getRegistryQueyPrefixWithId,
  useIpRestrictions,
} from '@/api/hooks/useIpRestrictions';
import BreadcrumbCIDR from '@/components/CIDR/Breadcrumb';
import { TIPRestrictionsData } from '@/types';
import { useRegistry } from '@/api/hooks/useRegistry';

const createNewRow = (queryClient: QueryClient, key: QueryKey) =>
  queryClient.setQueryData(key, (oldData: TIPRestrictionsData[]) => [
    {
      id: oldData.length + 1,
      draft: true,
      checked: null,
    },
    ...oldData,
  ]);

export default function BlocCIDR() {
  const { t } = useTranslation(['ip-restrictions', 'common']);
  const { projectId, registryId } = useParams();
  const { data: project } = useProject();
  const queryClient = useQueryClient();
  const { pagination, setPagination } = useDataGrid();
  const { formState } = useFormContext();
  const columns = useDatagridColumn();

  const {
    addInfo,
    clearNotifications,
    addError,
    notifications,
  } = useNotifications();

  const { data: dataCIDR, isPending } = useIpRestrictions(
    projectId,
    registryId,
  );
  const { data: registry } = useRegistry(projectId, registryId, true);

  const variablesPending = useMutationState({
    filters: { status: 'pending' },
    select: (mutation) => mutation.state.variables,
  });

  useEffect(() => {
    if (!dataCIDR.length) {
      addInfo(t('private_registry_noCIDR'));
    }
  }, [dataCIDR, addInfo]);

  useEffect(() => clearNotifications, []);

  const createNewBlocsCIDR = useCallback(
    () =>
      createNewRow(
        queryClient,
        getRegistryQueyPrefixWithId(projectId, registryId, [
          'management',
          'registry',
        ]),
      ),
    [projectId, registryId],
  );

  if (isPending || variablesPending.length) {
    return (
      <OsdsSpinner
        inline
        size={ODS_SPINNER_SIZE.md}
        className="block text-center mt-5"
      />
    );
  }

  return (
    <>
      {project && <BreadcrumbCIDR />}

      <div className="header my-8">
        <Headers
          title={registry.name}
          headerButton={
            <div className="min-w-[7rem]">
              <PciGuidesHeader category="kubernetes" />
            </div>
          }
        />
        <OsdsText
          className="block mb-6"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('common:private_registry_manage_CIDR')}
        </OsdsText>
      </div>
      {Object.values(formState.errors)?.map((err) => (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
          key={err.message}
        >
          {t(err.message as string)}
        </OsdsMessage>
      ))}
      <Notifications />
      <div className="mt-8">
        <Filters createNewRow={createNewBlocsCIDR} />
        <Datagrid
          columns={columns}
          items={dataCIDR}
          totalItems={dataCIDR?.length || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </>
  );
}

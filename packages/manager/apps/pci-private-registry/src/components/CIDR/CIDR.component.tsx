import {
  Datagrid,
  Notifications,
  useColumnFilters,
  useDataGrid,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import { useEffect } from 'react';
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
import { ODS_MESSAGE_TYPE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsSpinner,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useDatagridColumn } from '@/pages/CIDR/useDatagridColumn';
import Filters from '@/components/CIDR/Filters.component';
import {
  getRegistryQueyPrefixWithId,
  useIpRestrictionsWithFilter,
} from '@/api/hooks/useIpRestrictions';
import { TIPRestrictionsData } from '@/types';
import useFilters from '@/pages/CIDR/useFilters';

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

  const queryClient = useQueryClient();
  const { formState } = useFormContext();
  const columns = useDatagridColumn();
  const { pagination, filters, setPagination } = useFilters();
  const { clearNotifications } = useNotifications();

  const { data: dataCIDR } = useIpRestrictionsWithFilter(
    projectId,
    registryId,
    ['management', 'registry'],
    pagination,
    filters,
  );

  const variablesPending = useMutationState({
    filters: { status: 'pending' },
    select: (mutation) => mutation.state.variables,
  });

  useEffect(() => clearNotifications, []);

  const createNewBlocsCIDR = () =>
    createNewRow(
      queryClient,
      getRegistryQueyPrefixWithId(projectId, registryId, [
        'management',
        'registry',
      ]),
    );

  if (variablesPending.length) {
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
      {!dataCIDR.rows.length && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.info}
          type={ODS_MESSAGE_TYPE.info}
          key={t('private_registry_noCIDR')}
          className="my-6"
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.info}
            data-testid="errorBanner"
          >
            {t('private_registry_noCIDR')}
            <br />
          </OsdsText>
        </OsdsMessage>
      )}
      {Object.values(formState.errors)?.map((err) => (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
          key={err.message as string}
          className="my-6"
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.error}
            data-testid="errorBanner"
          >
            {t(err.message as string)}
            <br />
          </OsdsText>
        </OsdsMessage>
      ))}
      <Notifications />
      <div className="mt-8">
        <>
          <Filters createNewRow={createNewBlocsCIDR} />
          <Datagrid
            columns={columns}
            items={dataCIDR.rows}
            totalItems={dataCIDR.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </>
      </div>
    </>
  );
}

import {
  Datagrid,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useEffect } from 'react';
import { useMutationState } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsSpinner,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useDatagridColumn } from '@/pages/CIDR/useDatagridColumn';
import Filters from '@/components/CIDR/Filters.component';
import { getRegistryQueyPrefixWithId } from '@/api/hooks/useIpRestrictions';
import useDataGridContext from '@/pages/CIDR/useDatagridContext';
import { ConfirmCIDRSchemaType } from '@/types';
import { schemaAddCidr } from '@/schema/formSchema';

export default function CIDR() {
  const { t } = useTranslation(['ip-restrictions', 'common']);
  const { projectId = '', registryId = '' } = useParams();
  const {
    pagination,
    setPagination,
    rows,
    totalRows,
    initialData,
    setSorting,
    sorting,
    isUpdating,
  } = useDataGridContext();
  const methods = useForm<ConfirmCIDRSchemaType>({
    resolver: zodResolver(
      schemaAddCidr(
        rows.map((e) => e.ipBlock),
        isUpdating,
      ),
    ),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const columns = useDatagridColumn();

  const { clearNotifications } = useNotifications();

  const variablesPending = useMutationState({
    filters: { status: 'pending' },
    select: (mutation) => mutation.state.variables,
  });

  const useUpdateIpRestrictionVariables = useMutationState({
    filters: {
      mutationKey: getRegistryQueyPrefixWithId(projectId, registryId),
    },
    select: (mutation) => mutation.state,
  });

  useEffect(() => {
    // if we are using a modal inside a page routing, we cannot reset the component inside the modal
    // use form context is not the target of routing
    if (
      useUpdateIpRestrictionVariables.length &&
      useUpdateIpRestrictionVariables[
        useUpdateIpRestrictionVariables.length - 1
      ].status === 'success'
    ) {
      methods.reset();
    }
  }, [useUpdateIpRestrictionVariables]);

  useEffect(() => clearNotifications, []);

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
    <FormProvider {...methods}>
      {!initialData.current.length && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.info}
          type={ODS_MESSAGE_TYPE.info}
          key={t('private_registry_noCIDR')}
          className="my-6"
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.info}
            size={ODS_TEXT_SIZE._400}
            data-testid="errorBanner"
          >
            {t('private_registry_noCIDR')}
            <br />
          </OsdsText>
        </OsdsMessage>
      )}
      {Object.values(methods.formState.errors)?.map((err) => (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          type={ODS_MESSAGE_TYPE.error}
          key={err?.message as string}
          className="my-6"
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.error}
            size={ODS_TEXT_SIZE._400}
            data-testid="errorBanner"
          >
            {t(err?.message as string)}
            <br />
          </OsdsText>
        </OsdsMessage>
      ))}
      <Notifications />
      <div className="mt-8">
        <>
          <Filters />
          <div className="mt-8">
            <Datagrid
              sorting={sorting}
              onSortChange={setSorting}
              columns={columns}
              items={rows}
              totalItems={totalRows || 0}
              pagination={pagination}
              onPaginationChange={setPagination}
              className="overflow-x-visible"
            />
          </div>
        </>
      </div>
    </FormProvider>
  );
}

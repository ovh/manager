import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DatagridColumn,
  BaseLayout,
  OvhSubsidiary,
  Links,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { CTAS } from '@/guides.constants';
import { urls } from '@/routes/routes.constants';
import { LicenseType } from '@/api/license';
import { useOfficeLicenses, useGenerateUrl } from '@/hooks';
import Loading from '@/components/Loading/Loading';

const columns: DatagridColumn<LicenseType>[] = [
  {
    id: 'serviceName',
    cell: (item) => {
      const href = useGenerateUrl(urls.license, 'href', {
        serviceName: item.serviceName,
      });

      return <Links href={href} label={item.serviceName}></Links>;
    },
    label: 'microsoft_office_licenses_servicename',
    isSortable: true,
  },
  {
    id: 'displayName',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.displayName}</OdsText>
    ),
    label: 'microsoft_office_licenses_displayName',
    isSortable: true,
  },
  {
    id: 'address',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.address}</OdsText>
    ),
    label: 'microsoft_office_licenses_address',
    isSortable: true,
  },
  {
    id: 'city',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.city}</OdsText>
    ),
    label: 'microsoft_office_licenses_city',
    isSortable: true,
  },
  {
    id: 'firstname',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.firstName}</OdsText>
    ),
    label: 'microsoft_office_licenses_firstname',
    isSortable: true,
  },
  {
    id: 'lastname',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.lastName}</OdsText>
    ),
    label: 'microsoft_office_licenses_lastname',
    isSortable: true,
  },
  {
    id: 'serviceType',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.serviceType}</OdsText>
    ),
    label: 'microsoft_office_licenses_servicetype',
    isSortable: true,
  },
  {
    id: 'status',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.status}</OdsText>
    ),
    label: 'microsoft_office_licenses_status',
    isSortable: true,
  },
  {
    id: 'zipCode',
    cell: (item) => (
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.zipCode}</OdsText>
    ),
    label: 'microsoft_office_licenses_zipcode',
    isSortable: true,
  },
];

export default function Licenses() {
  const { t } = useTranslation('licenses');
  const { data, isLoading } = useOfficeLicenses();

  const { sorting, setSorting } = useDatagridSearchParams();

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const goOrder = () => {
    const url = CTAS[ovhSubsidiary as OvhSubsidiary] || CTAS.DEFAULT;
    window.open(url, '_blank');
  };

  const header = {
    title: t('microsoft_office_licenses_title'),
  };

  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0 || !sorting) return data;

    const sorted = [...data];
    const { id, desc } = sorting;

    sorted.sort((a, b) => {
      if (a[id] < b[id]) return desc ? 1 : -1;
      if (a[id] > b[id]) return desc ? -1 : 1;
      return 0;
    });

    return sorted;
  }, [data, sorting]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <BaseLayout header={header}>
          <div className="mb-4">
            <OdsButton
              color={ODS_BUTTON_COLOR.primary}
              variant={ODS_BUTTON_VARIANT.outline}
              onClick={goOrder}
              label={t('microsoft_office_licenses_order')}
              data-testid="licenses-order-button"
            ></OdsButton>
          </div>
          {columns && (
            <Datagrid
              columns={columns.map((column) => ({
                ...column,
                label: t(column.label),
              }))}
              items={sortedData || []}
              totalItems={sortedData?.length || 0}
              sorting={sorting}
              onSortChange={setSorting}
              className="mt-4"
            />
          )}
        </BaseLayout>
      )}
    </>
  );
}

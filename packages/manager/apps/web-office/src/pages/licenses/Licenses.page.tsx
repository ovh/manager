import { useContext, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BaseLayout,
  Datagrid,
  Links,
  OvhSubsidiary,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';
import type { DatagridColumn } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ORDER_URL } from '@/Guides.constants';
import { DETAILS_SERVICE, GO_TO_ORDER } from '@/Tracking.constants';
import { OfficeServiceState } from '@/components/office-service-state/OfficeServiceState.component';
import { OfficeServiceListType } from '@/data/api/license/type';
import { useLicenses } from '@/data/hooks/licenses/useLicenses';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import { urls } from '@/routes/Routes.constants';

function GenerateUrl(serviceName: string) {
  const href = useGenerateUrl(urls.generalInformation, 'href', {
    serviceName,
  });
  return href;
}

export default function Licenses() {
  const { t } = useTranslation([
    'licenses',
    'common',
    NAMESPACES.DASHBOARD,
    NAMESPACES.STATUS,
    NAMESPACES.ACTIONS,
  ]);
  const { trackClick } = useOvhTracking();
  const { data, isLoading } = useLicenses();

  const { sorting, setSorting } = useDatagridSearchParams();

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const goToOrder = () => {
    const url = ORDER_URL[ovhSubsidiary as OvhSubsidiary] || ORDER_URL.DEFAULT;
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: GO_TO_ORDER,
    });
    window.open(url, '_blank');
  };

  const header = {
    title: t('common:common_office_title'),
  };

  const sortedData = useMemo(() => {
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

  const columns: DatagridColumn<OfficeServiceListType>[] = useMemo(
    () => [
      {
        id: 'serviceName',
        cell: (item) => {
          return (
            <Links
              href={GenerateUrl(item.serviceName)}
              label={item.tenantServiceName}
              onClickReturn={() =>
                trackClick({
                  location: PageLocation.datagrid,
                  buttonType: ButtonType.link,
                  actionType: 'action',
                  actions: DETAILS_SERVICE,
                })
              }
            ></Links>
          );
        },
        label: t(`${NAMESPACES.DASHBOARD}:service_name`),
        isSortable: true,
        enableHiding: true,
      },
      {
        id: 'displayName',
        cell: (item) => <OdsText preset={ODS_TEXT_PRESET.paragraph}>{item.displayName}</OdsText>,
        label: t(`${NAMESPACES.DASHBOARD}:display_name`),
        isSortable: true,
        enableHiding: true,
      },
      {
        id: 'serviceType',
        cell: (item) => (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(`common:${item.serviceType}`)}</OdsText>
        ),
        label: t(`${NAMESPACES.DASHBOARD}:service_type`),
        isSortable: true,
        enableHiding: true,
      },
      {
        id: 'status',
        cell: (item) => <OfficeServiceState state={item.status} />,
        label: t(`${NAMESPACES.STATUS}:status`),
        isSortable: true,
        enableHiding: true,
      },
    ],
    [t, trackClick],
  );

  return (
    <BaseLayout header={header}>
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={sortedData || []}
        totalItems={sortedData?.length || 0}
        sorting={sorting}
        onSortChange={setSorting}
        topbar={
          <OdsButton
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={goToOrder}
            label={t(`${NAMESPACES.ACTIONS}:order`)}
            data-testid="licenses-order-button"
          ></OdsButton>
        }
        isLoading={isLoading}
      />
    </BaseLayout>
  );
}

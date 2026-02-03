import { useContext, useMemo, useState } from 'react';

import type { SortingState, VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, Button, Link } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Datagrid, OvhSubsidiary } from '@ovh-ux/muk';
import type { DatagridColumn } from '@ovh-ux/muk';

import { ORDER_URL } from '@/Guides.constants';
import { DETAILS_SERVICE, GO_TO_ORDER } from '@/Tracking.constants';
import { OfficeServiceState } from '@/components/office-service-state/OfficeServiceState.component';
import { OfficeServiceListType } from '@/data/api/license/type';
import { StateEnum } from '@/data/api/service-infos/type';
import { useLicenses } from '@/data/hooks/licenses/useLicenses';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import { urls } from '@/routes/Routes.constants';

import ActionButtonLicenses from './ActionButtonLicenses.component';

function GenerateUrl(serviceName: string, url: string, type: 'path' | 'href') {
  const href = useGenerateUrl(url, type, {
    serviceName,
  });
  return href;
}

export default function Licenses() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { t } = useTranslation([
    'licenses',
    'common',
    NAMESPACES.DASHBOARD,
    NAMESPACES.STATUS,
    NAMESPACES.ACTIONS,
  ]);
  const { trackClick } = useOvhTracking();
  const { data: licensesData, isLoading } = useLicenses();
  const { data: availability } = useFeatureAvailability(['web-office:order']);
  const [sorting, setSorting] = useState<SortingState>([]);

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

  const columns: DatagridColumn<OfficeServiceListType>[] = useMemo(
    () => [
      {
        id: 'serviceName',
        accessorKey: 'tenantServiceName',
        cell: ({
          row: {
            original: { serviceName, tenantServiceName, mcaAgreed },
          },
        }) => (
          <Link
            href={GenerateUrl(serviceName, mcaAgreed ? urls.generalInformation : urls.mca, 'href')}
            onClick={() =>
              trackClick({
                location: PageLocation.datagrid,
                buttonType: ButtonType.link,
                actionType: 'action',
                actions: DETAILS_SERVICE,
              })
            }
          >
            {tenantServiceName}
          </Link>
        ),
        header: t(`${NAMESPACES.DASHBOARD}:service_name`),
        enableHiding: true,
        isSortable: true,
      },
      {
        id: 'displayName',
        header: t(`${NAMESPACES.DASHBOARD}:display_name`),
        accessorKey: 'displayName',
        enableHiding: true,
        isSortable: true,
      },
      {
        id: 'serviceType',
        header: t(`${NAMESPACES.DASHBOARD}:service_type`),
        accessorKey: 'serviceType',
        enableHiding: true,
        isSortable: true,
      },
      {
        id: 'status',
        header: t(`${NAMESPACES.STATUS}:status`),
        accessorKey: 'status',
        cell: ({
          row: {
            original: { status, mcaAgreed },
          },
        }) => <OfficeServiceState state={mcaAgreed ? status : StateEnum.AWAITING_SIGNATURE} />,
        enableHiding: true,
        isSortable: true,
      },
      {
        id: 'actions',
        maxSize: 50,
        cell: ({
          row: {
            original: { serviceName, mcaAgreed },
          },
        }) => (
          <ActionButtonLicenses
            serviceName={serviceName}
            serviceDetailUrl={GenerateUrl(serviceName, urls.generalInformation, 'path')}
            mcaUrl={GenerateUrl(serviceName, urls.mca, 'path')}
            mcaAgreed={mcaAgreed}
          ></ActionButtonLicenses>
        ),
      },
    ],
    [t, trackClick],
  );

  return (
    <BaseLayout
      header={{
        title: t('common:common_office_title'),
      }}
    >
      <Datagrid
        columns={columns}
        data={licensesData ?? []}
        sorting={{ sorting, setSorting }}
        columnVisibility={{
          columnVisibility,
          setColumnVisibility,
        }}
        topbar={
          availability?.['web-office:order'] && (
            <Button
              color={BUTTON_COLOR.primary}
              onClick={goToOrder}
              data-testid="licenses-order-button"
            >
              {t(`${NAMESPACES.ACTIONS}:order`)}
            </Button>
          )
        }
        isLoading={isLoading}
        containerHeight={500}
      />
    </BaseLayout>
  );
}

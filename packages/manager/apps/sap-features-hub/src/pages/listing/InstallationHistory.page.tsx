import React, { Suspense } from 'react';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  HeadersProps,
  Notifications,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { LABELS } from '@/utils/label.constants';
import { urls } from '@/routes/routes.constant';
import { TSAPInstallationWithService } from '@/types/installation.type';
import useInstallationHistory from '@/data/hooks/useInstallationHistory';
import { useWizardAvailability } from '@/hooks/wizardAvailability/useWizardAvailability';
import {
  ApplicationTypeCell,
  ApplicationVersionCell,
  DeploymentTypeCell,
  DetailIconCell,
  InstallationDateCell,
  SAPHANASIDCell,
  SAPSIDCell,
  StatusCell,
  VMwareServiceCell,
} from '@/components/Datagrid/DatagridHistoryCells.component';
import Loading from '@/components/Loading/Loading';
import { TRACKING } from '@/tracking.constants';

export default function HistoryPage() {
  const { t } = useTranslation('listing');
  const { t: tInstallation } = useTranslation('installation');
  const { t: tDashboard } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: installations, isLoading } = useInstallationHistory();
  const {
    isWizardAvailable,
    isLoading: isWizardAvailabilityLoading,
  } = useWizardAvailability();

  const header: HeadersProps = { title: t('sap_hub_history_list') };

  const columns: DatagridColumn<TSAPInstallationWithService>[] = [
    {
      id: 'installationDate',
      label: t('sap_hub_history_installation_date'),
      cell: InstallationDateCell,
      isSortable: false,
    },
    {
      id: 'service',
      label: LABELS.VMWARE_ON_OVHCLOUD_SERVICE,
      cell: VMwareServiceCell,
      isSortable: false,
    },
    {
      id: 'sapHanaId',
      label: LABELS.SAP_HANA_SID,
      cell: SAPHANASIDCell,
      isSortable: false,
    },
    {
      id: 'sapId',
      label: LABELS.SAP_SID,
      cell: SAPSIDCell,
      isSortable: false,
    },
    {
      id: 'version',
      label: t('sap_hub_history_application_version'),
      cell: ApplicationVersionCell,
      isSortable: false,
    },
    {
      id: 'applicationType',
      label: t('sap_hub_history_application_type'),
      cell: ApplicationTypeCell,
      isSortable: false,
    },
    {
      id: 'deploymentType',
      label: t('sap_hub_history_deployment_type'),
      cell: DeploymentTypeCell,
      isSortable: false,
    },
    {
      id: 'status',
      label: t('sap_hub_history_installation_status'),
      cell: StatusCell,
      isSortable: false,
    },
    {
      id: 'action',
      label: '',
      cell: DetailIconCell,
      isSortable: false,
    },
  ];

  if (isLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <Suspense>
      <RedirectionGuard
        condition={!isWizardAvailable}
        isLoading={isWizardAvailabilityLoading}
        route={urls.dashboard}
      >
        <BaseLayout
          breadcrumb={<Breadcrumb />}
          header={header}
          backLinkLabel={tInstallation('backlink_label')}
          onClickReturn={() => navigate(urls.dashboard)}
          description={t('sap_hub_history_title')}
          message={<Notifications />}
        >
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={() => {
              trackClick(TRACKING.wizard.start);
              navigate(urls.installationWizard);
            }}
            label={tDashboard('blocks_start_wizard')}
            className="block mb-8 w-fit"
          />
          {installations && (
            <Datagrid
              columns={columns}
              items={installations}
              totalItems={0}
              hasNextPage={false}
            />
          )}
          <Outlet />
        </BaseLayout>
      </RedirectionGuard>
    </Suspense>
  );
}

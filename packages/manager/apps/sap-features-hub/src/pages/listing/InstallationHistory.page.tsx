import React from 'react';
import {
  BaseLayout,
  Datagrid,
  DatagridColumn,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { LABELS } from '@/utils/label.constants';
import { subRoutes } from '@/routes/routes.constant';
import { TSAPInstallation } from '@/types/installation.type';
import useInstallationHistory from '@/data/hooks/useInstallationHistory';
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

export default function HistoryPage() {
  const { t } = useTranslation('listing');
  const { t: tInstallation } = useTranslation('installation');
  const navigate = useNavigate();

  const { data: installations, isLoading } = useInstallationHistory();

  const header: HeadersProps = {
    title: LABELS.SAP_HANA,
  };

  const columns: DatagridColumn<TSAPInstallation>[] = [
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
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      backLinkLabel={tInstallation('backlink_label')}
      onClickReturn={() => {}}
    >
      <OdsText preset="heading-2" className="flex flex-col">
        {t('sap_hub_history_title')}
      </OdsText>
      <OdsButton
        variant={ODS_BUTTON_VARIANT.outline}
        onClick={() => navigate(subRoutes.initialStep)}
        label={t('sap_hub_history_run_installation')}
        className="my-8"
      />
      {installations && (
        <Datagrid
          columns={columns}
          items={installations}
          totalItems={0}
          hasNextPage={false}
        />
      )}
    </BaseLayout>
  );
}

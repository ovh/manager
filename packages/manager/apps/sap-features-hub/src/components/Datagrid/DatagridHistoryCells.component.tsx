import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TSAPInstallationWithService } from '@/types/installation.type';
import { InstallationStatus } from '../InstallationStatus/InstallationStatus.component';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { buildViewInstallationRedirectUrl } from '@/utils/buildSearchQuery';

export const InstallationDateCell = (
  installation: TSAPInstallationWithService,
) => {
  const date = new Date(Date.parse(installation?.startTime));

  const datetime = useFormattedDate({
    date,
    options: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  });
  return <DataGridTextCell>{datetime}</DataGridTextCell>;
};

export const VMwareServiceCell = (
  installation: TSAPInstallationWithService,
) => <DataGridTextCell>{installation?.serviceName}</DataGridTextCell>;

export const SAPSIDCell = (installation: TSAPInstallationWithService) => (
  <DataGridTextCell>{installation?.sapSid}</DataGridTextCell>
);

export const SAPHANASIDCell = (installation: TSAPInstallationWithService) => (
  <DataGridTextCell>{installation?.sapHanaSid}</DataGridTextCell>
);

export const ApplicationVersionCell = (
  installation: TSAPInstallationWithService,
) => <DataGridTextCell>{installation?.applicationVersion}</DataGridTextCell>;

export const ApplicationTypeCell = (
  installation: TSAPInstallationWithService,
) => <DataGridTextCell>{installation?.applicationType}</DataGridTextCell>;

export const DeploymentTypeCell = (
  installation: TSAPInstallationWithService,
) => <DataGridTextCell>{installation?.deploymentType}</DataGridTextCell>;

export const StatusCell = (installation: TSAPInstallationWithService) => (
  <InstallationStatus status={installation?.status} />
);

export const DetailIconCell = (installation: TSAPInstallationWithService) => {
  const { t } = useTranslation('listing');
  const navigate = useNavigate();

  const taskId = installation?.taskId;
  const reportUrl = buildViewInstallationRedirectUrl({
    serviceName: installation?.serviceName,
    taskId,
  });

  return (
    <>
      <OdsButton
        id={taskId}
        size="sm"
        variant="ghost"
        label=""
        icon="eye"
        aria-label="view-installation-report"
        onClick={() => navigate(reportUrl)}
      />
      <OdsTooltip role="tooltip" triggerId={taskId}>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('sap_hub_history_installation_see_detail')}
        </OdsText>
      </OdsTooltip>
    </>
  );
};

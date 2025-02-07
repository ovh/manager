import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsIcon, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TSAPInstallation } from '@/types/installation.type';
import { InstallationStatus } from '../InstallationStatus/InstallationStatus.component';
import { useFormattedDate } from '@/hooks/useFormattedDate';

export const InstallationDateCell = (installation: TSAPInstallation) => {
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

export const VMwareServiceCell = (installation: TSAPInstallation) => (
  <DataGridTextCell>{installation?.serviceName}</DataGridTextCell>
);

export const SAPSIDCell = (installation: TSAPInstallation) => (
  <DataGridTextCell>{installation?.sapSid}</DataGridTextCell>
);

export const SAPHANASIDCell = (installation: TSAPInstallation) => (
  <DataGridTextCell>{installation?.sapHanaSid}</DataGridTextCell>
);

export const ApplicationVersionCell = (installation: TSAPInstallation) => (
  <DataGridTextCell>{installation?.applicationVersion}</DataGridTextCell>
);

export const ApplicationTypeCell = (installation: TSAPInstallation) => (
  <DataGridTextCell>{installation?.applicationType}</DataGridTextCell>
);

export const DeploymentTypeCell = (installation: TSAPInstallation) => (
  <DataGridTextCell>{installation?.deploymentType}</DataGridTextCell>
);

export const StatusCell = (installation: TSAPInstallation) => (
  <InstallationStatus status={installation?.status} />
);

export const DetailIconCell = (installation: TSAPInstallation) => {
  const { t } = useTranslation('listing');
  const id = installation?.sapSid;
  // TODO : manage redirection to installation summary page
  return (
    <>
      <OdsIcon name={ODS_ICON_NAME.eye} id={id} />
      <OdsTooltip role="tooltip" triggerId={id}>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('sap_hub_history_installation_see_detail')}
        </OdsText>
      </OdsTooltip>
    </>
  );
};

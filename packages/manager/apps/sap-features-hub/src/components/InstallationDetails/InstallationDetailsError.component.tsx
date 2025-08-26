import { OdsCode, OdsMessage } from '@ovhcloud/ods-components/react';
import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import {
  InstallationDetails,
  SAPInstallationStatus,
} from '@/types/installation.type';
import { useInstallationTaskDetails } from '@/hooks/installationDetails/useInstallationDetails';
import { TGetInstallationTaskParams } from '@/data/api/sapInstallations';

export function getTranslationKeyOfStepInError(
  installation?: InstallationDetails,
) {
  const prefix = 'dashboard_installation_progress_step_';

  const steps = [
    { key: 'initialisation', status: installation?.gatewayStatus },
    {
      key: 'create_virtuals_machines',
      status: installation?.vmDeploymentStatus,
    },
    {
      key: 'sap_hana_install',
      status: installation?.sapHanaInstallationStatus,
    },
    { key: 'sap_install', status: installation?.sapSystemInstallationStatus },
    { key: 'clean_resources', status: installation?.cleanStatus },
  ];

  const stepInError = steps.find(
    (step) => step.status === SAPInstallationStatus.failure,
  );

  return stepInError ? `${prefix}${stepInError.key}` : '';
}

export const InstallationDetailsError = ({
  serviceName,
  taskId,
}: Readonly<TGetInstallationTaskParams>) => {
  const { t } = useTranslation('dashboard/installation');

  const {
    data: installationTaskDetails,
    isLoading,
  } = useInstallationTaskDetails({ serviceName, taskId });

  const stepInError = useMemo(
    () => getTranslationKeyOfStepInError(installationTaskDetails),
    [installationTaskDetails],
  );

  if (
    isLoading ||
    installationTaskDetails?.status !== SAPInstallationStatus.failure
  ) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-2">
      <OdsMessage color="critical" isDismissible={false}>
        {t('dashboard_installation_error_message', {
          stepName: t(stepInError),
        })}
      </OdsMessage>
      <div>
        <OdsCode className="max-h-56 w-full overflow-y-auto">
          {installationTaskDetails?.errorMessage}
        </OdsCode>
      </div>
    </div>
  );
};

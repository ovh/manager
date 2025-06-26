import {
  OdsProgressBar,
  OdsText,
  OdsIcon,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import {
  InstallationDetails,
  SAPInstallationStatus,
} from '@/types/installation.type';
import { InstallationStatus } from '@/components/InstallationStatus/InstallationStatus.component';
import { useMockInstallationTaskDetails } from '@/hooks/installationDetails/useInstallationDetails';
import { TGetInstallationTaskParams } from '@/data/api/sapInstallations';

export function computeProgressPercentage(installation?: InstallationDetails) {
  const steps = [
    { status: installation?.gatewayStatus, value: 5 },
    { status: installation?.terraformStatus, value: 25 },
    { status: installation?.ansibleSapHanaStatus, value: 50 },
    { status: installation?.ansibleSapSystemStatus, value: 95 },
    { status: installation?.cleanStatus, value: 100 },
  ];

  const reversedSteps = steps.reverse();
  const progressPercentage = reversedSteps.find(
    (step) => step.status === SAPInstallationStatus.success,
  )?.value;

  return progressPercentage ?? 0;
}

export function StepStatusIcon({
  status,
}: Readonly<{ status: SAPInstallationStatus }>) {
  const { t } = useTranslation('dashboard/installation');

  if ([SAPInstallationStatus.success].includes(status)) {
    return (
      <OdsIcon
        aria-hidden="true"
        aria-label={t('dashboard_installation_progress_step_success')}
        className="text-green-600"
        name="circle-check"
      ></OdsIcon>
    );
  }

  if (
    [SAPInstallationStatus.revoked, SAPInstallationStatus.failure].includes(
      status,
    )
  ) {
    return (
      <OdsIcon
        aria-hidden="true"
        aria-label={t('dashboard_installation_progress_step_failure')}
        className="text-red-600"
        name="circle-xmark"
      ></OdsIcon>
    );
  }

  if (
    [SAPInstallationStatus.started, SAPInstallationStatus.retry].includes(
      status,
    )
  ) {
    return (
      <OdsSpinner
        aria-label={t('dashboard_installation_progress_step_pending')}
        size="xs"
      />
    );
  }

  return (
    <OdsIcon
      aria-hidden="true"
      aria-label={t('dashboard_installation_progress_step_waiting')}
      className="text-gray-600"
      name="circle-check"
    ></OdsIcon>
  );
}

export const InstallationDetailsProgress = ({
  serviceName,
  taskId,
}: Readonly<TGetInstallationTaskParams>) => {
  const { t } = useTranslation('dashboard/installation');

  const {
    data: installationTaskDetails,
    isLoading,
  } = useMockInstallationTaskDetails({ serviceName, taskId });

  const progressPercentage = useMemo(
    () => computeProgressPercentage(installationTaskDetails),
    [installationTaskDetails],
  );

  return (
    <div className=" flex flex-col gap-3">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-row items-center gap-2">
          <OdsText preset="heading-3">
            {t('dashboard_installation_progress_status_label')}
          </OdsText>
          <div>
            {!isLoading && (
              <InstallationStatus status={installationTaskDetails.status} />
            )}
          </div>
        </div>
        <OdsProgressBar value={progressPercentage} />
      </div>
      <div className="flex gap-1 flex-col">
        <div className="flex gap-2 items-center">
          <StepStatusIcon status={installationTaskDetails?.gatewayStatus} />
          <OdsText>
            {t('dashboard_installation_progress_step_initialisation')}
          </OdsText>
        </div>
        <div className="flex gap-2 items-center">
          <StepStatusIcon status={installationTaskDetails?.terraformStatus} />
          <OdsText>
            {t('dashboard_installation_progress_step_create_virtuals_machines')}
          </OdsText>
        </div>
        <div className="flex gap-2 items-center">
          <StepStatusIcon
            status={installationTaskDetails?.ansibleSapHanaStatus}
          />
          <OdsText>
            {t('dashboard_installation_progress_step_sap_hana_install')}
          </OdsText>
        </div>
        <div className="flex gap-2 items-center">
          <StepStatusIcon
            status={installationTaskDetails?.ansibleSapSystemStatus}
          />
          <OdsText>
            {t('dashboard_installation_progress_step_sap_install')}
          </OdsText>
        </div>
        <div className="flex gap-2 items-center">
          <StepStatusIcon status={installationTaskDetails?.cleanStatus} />
          <OdsText>
            {t('dashboard_installation_progress_step_clean_resources')}
          </OdsText>
        </div>
      </div>
    </div>
  );
};

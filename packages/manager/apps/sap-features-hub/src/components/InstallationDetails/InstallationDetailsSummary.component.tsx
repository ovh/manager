import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { LABELS } from '@/utils/label.constants';
import { FormFieldSummary } from '@/components/Form/FormFieldSummary.component';
import { StepFieldData } from '@/types/formStep.type';
import { useInstallationTaskDetails } from '@/hooks/installationDetails/useInstallationDetails';
import { TGetInstallationTaskParams } from '@/data/api/sapInstallations';
import { useFormatDate } from '@/hooks/date/useFormatDate';

export const InstallationDetailsSummary = ({
  serviceName,
  taskId,
}: Readonly<TGetInstallationTaskParams>) => {
  const { t } = useTranslation(['dashboard/installation', 'installation']);
  const formatDate = useFormatDate();

  const {
    data: installationTaskDetails,
    isLoading,
  } = useInstallationTaskDetails({ serviceName, taskId });

  const fields: StepFieldData[] = useMemo(
    () =>
      [
        {
          label: t(
            'dashboard/installation:dashboard_installation_item_start_date',
          ),
          value: formatDate({
            date: installationTaskDetails?.startTime,
            format: 'PPp',
          }),
        },
        {
          label: t(
            'dashboard/installation:dashboard_installation_item_end_date',
          ),
          value:
            installationTaskDetails?.endTime &&
            formatDate({
              date: installationTaskDetails?.endTime,
              format: 'PPp',
            }),
        },
        {
          label: t('installation:service_input_vmware'),
          value: serviceName,
        },
        {
          label: LABELS.SAP_SID,
          value: installationTaskDetails?.sapSid,
        },
        {
          label: LABELS.SAP_HANA_SID,
          value: installationTaskDetails?.sapHanaSid,
        },
        {
          label: t(
            'dashboard/installation:dashboard_installation_item_application_version',
          ),
          value: installationTaskDetails?.applicationVersion,
        },
        {
          label: t(
            'dashboard/installation:dashboard_installation_item_application_type',
          ),
          value: installationTaskDetails?.applicationType,
        },
        {
          label: t(
            'dashboard/installation:dashboard_installation_item_deployment_type',
          ),
          value: installationTaskDetails?.deploymentType,
        },
      ] as StepFieldData[],
    [installationTaskDetails],
  );

  return (
    <div className="flex flex-col gap-y-6">
      <OdsText preset="heading-3">
        {t(
          'dashboard/installation:dashboard_installation_general_informations',
        )}
      </OdsText>
      <div className="flex flex-col gap-y-1">
        {fields.map((field) => (
          <FormFieldSummary
            key={field.label}
            field={field}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

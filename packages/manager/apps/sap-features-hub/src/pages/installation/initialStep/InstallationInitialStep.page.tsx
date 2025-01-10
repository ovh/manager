import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { FormTitle } from '@/components/Form/FormTitle.component';
import {
  useDatacentreClusters,
  useVMwareDatacentres,
  useVMwareServices,
} from '@/hooks/vmwareServices/useVMwareServices';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';

export default function InstallationInitialStep() {
  const { t } = useTranslation('installation');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { initializeAndProceed } = useFormSteps();
  const {
    values: { serviceName, datacenterId, clusterName },
    setValues,
  } = useInstallationFormContext();

  const {
    data: services,
    isLoading: isLoadingServices,
    isError: isServicesError,
  } = useVMwareServices();

  const {
    data: datacentres,
    isLoading: isLoadingDatacentres,
    isError: isDatacentresError,
  } = useVMwareDatacentres(serviceName);

  const {
    data: clusters,
    isLoading: isLoadingClusters,
    isError: isClustersError,
  } = useDatacentreClusters({
    serviceName,
    datacenterId: String(datacenterId),
  });

  const isError = useMemo(
    () =>
      datacenterId &&
      !clusters?.length &&
      !isLoadingClusters &&
      !isClustersError,
    [clusters, isLoadingClusters, isClustersError],
  );

  useEffect(() => {
    setIsFormValid(clusterName && !isError);
  }, [isError, clusterName]);

  return (
    <div>
      <FormTitle title={t('service_title')} subtitle={t('service_subtitle')} />
      <form className="flex flex-col gap-y-6">
        <SelectField
          name="serviceName"
          label={t('service_input_vmware')}
          placeholder={t('select_label')}
          options={services}
          optionValueKey="serviceName"
          optionLabelKey="displayName"
          isDisabled={isLoadingServices || isServicesError}
          isLoading={isLoadingServices}
          handleChange={(event) => {
            setValues((prev) => ({
              ...prev,
              serviceName: event.detail.value,
              datacenterId: null,
              clusterName: null,
            }));
          }}
        />
        <SelectField
          name="datacenterId"
          label={t('service_input_vdc')}
          placeholder={t('select_label')}
          options={datacentres}
          optionValueKey="datacenterId"
          optionLabelKey="name"
          isDisabled={
            !serviceName || isLoadingDatacentres || isDatacentresError
          }
          isLoading={isLoadingDatacentres}
          handleChange={(event) => {
            setValues((prev) => ({
              ...prev,
              datacenterId: Number(event.detail.value),
              clusterName: null,
            }));
          }}
          error={
            isError ? t('service_input_error_no_cluster_available') : undefined
          }
        />
        <SelectField
          name="clusterName"
          label={t('service_input_cluster')}
          placeholder={t('select_label')}
          options={clusters}
          optionValueKey="name"
          isDisabled={
            !datacenterId || isLoadingClusters || isClustersError || isError
          }
          isLoading={!!datacenterId && isLoadingClusters}
          handleChange={(event) =>
            setValues((prev) => ({ ...prev, clusterName: event.detail.value }))
          }
        />
        <OdsButton
          label={t('service_cta')}
          isDisabled={!isFormValid}
          onClick={() => initializeAndProceed(serviceName)}
        />
      </form>
    </div>
  );
}

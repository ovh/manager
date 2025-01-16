import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useDatacentreClusters,
  useVMwareDatacentres,
  useVMwareServices,
} from '@/hooks/vmwareServices/useVMwareServices';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import InstallationFormLayout from '@/components/Form/FormLayout.component';

export default function InstallationInitialStep() {
  const { t } = useTranslation('installation');
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

  const isError = React.useMemo(
    () =>
      datacenterId &&
      !clusters?.length &&
      !isLoadingClusters &&
      !isClustersError,
    [clusters, isLoadingClusters, isClustersError],
  );

  const isStepValid = React.useMemo(() => clusterName && !isError, [
    clusterName,
    isError,
  ]);

  return (
    <InstallationFormLayout
      title={t('service_title')}
      subtitle={t('service_subtitle')}
      submitLabel={t('service_cta')}
      isSubmitDisabled={!isStepValid}
      onClickSubmit={() => initializeAndProceed(serviceName)}
    >
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
        isDisabled={!serviceName || isLoadingDatacentres || isDatacentresError}
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
    </InstallationFormLayout>
  );
}

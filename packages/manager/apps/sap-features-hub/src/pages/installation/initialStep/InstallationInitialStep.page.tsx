import React from 'react';
import { useTranslation } from 'react-i18next';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';
import { useVMwareDatacentres } from '@/hooks/vmwareServices/useDatacentres';
import { useClusters } from '@/hooks/vmwareServices/useClusters';
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
  } = useClusters({
    serviceName,
    datacenterId: datacenterId?.toString(),
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
      onSubmit={() => initializeAndProceed(serviceName)}
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
        defaultValue={serviceName}
        handleChange={({ detail }) => {
          setValues((prev) => ({
            ...prev,
            serviceName: detail.value,
            serviceDisplayName:
              services?.find((service) => service.serviceName === detail.value)
                ?.displayName || '',
            datacenterId: null,
            datacenterName: null,
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
        defaultValue={datacenterId ? `${datacenterId}` : undefined}
        handleChange={({ detail }) => {
          setValues((prev) => ({
            ...prev,
            datacenterId: detail.value ? Number(detail.value) : null,
            datacenterName:
              datacentres?.find((vdc) => `${vdc.datacenterId}` === detail.value)
                ?.name || '',
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
        defaultValue={clusterName}
        handleChange={({ detail }) => {
          setValues((prev) => ({
            ...prev,
            clusterName: detail.value,
            clusterId:
              clusters?.find((cluster) => cluster?.name === detail.value)
                ?.clusterId || null,
          }));
        }}
      />
    </InstallationFormLayout>
  );
}

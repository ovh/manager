import React from 'react';
import { useTranslation } from 'react-i18next';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';
import { useVMwareDatacentres } from '@/hooks/vmwareServices/useDatacentres';
import { useClusters } from '@/hooks/vmwareServices/useClusters';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import InstallationFormLayout from '@/components/Form/FormLayout.component';
import { getSelectDefaultValue } from '@/utils/selectValues';

type ServiceNameData = {
  serviceName: string;
  serviceDisplayName: string;
};
type DatacenterData = {
  datacenterId: number;
  datacenterName: string;
};
type ClusterData = {
  clusterId: number;
  clusterName: string;
};

export default function InstallationInitialStep() {
  const { t } = useTranslation('installation');
  const { initializeAndProceed } = useFormSteps();
  const {
    values: { serviceName, datacenterId, clusterName },
    setValues,
    initializationState: {
      isPrefilled,
      prefilledData: {
        serviceName: prefilledServiceName,
        datacenterId: prefilledVdcId,
        clusterName: prefilledClusterName,
      },
    },
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

  const serviceNames = services?.map((s) => s?.serviceName);
  const datacenterIds = datacentres?.map((d) => d?.datacenterId);
  const clusterNames = clusters?.map((c) => c?.name);

  const isError =
    serviceName &&
    datacenterId &&
    !clusters?.length &&
    !isLoadingClusters &&
    !isClustersError;

  const isLoading =
    isLoadingServices || isLoadingDatacentres || isLoadingClusters;
  const isFormFilled = serviceName && datacenterId && clusterName;
  const isStepValid = !isLoading && isFormFilled && !isError;

  const getServiceData = (service: string | null): ServiceNameData => ({
    serviceName: service || '',
    serviceDisplayName:
      services?.find((s) => s?.serviceName === service)?.displayName || '',
  });
  const getDatacenterData = (vdcId: number | null): DatacenterData => ({
    datacenterId: vdcId || null,
    datacenterName:
      datacentres?.find((vdc) => vdc?.datacenterId === vdcId)?.name || '',
  });
  const getClusterData = (cluster: string | null): ClusterData => ({
    clusterName: cluster || '',
    clusterId: clusters?.find((c) => c?.name === cluster)?.clusterId || null,
  });

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
        defaultValue={getSelectDefaultValue(
          isPrefilled ? prefilledServiceName : serviceName,
          serviceNames,
        )}
        handleChange={(e) => {
          setValues((prev) => ({
            ...prev,
            ...getServiceData(e.detail.value),
            ...getDatacenterData(null),
            ...getClusterData(null),
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
        defaultValue={getSelectDefaultValue(
          isPrefilled ? prefilledVdcId : datacenterId,
          datacenterIds,
        )}
        handleChange={(e) => {
          setValues((prev) => ({
            ...prev,
            ...getDatacenterData(Number(e.detail.value)),
            ...getClusterData(null),
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
        defaultValue={getSelectDefaultValue(
          isPrefilled ? prefilledClusterName : clusterName,
          clusterNames,
        )}
        handleChange={(e) => {
          setValues((prev) => ({ ...prev, ...getClusterData(e.detail.value) }));
        }}
      />
    </InstallationFormLayout>
  );
}

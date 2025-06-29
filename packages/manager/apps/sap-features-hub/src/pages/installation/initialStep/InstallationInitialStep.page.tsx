import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';
import { useVMwareDatacentres } from '@/hooks/vmwareServices/useDatacentres';
import { useClusters } from '@/hooks/vmwareServices/useClusters';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import InstallationFormLayout from '@/components/Form/FormLayout.component';
import { getSelectDefaultValue } from '@/utils/selectValues';
import { TRACKING } from '@/tracking.constants';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { mapFormInitialToStructured } from '@/mappers/stepFormMappers';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';

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
        datacenterId: prefilledDatacenterId,
        clusterName: prefilledClusterName,
      },
    },
  } = useInstallationFormContext();
  const { trackClick } = useOvhTracking();

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
  const getDatacenterData = (id: number | null): DatacenterData => ({
    datacenterId: id || null,
    datacenterName:
      datacentres?.find((d) => d?.datacenterId === id)?.name || '',
  });
  const getClusterData = (cluster: string | null): ClusterData => ({
    clusterName: cluster || '',
    clusterId: clusters?.find((c) => c?.name === cluster)?.clusterId || null,
  });
  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();

  const {
    mutate: validate,
    isPending: isValidationPending,
  } = useStepValidation({
    mapper: mapFormInitialToStructured,
    serviceName,
    onSuccess: () => {
      initializeAndProceed(serviceName);
    },
    onError: (error) => {
      setServerErrorMessage(error.response?.data?.message);
    },
  });

  const handleSubmit = () => {
    trackClick(TRACKING.installation.chooseDeployment);

    validate({
      serviceName,
      datacenterId,
      clusterName,
    });
  };

  return (
    <InstallationFormLayout
      title={t('service_title')}
      subtitle={t('service_subtitle')}
      submitLabel={t('service_cta')}
      serverErrorMessage={serverErrorMessage}
      isSubmitDisabled={
        !isStepValid || isValidationPending || !!serverErrorMessage
      }
      onSubmit={handleSubmit}
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
          clearServerErrorMessage();
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
          isPrefilled ? prefilledDatacenterId : datacenterId,
          datacenterIds,
        )}
        handleChange={(e) => {
          clearServerErrorMessage();
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
          clearServerErrorMessage();
          setValues((prev) => ({ ...prev, ...getClusterData(e.detail.value) }));
        }}
      />
    </InstallationFormLayout>
  );
}

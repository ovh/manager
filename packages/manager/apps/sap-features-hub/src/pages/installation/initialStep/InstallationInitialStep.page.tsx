import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';
import { useVMwareDatacentres } from '@/hooks/vmwareServices/useDatacentres';
import { useClusters } from '@/hooks/vmwareServices/useClusters';
import { SelectField } from '@/components/Form/SelectField.component';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import InstallationFormLayout from '@/components/Form/FormLayout.component';
import {
  getSelectDefaultValue,
  getSelectLatestValue,
} from '@/utils/selectValues';
import { TRACKING } from '@/tracking.constants';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { mapFormInitialToStructured } from '@/mappers/stepFormMappers';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';
import { InitializationForm } from '@/types/form.type';

type InitializationFormInput = Pick<
  InitializationForm,
  'serviceName' | 'datacenterId' | 'clusterName'
>;
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
  const { t } = useTranslation([
    'installation',
    NAMESPACES.ACTIONS,
    NAMESPACES.SYSTEM,
  ]);
  const { initializeAndProceed } = useFormSteps();
  const {
    values: {
      serviceName,
      serviceDisplayName,
      datacenterId,
      datacenterName,
      clusterName,
    },
    setValues,
    initializationState: { isPrefilled, prefilledData },
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
  } = useVMwareDatacentres(serviceName, {
    enabled: !!serviceDisplayName,
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: clusters,
    isLoading: isLoadingClusters,
    isError: isClustersError,
  } = useClusters(
    {
      serviceName,
      datacenterId: datacenterId?.toString(),
    },
    {
      enabled: !!serviceDisplayName && !!datacenterName,
      staleTime: 0,
      gcTime: 0,
    },
  );

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

  const serviceNames = services?.map((s) => s?.serviceName);
  const datacenterIds = datacentres?.map((d) => d?.datacenterId);
  const clusterNames = clusters?.map((c) => c?.name);

  const invalidServiceError = serviceName && isDatacentresError;
  const invalidDatacentreError =
    serviceName &&
    datacenterId &&
    !clusters?.length &&
    !isLoadingClusters &&
    !isClustersError;

  const isLoading =
    isLoadingServices || isLoadingDatacentres || isLoadingClusters;
  const formData = { serviceName, datacenterId, clusterName };
  const isFormFilled = Object.values(formData).every((value) => !!value);
  const isStepValid = !isLoading && isFormFilled && !invalidDatacentreError;

  const getLatestValue = (input: keyof InitializationFormInput) =>
    getSelectLatestValue({
      isPrefilled,
      value: formData[input],
      prefilledValue: prefilledData[input],
    });

  return (
    <InstallationFormLayout
      title={t('service_title')}
      subtitle={t('service_subtitle')}
      submitLabel={t('service_cta')}
      serverErrorMessage={serverErrorMessage}
      isSubmitDisabled={!isStepValid || !!serverErrorMessage}
      isSubmitLoading={isValidationPending}
      onSubmit={() => {
        trackClick(TRACKING.installation.chooseDeployment);
        validate(formData);
      }}
    >
      <SelectField
        name="serviceName"
        label={t('service_input_vmware')}
        placeholder={t(`${NAMESPACES.ACTIONS}:select_imperative`)}
        options={services}
        optionValueKey="serviceName"
        optionLabelKey="displayName"
        isDisabled={
          isLoadingServices ||
          isServicesError ||
          isLoadingDatacentres ||
          isLoadingClusters
        }
        isLoading={isLoadingServices}
        defaultValue={getSelectDefaultValue(
          getLatestValue('serviceName'),
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
        error={
          invalidServiceError
            ? t('service_input_error_service_invalid')
            : undefined
        }
      />
      <SelectField
        name="datacenterId"
        label={t(`${NAMESPACES.SYSTEM}:datacentre`)}
        placeholder={t(`${NAMESPACES.ACTIONS}:select_imperative`)}
        options={datacentres}
        optionValueKey="datacenterId"
        optionLabelKey="name"
        isDisabled={
          !serviceDisplayName ||
          isLoadingDatacentres ||
          isDatacentresError ||
          isLoadingClusters
        }
        isLoading={isLoadingDatacentres}
        defaultValue={getSelectDefaultValue(
          getLatestValue('datacenterId'),
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
          serviceDisplayName && invalidDatacentreError
            ? t('service_input_error_no_cluster_available')
            : undefined
        }
      />
      <SelectField
        name="clusterName"
        label={t(`${NAMESPACES.SYSTEM}:cluster`)}
        placeholder={t(`${NAMESPACES.ACTIONS}:select_imperative`)}
        options={clusters}
        optionValueKey="name"
        isDisabled={
          !datacenterName ||
          isLoadingClusters ||
          isClustersError ||
          invalidDatacentreError
        }
        isLoading={!!datacenterId && isLoadingClusters}
        defaultValue={getSelectDefaultValue(
          getLatestValue('clusterName'),
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

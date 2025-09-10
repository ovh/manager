import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OdsSelectChangeEventDetail } from '@ovhcloud/ods-components';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';
import { useVMwareDatacentres } from '@/hooks/vmwareServices/useDatacentres';
import { useClusters } from '@/hooks/vmwareServices/useClusters';
import { useFormSteps } from '@/hooks/formStep/useFormSteps';
import { useInstallationFormContext } from '@/context/InstallationForm.context';
import InstallationFormLayout from '@/components/Form/FormLayout.component';
import {
  getDefaultValueWithAutoSelect,
  getSelectLatestValue,
} from '@/utils/selectValues';
import { TRACKING } from '@/tracking.constants';
import { useStepValidation } from '@/hooks/apiValidation/useApiValidation';
import { mapFormInitialToStructured } from '@/mappers/stepFormMappers';
import { useStateMessage } from '@/hooks/stateMessage/stateMessage';
import { INITIALIZATION_STEP_SCHEMA } from '@/schema/initializationStep.schema';
import { RhfSelectField } from '@/components/Fields/RhfSelectField.component';
import { useManagedSelectField } from '@/hooks/managedField/useManagedField';
import { useFormSaveOnUnmount } from '@/hooks/formSave/useFormSaveOnUnmount';

type SelectEvent = CustomEvent<OdsSelectChangeEventDetail>;
type FormData = z.output<typeof INITIALIZATION_STEP_SCHEMA>;
type InitializationFormInput = Pick<
  FormData,
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
  const { t } = useTranslation('installation');
  const { trackClick } = useOvhTracking();
  const { initializeAndProceed } = useFormSteps();
  const {
    values,
    setValues,
    initializationState: { isPrefilled, prefilledData },
  } = useInstallationFormContext();
  const {
    stateMessage: serverErrorMessage,
    setStateMessage: setServerErrorMessage,
    clearMessage: clearServerErrorMessage,
  } = useStateMessage();

  // #region --- RHF initialization ---
  const methods = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(INITIALIZATION_STEP_SCHEMA),
    defaultValues: {
      serviceName: values.serviceName,
      serviceDisplayName: values.serviceDisplayName,
      datacenterId: values.datacenterId,
      datacenterName: values.datacenterName,
      clusterName: values.clusterName,
      clusterId: values.clusterId,
    },
  });
  const { control, watch, reset, getValues, setValue } = methods;

  const serviceName = watch('serviceName');
  const serviceDisplayName = watch('serviceDisplayName');
  const datacenterId = watch('datacenterId');
  const datacenterName = watch('datacenterName');
  const clusterName = watch('clusterName');
  // #endregion

  // --- Saving form in global state ---
  useFormSaveOnUnmount({ setValues, getValues });

  // #region --- Queries ---
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
    { serviceName, datacenterId: datacenterId?.toString() },
    {
      enabled: !!serviceDisplayName && !!datacenterName,
      staleTime: 0,
      gcTime: 0,
    },
  );
  // #endregion

  // #region --- Utils declaration ---
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
  // #endregion

  // #region --- Get additional data ---
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
  // #endregion

  // #region --- Fields declaration ---
  const serviceField = useManagedSelectField({
    control,
    name: 'serviceName',
    extraHandler: (e: SelectEvent) => {
      reset({
        ...getValues(),
        ...getServiceData(e.detail.value),
        ...getDatacenterData(null),
        ...getClusterData(null),
      });
      clearServerErrorMessage();
    },
  });
  const datacentreField = useManagedSelectField({
    control,
    name: 'datacenterId',
    valueAsNumber: true,
    extraHandler: (e: SelectEvent) => {
      reset({
        ...getValues(),
        ...getDatacenterData(Number(e.detail.value)),
        ...getClusterData(null),
      });
      clearServerErrorMessage();
    },
  });
  const clusterField = useManagedSelectField({
    control,
    name: 'clusterName',
    extraHandler: (e: SelectEvent) => {
      reset({ ...getValues(), ...getClusterData(e.detail.value) });
      clearServerErrorMessage();
    },
  });
  // #endregion

  // #region --- AutoSelect ---
  const serviceNames = services?.map((s) => s?.serviceName);
  const datacenterIds = datacentres?.map((d) => d?.datacenterId);
  const clusterNames = clusters?.map((c) => c?.name);

  const getLatestValue = (input: keyof InitializationFormInput) =>
    getSelectLatestValue({
      isPrefilled,
      value: getValues(input),
      prefilledValue: prefilledData[input],
    });

  // --- Service field effect ---
  useEffect(() => {
    if (!serviceName && !isLoadingServices && services) {
      const current = getValues('serviceName');
      const defaultService = getDefaultValueWithAutoSelect(
        getLatestValue('serviceName'),
        serviceNames,
      );

      if (defaultService && defaultService !== current) {
        const data = getServiceData(defaultService);
        setValue('serviceName', data.serviceName);
        setValue('serviceDisplayName', data.serviceDisplayName);
      }
    }
  }, [isLoadingServices, services, serviceName, serviceNames]);

  // --- Datacentre field effect ---
  useEffect(() => {
    if (serviceName && !datacenterId && !isLoadingDatacentres && datacentres) {
      const current = getValues('datacenterId')?.toString();
      const defaultDatacentre = getDefaultValueWithAutoSelect(
        getLatestValue('datacenterId'),
        datacenterIds,
      );

      if (defaultDatacentre && defaultDatacentre !== current) {
        const data = getDatacenterData(Number(defaultDatacentre));
        setValue('datacenterId', data.datacenterId);
        setValue('datacenterName', data.datacenterName);
      }
    }
  }, [serviceName, isLoadingDatacentres, datacentres, datacenterIds]);

  // --- Cluster field effect ---
  useEffect(() => {
    if (datacenterId && !isLoadingClusters && clusters) {
      const current = getValues('clusterName');
      const defaultCluster = getDefaultValueWithAutoSelect(
        getLatestValue('clusterName'),
        clusterNames,
      );

      if (defaultCluster && defaultCluster !== current) {
        const data = getClusterData(defaultCluster);
        setValue('clusterName', data.clusterName);
        setValue('clusterId', data.clusterId);
      }
    }
  }, [datacenterId, isLoadingClusters, clusters, clusterNames]);
  // #endregion

  // #region --- Step validation ---
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
  // #endregion

  return (
    <FormProvider {...methods}>
      <InstallationFormLayout
        title={t('service_title')}
        subtitle={t('service_subtitle')}
        submitLabel={t('service_cta')}
        serverErrorMessage={serverErrorMessage}
        isSubmitDisabled={!isStepValid || !!serverErrorMessage}
        isSubmitLoading={isValidationPending}
        onSubmit={methods.handleSubmit(() => {
          trackClick(TRACKING.installation.chooseDeployment);
          validate(formData);
        })}
      >
        <RhfSelectField
          field={serviceField}
          label={t('service_input_vmware')}
          placeholder={t('select_label')}
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
          error={
            invalidServiceError
              ? t('service_input_error_service_invalid')
              : undefined
          }
        />
        <RhfSelectField
          field={datacentreField}
          label={t('service_input_vdc')}
          placeholder={t('select_label')}
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
          error={
            serviceDisplayName && invalidDatacentreError
              ? t('service_input_error_no_cluster_available')
              : undefined
          }
        />
        <RhfSelectField
          field={clusterField}
          label={t('service_input_cluster')}
          placeholder={t('select_label')}
          options={clusters}
          optionValueKey="name"
          isDisabled={
            !datacenterName ||
            isLoadingClusters ||
            isClustersError ||
            invalidDatacentreError
          }
          isLoading={!!datacenterId && isLoadingClusters}
        />
      </InstallationFormLayout>
    </FormProvider>
  );
}

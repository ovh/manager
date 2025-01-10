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
import { useLocalStorage } from '@/hooks/localStorage/useLocalStorage';

export default function InstallationInitialStep() {
  const { t } = useTranslation('installation');
  const [serviceName, setServiceName] = useState<string>(null);
  const [datacenterId, setDatacenterId] = useState<string>(null);
  const [clusterName, setClusterName] = useState<string>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { initializeAndProceed, currentStepLabel } = useFormSteps();
  const { setStorageItem } = useLocalStorage();

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
    datacenterId,
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

  const handleSubmit = () => {
    setStorageItem(currentStepLabel, { vdcId: datacenterId, clusterName });
    initializeAndProceed(serviceName);
  };

  return (
    <div>
      <FormTitle title={t('service_title')} subtitle={t('service_subtitle')} />
      <form className="flex flex-col gap-y-6">
        <SelectField
          name={'service_vmware'}
          label={t('service_input_vmware')}
          placeholder={t('select_label')}
          options={services}
          optionValueKey={'serviceName'}
          optionLabelKey={'displayName'}
          isDisabled={isLoadingServices || isServicesError}
          isLoading={isLoadingServices}
          handleChange={(event) => {
            setServiceName(event.detail.value);
            setDatacenterId(null);
            setClusterName(null);
          }}
        />
        <SelectField
          name={'service_vdc'}
          label={t('service_input_vdc')}
          placeholder={t('select_label')}
          options={datacentres}
          optionValueKey={'datacenterId'}
          optionLabelKey={'name'}
          isDisabled={
            !serviceName || isLoadingDatacentres || isDatacentresError
          }
          isLoading={isLoadingDatacentres}
          handleChange={(event) => {
            setDatacenterId(event.detail.value);
            setClusterName(null);
          }}
          error={
            isError ? t('service_input_error_no_cluster_available') : undefined
          }
        />
        <SelectField
          name={'service_cluster'}
          label={t('service_input_cluster')}
          placeholder={t('select_label')}
          options={clusters}
          optionValueKey={'name'}
          isDisabled={
            !datacenterId || isLoadingClusters || isClustersError || isError
          }
          isLoading={isLoadingClusters && !isLoadingDatacentres}
          handleChange={(event) => setClusterName(event.detail.value)}
        />
        <OdsButton
          label={t('service_cta')}
          isDisabled={!isFormValid}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}

import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';
import { FormProvider } from 'react-hook-form';
import { Name } from '@/pages/create/components/name/NameInput.component';
import { useTranslation } from 'react-i18next';
import { Divider, Text } from '@ovhcloud/ods-react';
import {
  DeploymentModeSection
} from '@/pages/create/components/data-center/deploymentMode/DeploymentModeSection.component';

const CreateShareForm = () => {
  const { t } = useTranslation(['common', 'creation']);

  // const projectId = useProjectId();
  const formMethods = useCreateShareForm();
  // const selectedCity = formMethods.watch('city');

  // const dataCenters = selectMicroRegions(deps)(projectId, selectedCity);
  // const availabilityZones = selectAvailabilityZones(deps)(
  //   projectId,
  //   dataCenters?.[0]?.value ?? null,
  // );
  //
  // const hasMultipleDataCenter = dataCenters ? dataCenters.length > 1 : false;

  return (
    <FormProvider {...formMethods}>
      <div className="flex flex-col gap-6 w-2/3">
        <section>
          <Text preset="heading-2">
            {t('common:pci_instances_common_instance_name')}
          </Text>
          <Name />
        </section>
        <Divider />
        <section>
          <Text preset="heading-2">
            {t('creation:pci_instance_creation_select_localization_label')}
          </Text>
          <DeploymentModeSection />
          {/*<LocalizationSelection />*/}
          {/*{dataCenters && hasMultipleDataCenter && (*/}
          {/*  <MicroRegionSelection microRegions={dataCenters} />*/}
          {/*)}*/}
          {/*{!!availabilityZones.length && (*/}
          {/*  <AvailabilityZoneSelection availabilityZones={availabilityZones} />*/}
          {/*)}*/}
        </section>
      </div>
    </FormProvider>
  );
};
export default CreateShareForm;

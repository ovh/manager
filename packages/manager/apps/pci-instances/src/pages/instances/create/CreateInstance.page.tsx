import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { z } from 'zod';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import {
  availabilityZoneSelectionSchema,
  continentSelectionSchema,
  deploymentModesSchema,
  flavorCategorySchema,
  flavorTypeSchema,
  macroRegionSelectionSchema,
  microRegionSelectionSchema,
  nameSchema,
  quantitySchema,
} from '@/pages/instances/create/CreateInstance.schema';

import { useInstancesCatalog } from '@/data/hooks/catalog/useInstancesCatalog';
import { CreateInstanceForm } from './components/createInstanceForm/CreateInstanceForm.component';
import { Spinner } from '@ovhcloud/ods-react';

export type TInstanceCreationForm = z.infer<typeof instanceCreationSchema>;
export const instanceCreationSchema = z.object({
  name: nameSchema,
  quantity: quantitySchema,
  deploymentModes: deploymentModesSchema,
  continent: continentSelectionSchema,
  flavorCategory: flavorCategorySchema,
  flavorType: flavorTypeSchema,
  macroRegion: macroRegionSelectionSchema,
  microRegion: microRegionSelectionSchema,
  availabilityZone: availabilityZoneSelectionSchema,
});

const CreateInstance: FC = () => {
  const project = useRouteLoaderData('root') as TProject | undefined;
  const { t } = useTranslation('common');

  const { isLoading } = useInstancesCatalog();

  const breadcrumbItems = [
    {
      label: t('common:pci_instances_common_create_instance'),
    },
  ];

  return (
    <main className="py-8 px-4 mt-8 md:py-9 md:px-10 md:mt-2">
      <section className="mb-8">
        {project && (
          <Breadcrumb
            projectLabel={project.description ?? ''}
            items={breadcrumbItems}
          />
        )}
      </section>
      {isLoading ? <Spinner /> : <CreateInstanceForm />}
    </main>
  );
};

export default CreateInstance;

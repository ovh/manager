import { FC } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TProject } from '@ovh-ux/manager-pci-common';
import { z } from 'zod';
import { Spinner } from '@ovhcloud/ods-react';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import {
  availabilityZoneSelectionSchema,
  continentSelectionSchema,
  deploymentModesSchema,
  flavorCategorySchema,
  flavorTypeSchema,
  flavorIdSchema,
  macroRegionSelectionSchema,
  microRegionSelectionSchema,
  nameSchema,
  quantitySchema,
  distributionImageTypeSchema,
  distributionImageVariantIdSchema,
  sshKeyIdSchema,
  sshPublicKeySchema,
  distributionImageOsTypeSchema,
  distributionImageVersionSchema,
  networkIdSchema,
  networkSchema,
} from '@/pages/instances/create/CreateInstance.schema';

import { useInstancesCatalog } from '@/data/hooks/catalog/useInstancesCatalog';
import { CreateInstanceForm } from './components/createInstanceForm/CreateInstanceForm.component';

export type TInstanceCreationForm = z.infer<typeof instanceCreationSchema>;
export const instanceCreationSchema = z.object({
  name: nameSchema,
  quantity: quantitySchema,
  deploymentModes: deploymentModesSchema,
  continent: continentSelectionSchema,
  flavorCategory: flavorCategorySchema,
  flavorType: flavorTypeSchema,
  flavorId: flavorIdSchema,
  macroRegion: macroRegionSelectionSchema,
  microRegion: microRegionSelectionSchema,
  availabilityZone: availabilityZoneSelectionSchema,
  distributionImageType: distributionImageTypeSchema,
  distributionImageVariantId: distributionImageVariantIdSchema,
  distributionImageVersion: distributionImageVersionSchema,
  distributionImageOsType: distributionImageOsTypeSchema,
  sshKeyId: sshKeyIdSchema,
  newSshPublicKey: sshPublicKeySchema.nullable(),
  networkId: networkIdSchema,
  newPrivateNetwork: networkSchema,
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
    <main className="mt-8 px-4 py-8 md:mt-2 md:px-10 md:py-9">
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

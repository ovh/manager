import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';
import { deps } from '@/deps/deps';
import { quantityDefaultValue } from '../CreateInstance.schema';
import { selectContinent } from '../view-models/continentsViewModel';
import { selectLocalizations } from '../view-models/localizationsViewModel';
import { BILLING_TYPE, TDeploymentMode } from '@/types/instance/common.type';
import {
  selectCategories,
  selectTypes,
} from '../view-models/categoriesTypesViewModel';
import { selectFlavors } from '../view-models/flavorsViewModel';
import { selectImages } from '../view-models/imagesViewModel';
import { useMemo } from 'react';
import { instanceCreationSchema } from '../CreateInstance.schema';
const preselectedOs = 'linux';
// eslint-disable-next-line max-lines-per-function
export const useForm = (projectId: string) => {
  const deploymentModesDefaultValue: TDeploymentMode[] = [
    'region',
    'region-3-az',
  ];

  const continents = selectContinent(deps)(
    projectId,
    deploymentModesDefaultValue,
  );

  const continentDefaultValue =
    continents.find((continent) => continent.value === 'all')?.value ??
    continents[0]!.value;

  const { localizations } = selectLocalizations(deps)(
    projectId,
    deploymentModesDefaultValue,
    continentDefaultValue,
    'total',
  );

  const macroRegionDefaultValue = localizations[0]!.macroRegion;

  const microRegionDefaultValue =
    localizations[0]!.microRegions[0]?.name ?? null;

  const categories = selectCategories(deps)(projectId);

  const flavorCategoryDefaultValue = categories[0]?.value ?? null;

  const flavorTypeDefaultValue =
    selectTypes(deps)(projectId, flavorCategoryDefaultValue)[0]?.value ?? null;

  const { preselectedFlavordId } = selectFlavors(deps)({
    projectId,
    flavorCategory: flavorCategoryDefaultValue,
    flavorType: flavorTypeDefaultValue,
    microRegionId: microRegionDefaultValue,
    withUnavailable: true,
  });

  const availabilityZoneDefaultValue = null;

  const { preselected } = useMemo(
    () =>
      selectImages(deps)({
        projectId,
        selectedImageType: preselectedOs,
        microRegion: microRegionDefaultValue,
        regionalizedFlavorId: preselectedFlavordId,
        distributionImageVariantId: null,
      }),
    [microRegionDefaultValue, preselectedFlavordId, projectId],
  );

  const sshKeyIdDefaultValue = null;

  const newSshPublicKeyDefaultValue = null;

  const formMethods = useReactHookForm({
    resolver: zodResolver(instanceCreationSchema),
    defaultValues: {
      quantity: quantityDefaultValue,
      deploymentModes: deploymentModesDefaultValue,
      continent: continentDefaultValue,
      flavorCategory: flavorCategoryDefaultValue,
      flavorType: flavorTypeDefaultValue,
      flavorId: preselectedFlavordId,
      macroRegion: macroRegionDefaultValue,
      microRegion: microRegionDefaultValue,
      availabilityZone: availabilityZoneDefaultValue,
      distributionImageType: preselectedOs,
      distributionImageVariantId:
        preselected.preselectedFirstAvailableVariantId,
      distributionImageVersion: {
        distributionImageVersionId:
          preselected.preselectedFirstAvailableVersion?.value ?? null,
        distributionImageVersionName:
          preselected.preselectedFirstAvailableVersion?.label ?? null,
      },
      backup: null,
      distributionImageOsType: preselectedOs,
      sshKeyId: sshKeyIdDefaultValue,
      newSshPublicKey: newSshPublicKeyDefaultValue,
      subnetId: null,
      newPrivateNetwork: null,
      willGatewayBeAttached: false,
      ipPublicType: null,
      floatingIpAssignment: null,
      existingFloatingIpId: null,
      billingType: BILLING_TYPE.Hourly,
      localBackupRotation: null,
      distantBackupLocalization: null,
      postInstallScript: null,
    },
    mode: 'onChange',
  });

  return formMethods;
};

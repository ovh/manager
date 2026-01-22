import {
  selectFlavorDetailsForCreation,
  selectLocalisationDetailsForCreation,
  selectWindowsImageLicensePriceForCreation,
  TSelectFlavorDetails,
  TSelectLocalizationDetails,
} from '../view-models/cartViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { useMemo } from 'react';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { selectPrivateNetworks } from '../view-models/networksViewModel';
import { useProjectId } from '@/hooks/project/useProjectId';
import { mapFlavorToDTO } from '@/adapters/tanstack/instances/right/mapper';
import { useCreateInstance } from '@/data/hooks/useCreateInstance';
import { isApiErrorResponse } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import {
  selectDistantBackupLocalizations,
  selectLocalBackupConfigurations,
} from '../view-models/backupConfigurationViewModel';
import { useBackupConfigurations } from '@/data/hooks/configuration/useBackupConfiguration';
import { isDiscoveryProject } from '@/data/utils/project.utils';
import { useProject } from '@ovh-ux/manager-pci-common';
import { BILLING_TYPE } from '@/types/instance/common.type';

type TBackupConfigurationPrices = {
  localBackupPrice: number;
  distantBackupPrice: number | null;
};

type TInstanceData = {
  name: string;
  quantity: number;
  distributionImageVariantId: string | null;
  distributionImageVersionName: string | null;
  sshKeyId: string | null;
  localizationDetails: TSelectLocalizationDetails | null;
  flavorDetails: TSelectFlavorDetails | null;
  windowsImageLicensePrice: number | null;
  backupConfigurationPrices: TBackupConfigurationPrices | null;
  networkName?: string;
  billingType: BILLING_TYPE;
};

type TInstanceCreation = {
  instanceData: TInstanceData;
  isCreationEnabled: boolean;
  handleCreateInstance: () => void;
  isCreatingInstance: boolean;
  errorMessage: string | null;
};

// eslint-disable-next-line max-lines-per-function
export const useInstanceCreation = (): TInstanceCreation => {
  const navigate = useNavigate();
  const projectId = useProjectId();
  const { control } = useFormContext<TInstanceCreationForm>();
  const [
    name,
    macroRegion,
    microRegion,
    backup,
    availabilityZone,
    quantity,
    flavorId,
    distributionImageVariantId,
    distributionImageVersion,
    distributionImageOsType,
    sshKeyId,
    networkId,
    newSshPublicKey,
    newPrivateNetwork,
    billingType,
    localBackupRotation,
    distantBackupLocalization,
  ] = useWatch({
    control,
    name: [
      'name',
      'macroRegion',
      'microRegion',
      'backup',
      'availabilityZone',
      'quantity',
      'flavorId',
      'distributionImageVariantId',
      'distributionImageVersion',
      'distributionImageOsType',
      'sshKeyId',
      'networkId',
      'newSshPublicKey',
      'newPrivateNetwork',
      'billingType',
      'localBackupRotation',
      'distantBackupLocalization',
    ],
  });
  const { data: project } = useProject();

  const { data: backupConfiguration } = useBackupConfigurations({
    select: selectLocalBackupConfigurations(microRegion),
  });

  const instancesListUrl = `/pci/projects/${projectId}/instances`;

  const localizationDetailsSelect = useMemo(
    () =>
      selectLocalisationDetailsForCreation(
        macroRegion,
        microRegion,
        availabilityZone,
      ),
    [macroRegion, microRegion, availabilityZone],
  );
  const { data: localizationDetails = null } = useInstancesCatalogWithSelect({
    select: localizationDetailsSelect,
  });

  const flavorDetailsSelect = useMemo(
    () =>
      selectFlavorDetailsForCreation(
        flavorId,
        distributionImageOsType,
        billingType,
      ),
    [flavorId, distributionImageOsType, billingType],
  );
  const { data: flavorDetails = null } = useInstancesCatalogWithSelect({
    select: flavorDetailsSelect,
  });

  const windowsImageLicensePriceSelect = useMemo(
    () =>
      selectWindowsImageLicensePriceForCreation(
        distributionImageOsType,
        billingType,
        flavorId,
      ),
    [distributionImageOsType, billingType, flavorId],
  );
  const {
    data: windowsImageLicensePrice = null,
  } = useInstancesCatalogWithSelect({
    select: windowsImageLicensePriceSelect,
  });

  const backupConfigurationPrices = useMemo(() => {
    if (!localBackupRotation || !backupConfiguration?.price) return null;

    const distantBackupLocalizations = selectDistantBackupLocalizations();

    const distantBackupPrice = distantBackupLocalizations
      .flatMap(({ options }) => options)
      .find(({ value }) => value === distantBackupLocalization)
      ?.customRendererData?.backupPrice;

    return {
      localBackupPrice: backupConfiguration.price,
      distantBackupPrice: distantBackupPrice ?? null,
    };
  }, [localBackupRotation, backupConfiguration, distantBackupLocalization]);

  const { networks } = useMemo(() => selectPrivateNetworks(microRegion), [
    microRegion,
  ]);

  const networkName =
    newPrivateNetwork?.name ??
    networks.find(({ value }) => networkId === value)?.label;

  const handleSuccess = () => {
    // TODO: update with new success specs to come
    navigate(instancesListUrl);
  };

  const {
    mutate: createInstance,
    isPending: isCreatingInstance,
    error,
  } = useCreateInstance({
    projectId,
    callbacks: { onSuccess: handleSuccess },
  });

  const needsSshKey = distributionImageOsType !== 'windows';

  const hasBaseRequirements =
    !!name &&
    !!quantity &&
    !!microRegion &&
    !!flavorDetails?.id &&
    !!distributionImageVersion.distributionImageVersionId;

  const hasSshRequirements = !needsSshKey || !!sshKeyId || !!newSshPublicKey;

  const isCreationEnabled =
    hasBaseRequirements && hasSshRequirements && !isDiscoveryProject(project);

  const handleCreateInstance = () => {
    if (!isCreationEnabled || isCreatingInstance) return;

    const instance = mapFlavorToDTO({
      name,
      quantity,
      availabilityZone,
      newSshPublicKey,
      imageRegion: backup?.region ?? microRegion,
      existingSshKeyId: sshKeyId,
      id: flavorDetails.id,
      imageId:
        backup?.id ?? distributionImageVersion.distributionImageVersionId,
      localBackupRotation,
    });
    createInstance({ regionName: microRegion, instance });
  };

  const instanceData = {
    name,
    quantity,
    distributionImageVariantId,
    sshKeyId,
    localizationDetails,
    flavorDetails,
    windowsImageLicensePrice,
    networkName,
    distributionImageVersionName:
      backup?.name ?? distributionImageVersion.distributionImageVersionName,
    backupConfigurationPrices,
    billingType,
  };

  const errorMessage = error
    ? isApiErrorResponse(error)
      ? error.response?.data.message ?? null
      : error.message
    : null;

  return {
    instanceData,
    isCreationEnabled,
    handleCreateInstance,
    isCreatingInstance,
    errorMessage,
  };
};

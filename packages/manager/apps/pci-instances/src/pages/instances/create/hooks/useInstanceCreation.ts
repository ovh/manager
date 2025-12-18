import {
  selectFlavorDetails,
  selectLocalisationDetails,
  selectWindowsImageLicensePrice,
  TSelectFlavorDetails,
  TSelectLocalizationDetails,
} from '../view-models/cartViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { deps } from '@/deps/deps';
import { useMemo } from 'react';
import { selectPrivateNetworks } from '../view-models/networksViewModel';
import { useProjectId } from '@/hooks/project/useProjectId';
import { mapFlavorToDTO } from '@/adapters/tanstack/instances/right/mapper';
import { useCreateInstance } from '@/data/hooks/useCreateInstance';
import { isApiErrorResponse } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { TInstanceCreationForm } from '../CreateInstance.schema';

type TInstanceData = {
  name: string;
  quantity: number;
  distributionImageVariantId: string | null;
  distributionImageVersionName: string | null;
  sshKeyId: string | null;
  localizationDetails: TSelectLocalizationDetails | null;
  flavorDetails: TSelectFlavorDetails | null;
  windowsImageLicensePrice: number | null;
  networkDetails?: {
    label: string;
    value: string;
  };
};

type TInstanceCreation = {
  instanceData: TInstanceData;
  isCreationEnabled: boolean;
  handleCreateInstance: () => void;
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
    availabilityZone,
    quantity,
    flavorId,
    distributionImageVariantId,
    distributionImageVersion,
    distributionImageOsType,
    sshKeyId,
    networkId,
    newSshPublicKey,
  ] = useWatch({
    control,
    name: [
      'name',
      'macroRegion',
      'microRegion',
      'availabilityZone',
      'quantity',
      'flavorId',
      'distributionImageVariantId',
      'distributionImageVersion',
      'distributionImageOsType',
      'sshKeyId',
      'networkId',
      'newSshPublicKey',
    ],
  });

  const instancesListUrl = `/pci/projects/${projectId}/instances`;

  const localizationDetails = useMemo(
    () =>
      selectLocalisationDetails(deps)(
        projectId,
        macroRegion,
        microRegion,
        availabilityZone,
      ),
    [availabilityZone, macroRegion, microRegion, projectId],
  );

  const flavorDetails = useMemo(
    () =>
      selectFlavorDetails(deps)(projectId, flavorId, distributionImageOsType),
    [distributionImageOsType, flavorId, projectId],
  );

  const windowsImageLicensePrice = useMemo(
    () =>
      selectWindowsImageLicensePrice(deps)(
        projectId,
        distributionImageOsType,
        flavorId,
      ),
    [distributionImageOsType, projectId, flavorId],
  );

  const { networks } = useMemo(() => selectPrivateNetworks(microRegion), [
    microRegion,
  ]);

  const networkDetails = networks.find(({ value }) => networkId === value);

  const handleSuccess = () => {
    // TODO: update with new success specs to come
    navigate(instancesListUrl);
  };

  const handleError = (error: Error) => {
    const errorMessage = isApiErrorResponse(error)
      ? error.response?.data.message
      : error.message;
    // TODO: update with new error specs to come
    console.error(errorMessage);
  };

  const { mutate: createInstance } = useCreateInstance({
    projectId,
    callbacks: { onSuccess: handleSuccess, onError: handleError },
  });

  const needsSshKey = distributionImageOsType !== 'windows';

  const hasBaseRequirements =
    !!name &&
    !!quantity &&
    !!microRegion &&
    !!flavorDetails?.id &&
    !!distributionImageVersion.distributionImageVersionId;

  const hasSshRequirements = !needsSshKey || !!sshKeyId || !!newSshPublicKey;

  const isCreationEnabled = hasBaseRequirements && hasSshRequirements;

  const handleCreateInstance = () => {
    if (!isCreationEnabled) return;

    const instance = mapFlavorToDTO({
      name,
      quantity,
      availabilityZone,
      newSshPublicKey,
      imageRegion: microRegion,
      existingSshKeyId: sshKeyId,
      id: flavorDetails.id,
      imageId: distributionImageVersion.distributionImageVersionId,
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
    networkDetails,
    distributionImageVersionName:
      distributionImageVersion.distributionImageVersionName,
  };

  return {
    instanceData,
    isCreationEnabled,
    handleCreateInstance,
  };
};

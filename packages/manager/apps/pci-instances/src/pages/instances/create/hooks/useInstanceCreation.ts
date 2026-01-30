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
import { usePrivateNetworks } from '@/data/hooks/configuration/usePrivateNetworks';
import {
  getGatewayAvailability,
  selectSmallGatewayConfig,
  selectPrivateNetworks,
  selectPublicIpPrices,
} from '../view-models/networksViewModel';
import { useNetworkCatalog } from '@/data/hooks/catalog/useNetworkCatalog';
import { selectMicroRegionDeploymentMode } from '../view-models/microRegionsViewModel';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';

type TBackupConfigurationPrices = {
  localBackupPrice: number;
  distantBackupPrice: number | null;
};

type TPrivateNetwork = {
  name: string;
  willGatewayBeAttached: boolean;
  gatewayPrice: number | null;
};

type TPublicNetworkCartItem = {
  labelKey: string;
  price: number | null;
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
  privateNetwork: TPrivateNetwork | null;
  publicNetwork: TPublicNetworkCartItem | null;
};

type TInstanceCreation = {
  instanceData: TInstanceData;
  isCreationEnabled: boolean;
  handleCreateInstance: () => void;
  isCreatingInstance: boolean;
  errorMessage: string | null;
};

type TPublicIpPrices = {
  basicPublicIp: number;
  floatingIp: number;
};

export const getPublicNetworkCartItem = ({
  ipPublicType,
  publicIpPrices,
}: {
  ipPublicType: 'basicIp' | 'floatingIp' | null;
  publicIpPrices?: TPublicIpPrices | null;
}) => {
  switch (ipPublicType) {
    case 'basicIp':
      return {
        labelKey: 'creation:pci_instance_creation_cart_public_ip_basic',
        price: publicIpPrices?.basicPublicIp ?? null,
      };
    case 'floatingIp':
      return {
        labelKey: 'creation:pci_instance_creation_cart_public_ip_floating',
        price: publicIpPrices?.floatingIp ?? null,
      };
    default:
      return null;
  }
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
    subnetId,
    newSshPublicKey,
    newPrivateNetwork,
    billingType,
    localBackupRotation,
    distantBackupLocalization,
    assignNewGateway,
    ipPublicType,
    floatingIpAssignment,
    existingFloatingIpId,
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
      'subnetId',
      'newSshPublicKey',
      'newPrivateNetwork',
      'billingType',
      'localBackupRotation',
      'distantBackupLocalization',
      'assignNewGateway',
      'ipPublicType',
      'floatingIpAssignment',
      'existingFloatingIpId',
    ],
  });
  const { data: project } = useProject();

  const { data: backupConfiguration } = useBackupConfigurations({
    select: selectLocalBackupConfigurations(microRegion),
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
      selectFlavorDetails(deps)(
        projectId,
        flavorId,
        distributionImageOsType,
        billingType,
      ),
    [distributionImageOsType, flavorId, projectId, billingType],
  );

  const windowsImageLicensePrice = useMemo(
    () =>
      selectWindowsImageLicensePrice(deps)(
        projectId,
        distributionImageOsType,
        billingType,
        flavorId,
      ),
    [distributionImageOsType, projectId, billingType, flavorId],
  );

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

  const { data: privateNetworks } = usePrivateNetworks({
    select: selectPrivateNetworks(microRegion),
  });

  const { data: gatewayConfigurations } = useNetworkCatalog({
    select: selectSmallGatewayConfig(microRegion),
  });

  const { data: publicIpPrices } = useNetworkCatalog({
    select: selectPublicIpPrices(microRegion),
  });

  const { data: deploymentMode } = useInstancesCatalogWithSelect({
    select: selectMicroRegionDeploymentMode(microRegion),
  });

  const gatewayAvailability = useMemo(
    () =>
      getGatewayAvailability({
        deploymentMode,
        privateNetworks,
        subnetId,
      }),
    [deploymentMode, subnetId, privateNetworks],
  );

  const privateNetwork = useMemo(() => {
    const network = privateNetworks?.find(({ value }) => subnetId === value);
    const willGatewayBeAttached = assignNewGateway || !!network?.hasGatewayIp;

    const gatewayPrice =
      !gatewayAvailability?.isDisabled && gatewayConfigurations
        ? gatewayConfigurations.price
        : null;

    const name = newPrivateNetwork?.name ?? network?.label ?? null;

    if (!name) return null;

    return { name, willGatewayBeAttached, gatewayPrice };
  }, [
    assignNewGateway,
    gatewayAvailability?.isDisabled,
    gatewayConfigurations,
    newPrivateNetwork?.name,
    subnetId,
    privateNetworks,
  ]);

  const publicNetwork = useMemo(
    () =>
      getPublicNetworkCartItem({
        ipPublicType,
        publicIpPrices,
      }),
    [ipPublicType, publicIpPrices],
  );

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

  const networkId =
    privateNetworks?.find(({ value }) => subnetId === value)?.networkId ?? null;

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
      existingFloatingIpId,
      floatingIpAssignment,
      assignNewGateway,
      networkId,
      subnetId,
      newPrivateNetwork,
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
    privateNetwork,
    publicNetwork,
    distributionImageVersionName:
      backup?.name ?? distributionImageVersion.distributionImageVersionName,
    backupConfigurationPrices,
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

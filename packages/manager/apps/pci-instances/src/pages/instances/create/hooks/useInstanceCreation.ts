/* eslint-disable max-lines */
import {
  selectFlavorDetailsForCreation,
  selectLocalisationDetailsForCreation,
  selectQuotaByRegionalizedFlavorId,
  selectWindowsImageLicensePriceForCreation,
  TSelectFlavorDetails,
  TSelectLocalizationDetails,
} from '../view-models/cartViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { useMemo } from 'react';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
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
import { usePrivateNetworks } from '@/data/hooks/configuration/usePrivateNetworks';
import {
  getGatewayAvailability,
  selectSmallGatewayConfig,
  selectPrivateNetworks,
  selectPublicIpPrices,
} from '../view-models/networksViewModel';
import { useNetworkCatalog } from '@/data/hooks/catalog/useNetworkCatalog';
import { selectMicroRegionDeploymentMode } from '../view-models/microRegionsViewModel';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

type TBackupConfigurationPrices = {
  localBackupPrice: number;
  distantBackupPrice: number | null;
};

type TPrivateNetwork = {
  name: string;
  willGatewayBeAttached: boolean;
  gatewayPrice: number | null;
};

type TPublicNetwork = {
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
  billingType: BILLING_TYPE;
  privateNetwork: TPrivateNetwork | null;
  publicNetwork: TPublicNetwork | null;
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
  ipPublicType: 'basicIp' | 'floatingIp' | 'existingFloatingIp' | null;
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
    case 'existingFloatingIp':
      return {
        labelKey: 'creation:pci_instance_creation_cart_public_ip_floating',
        price: null,
      };
    default:
      return null;
  }
};

// eslint-disable-next-line max-lines-per-function
export const useInstanceCreation = (): TInstanceCreation => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const projectId = useProjectId();
  const {
    control,
    formState: { isValid: isCreationFormValid },
  } = useFormContext<TInstanceCreationForm>();
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
    willGatewayBeAttached,
    ipPublicType,
    floatingIpAssignment,
    existingFloatingIpId,
    flavorCategory,
    distributionImageType,
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
      'willGatewayBeAttached',
      'ipPublicType',
      'floatingIpAssignment',
      'existingFloatingIpId',
      'flavorCategory',
      'distributionImageType',
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

  const { data: quota = null } = useInstancesCatalogWithSelect({
    select: (catalog) => selectQuotaByRegionalizedFlavorId(catalog)(flavorId),
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

    const gatewayPrice =
      !gatewayAvailability?.isDisabled && gatewayConfigurations
        ? gatewayConfigurations.price
        : null;

    const name = newPrivateNetwork?.name ?? network?.label ?? null;

    if (!name) return null;

    return { name, willGatewayBeAttached, gatewayPrice };
  }, [
    willGatewayBeAttached,
    gatewayAvailability?.isDisabled,
    gatewayConfigurations,
    newPrivateNetwork?.name,
    subnetId,
    privateNetworks,
  ]);

  const publicNetwork = useMemo(
    () =>
      getPublicNetworkCartItem({
        ipPublicType: existingFloatingIpId
          ? 'existingFloatingIp'
          : ipPublicType,
        publicIpPrices,
      }),
    [ipPublicType, publicIpPrices, existingFloatingIpId],
  );

  const handleSuccess = () => {
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

  const hasImageRequirements =
    !!backup?.id ||
    (!!distributionImageVersion.distributionImageVersionId &&
      !!distributionImageVersion.distributionImageVersionName);

  const hasBaseRequirements =
    !!name &&
    !!quantity &&
    quota != null &&
    quantity <= quota &&
    !!microRegion &&
    !!flavorDetails?.id &&
    hasImageRequirements;

  const hasSshRequirements = !needsSshKey || !!sshKeyId || !!newSshPublicKey;

  const isCreationEnabled =
    hasBaseRequirements &&
    hasSshRequirements &&
    !isDiscoveryProject(project) &&
    isCreationFormValid;

  const networkId =
    privateNetworks?.find(({ value }) => subnetId === value)?.customRendererData
      ?.networkId ?? null;

  const handleCreateInstance = () => {
    if (!isCreationEnabled || isCreatingInstance) return;

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [
        'add_instance',
        'instances_created',
        billingType,
        microRegion,
        ...(deploymentMode === 'region-3-az'
          ? [availabilityZone ? 'manually' : 'automated']
          : []),
        flavorDetails.name,
        ...(flavorCategory ? [flavorCategory] : []),
        distributionImageType,
        backup
          ? 'backup'
          : distributionImageVersion.distributionImageVersionName!,
      ],
    });

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
      assignNewGateway:
        willGatewayBeAttached && !gatewayAvailability?.isDisabled,
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

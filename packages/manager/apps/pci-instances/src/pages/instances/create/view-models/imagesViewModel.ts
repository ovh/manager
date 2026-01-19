/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { Deps } from '@/deps/deps';
import {
  TImageTypeName,
  TImage,
  TInstancesCatalog,
  TRegionalizedFlavor,
  TRegionalizedFlavorOsType,
  TRegionalizedImage,
  IMAGE_TYPES,
  TFlavor,
} from '@/domain/entities/instancesCatalog';
import { TOsType } from '@/domain/entities/common.types';
import { TBackup } from '@/domain/entities/backup';
import { Reader } from '@/types/utils.type';
import { SelectOptionItem } from '@ovhcloud/ods-react';

export type TOption = { labelKey: string; value: string; disabled: boolean };
export type TImageTypeOption = TOption & {
  value: 'linux' | 'apps' | 'windows' | 'backups';
};

type TSelectAvailableImageTypesData = (
  projectId: string,
  regionalizedFlavorId: string | null,
  microRegion: string | null,
  hasEligibleBackup: boolean,
) => TImageTypeOption[];

type TSelectAvailableImageTypes = Reader<Deps, TSelectAvailableImageTypesData>;

type TGetImageTypeAvailabilityArgs = {
  entities: TInstancesCatalog['entities'];
  regionalizedFlavorId: string;
  microRegion: string;
};

export type TBackupsEligibilityContext = {
  flavorMinDisk: number;
  flavorRam: number;
  flavorAcceptedOsTypes: TOsType[];
};

const getFlavorMinimumDiskSize = (flavor: TFlavor) =>
  flavor.specifications.disks.reduce<number>(
    (min, disk) => Math.min(min, disk.capacity.value),
    Infinity,
  );

export const selectBackupsEligibilityContext = (
  regionalizedFlavorId: string | null,
) => (catalog?: TInstancesCatalog): TBackupsEligibilityContext | null => {
  if (!catalog || !regionalizedFlavorId) return null;

  const regionalizedFlavor = catalog.entities.regionalizedFlavors.byId.get(
    regionalizedFlavorId,
  );
  if (!regionalizedFlavor) return null;

  const flavor = catalog.entities.flavors.byId.get(regionalizedFlavor.flavorId);
  if (!flavor) return null;

  return {
    flavorMinDisk: getFlavorMinimumDiskSize(flavor),
    flavorRam: flavor.specifications.ram.value,
    flavorAcceptedOsTypes: regionalizedFlavor.osTypes,
  };
};

export const isBackupEligible = (
  backup: TBackup,
  eligibilityContext: TBackupsEligibilityContext,
): boolean =>
  eligibilityContext.flavorMinDisk > backup.minDisk &&
  eligibilityContext.flavorRam > backup.minRam &&
  eligibilityContext.flavorAcceptedOsTypes.includes(backup.type);

export const hasAnyEligibleBackup = (
  eligibilityContext: TBackupsEligibilityContext | null,
) => (backups?: TBackup[]): boolean => {
  if (!eligibilityContext || !backups?.length) return false;
  return backups.some((backup) => isBackupEligible(backup, eligibilityContext));
};

export const selectEligibleBackups = (
  eligibilityContext: TBackupsEligibilityContext | null,
) => {
  return (backups?: TBackup[]): TSelectImagesOptions => {
    if (!eligibilityContext || !backups?.length) return emptyResult;

    const images = backups.map((backup) => ({
      label: backup.name,
      value: backup.id,
      osType: backup.type,
      available: isBackupEligible(backup, eligibilityContext),
    }));

    const preselectedFirstAvailableVariantId =
      images.find((variant) => variant.available)?.value ?? null;

    return {
      images,
      versions: [],
      preselected: {
        preselectedFirstAvailableVariantId,
        preselectedFirstAvailableVersion: null,
      },
    };
  };
};

const getImageTypeAvailability = ({
  entities,
  regionalizedFlavorId,
  microRegion,
}: TGetImageTypeAvailabilityArgs): Record<TImageTypeName, boolean> => {
  const typeAvailability = {
    linux: false,
    apps: false,
    windows: false,
  };

  IMAGE_TYPES.forEach((type) => {
    const osForImageType: TImageTypeName =
      type === 'windows' ? 'windows' : 'linux';

    const isTypeAcceptedByFlavor = isSelectedImageTypeAcceptedByFlavor(
      entities.regionalizedFlavors.byId,
      regionalizedFlavorId,
      osForImageType,
    );

    if (!isTypeAcceptedByFlavor) return;

    const imageIds = entities.imageTypes.byId.get(type)?.imageIds ?? [];

    typeAvailability[type] = imageIds.some((imageId) => {
      const image = entities.images.byId.get(imageId);
      if (!image) return false;

      if (!entities.regionalizedImages.byId.has(`${image.id}_${microRegion}`)) {
        return false;
      }

      return (
        hasAvailableImageOsInSelectedFlavor(
          entities.regionalizedFlavors.byId,
          regionalizedFlavorId,
          image.osType,
        ) &&
        hasImageOsTypeStockAvailable(
          regionalizedFlavorId,
          image.osType,
          entities.regionalizedFlavorOsTypes.byId,
        )
      );
    });
  });

  return typeAvailability;
};

export const selectAvailableImagesTypes: TSelectAvailableImageTypes = (
  deps,
) => (projectId, regionalizedFlavorId, microRegion, hasEligibleBackup) => {
  const { instancesCatalogPort } = deps;
  const entities = instancesCatalogPort.selectInstancesCatalog(projectId)
    ?.entities;

  const imageTypesOrder: TImageTypeName[] = ['linux', 'apps', 'windows'];
  const allImageTypes = [...imageTypesOrder, 'backups'] as const;

  if (!entities || !regionalizedFlavorId) {
    return allImageTypes.map((type) => ({
      labelKey: `pci_instances_common_${type}_image_type`,
      value: type,
      disabled: true,
    }));
  }

  if (!microRegion) {
    return allImageTypes.map((type) => ({
      labelKey: `pci_instances_common_${type}_image_type`,
      value: type,
      disabled: true,
    }));
  }

  const typeAvailability = getImageTypeAvailability({
    entities,
    regionalizedFlavorId,
    microRegion,
  });

  return allImageTypes.map((type) => {
    if (type === 'backups') {
      return {
        labelKey: `pci_instances_common_${type}_image_type`,
        value: type,
        disabled: !hasEligibleBackup,
      };
    }

    const disabled = !typeAvailability[type];

    return {
      labelKey: `pci_instances_common_${type}_image_type`,
      value: type,
      disabled,
    };
  });
};

export type TImageOsType = 'baremetal-linux' | 'bsd' | 'linux' | 'windows';

export type TImageOption = {
  label: string;
  value: string;
  available: boolean;
  osType: TImageOsType;
  windowsId?: string;
  windowsHourlyLicensePrice?: number;
  windowsMonthlyLicensePrice?: number;
};

export type TCustomData = { available: boolean };
export type TAvailableOption = SelectOptionItem<TCustomData>;

export type TSelectImagesOptions = {
  images: TImageOption[];
  versions: TAvailableOption[];
  preselected: {
    preselectedFirstAvailableVariantId: string | null;
    preselectedFirstAvailableVersion: TAvailableOption | null;
  };
};

type TSelectImageDataArgs = {
  projectId: string;
  selectedImageType: TImageTypeName;
  microRegion: string | null;
  regionalizedFlavorId: string | null;
  distributionImageVariantId: string | null;
};

type TSelectImageData = (args: TSelectImageDataArgs) => TSelectImagesOptions;

type TSelectImages = Reader<Deps, TSelectImageData>;

export const emptyResult = {
  images: [],
  versions: [],
  preselected: {
    preselectedFirstAvailableVariantId: null,
    preselectedFirstAvailableVersion: null,
  },
};

const getOptions = (
  variantOptionsMap: Map<string, TImageOption>,
  imagesVersionsMap: Map<string, TAvailableOption[]>,
  distributionImageVariantId: string | null,
) => {
  const variants = [...variantOptionsMap.values()];

  const hasAtLeastOneAvailableVariant = variants.some(
    (variant) => variant.available,
  );

  const variantsOptions = hasAtLeastOneAvailableVariant ? variants : [];

  const preselectedFirstAvailableVariantId =
    variants.find((variant) => variant.available)?.value ?? null;

  const preselectedFirstAvailableVersion = preselectedFirstAvailableVariantId
    ? imagesVersionsMap
        .get(preselectedFirstAvailableVariantId)
        ?.find((version) => !version.disabled) ?? null
    : null;

  const variant =
    distributionImageVariantId ?? preselectedFirstAvailableVariantId;

  const versions: TAvailableOption[] = variant
    ? imagesVersionsMap.get(variant) ?? []
    : [];

  const hasAtLeastOneAvailableVersion = versions.some(
    (version) => !version.disabled,
  );

  const versionsOptions = hasAtLeastOneAvailableVersion ? versions : [];

  return {
    images: variantsOptions,
    versions: versionsOptions,
    preselected: {
      preselectedFirstAvailableVariantId,
      preselectedFirstAvailableVersion,
    },
  };
};

const addVersionToMap = (
  imagesVersionsMap: Map<string, TAvailableOption[]>,
  image: TImage,
  regionalizedImage?: TRegionalizedImage,
) => {
  const imagesVersionsMapVariant = imagesVersionsMap.get(image.variant);

  if (!imagesVersionsMapVariant) {
    imagesVersionsMap.set(image.variant, [
      {
        label: image.id,
        value: regionalizedImage ? regionalizedImage.imageId : image.id,
        disabled: !regionalizedImage,
        customRendererData: {
          available: !!regionalizedImage,
        },
      },
    ]);
  } else {
    imagesVersionsMapVariant.push({
      label: image.id,
      value: regionalizedImage ? regionalizedImage.imageId : image.id,
      disabled: !regionalizedImage,
      customRendererData: { available: !!regionalizedImage },
    });
  }
};

const hasImageOsTypeStockAvailable = (
  regionalizedFlavorId: string,
  osType: TOsType,
  regionalizedFlavorOsTypesById: Map<string, TRegionalizedFlavorOsType>,
) => {
  const regionalizedFlavorOsTypeId = `${regionalizedFlavorId}_${osType}`;
  return (
    regionalizedFlavorOsTypesById.get(regionalizedFlavorOsTypeId)?.hasStock ??
    false
  );
};

const getCorrespondingTypes = (
  flavorAvailableOsTypes: TImageOsType[],
): TImageTypeName[] =>
  flavorAvailableOsTypes.map((flavorOsType) => {
    switch (flavorOsType) {
      case 'baremetal-linux':
      case 'bsd':
      case 'linux':
        return 'linux';
      case 'windows':
        return 'windows';
    }
  });

const isSelectedImageTypeAcceptedByFlavor = (
  regionalizedFlavorsById: Map<string, TRegionalizedFlavor>,
  regionalizedFlavorId: string,
  imageType: TImageTypeName,
) => {
  const flavorAvailableOsTypes =
    regionalizedFlavorsById.get(regionalizedFlavorId)?.osTypes ?? [];

  const correspondingTypes = getCorrespondingTypes(flavorAvailableOsTypes);
  const type = imageType === 'windows' ? 'windows' : 'linux';
  return correspondingTypes.includes(type);
};

const hasAvailableImageOsInSelectedFlavor = (
  regionalizedFlavorsById: Map<string, TRegionalizedFlavor>,
  regionalizedFlavorId: string,
  osType: TOsType,
) => {
  const flavorAvailableOsTypes =
    regionalizedFlavorsById.get(regionalizedFlavorId)?.osTypes ?? [];
  return flavorAvailableOsTypes.includes(osType);
};

const updateImageVariantAvailability = (
  imagesVersionsMap: Map<string, TAvailableOption[]>,
  image: TImage,
  acc: Map<string, TImageOption>,
) => {
  const imageVersions = imagesVersionsMap.get(image.variant);
  if (!!imageVersions) {
    const hasAvailableVersion = imageVersions.some(
      (version) => !version.disabled,
    );
    const variantToUpdate = acc.get(image.variant);
    if (hasAvailableVersion && variantToUpdate) {
      acc.set(image.variant, {
        ...variantToUpdate,
        available: true,
      });
    }
  }
};

const handleImageVersions = (
  acc: Map<string, TImageOption>,
  args: {
    regionalizedFlavorId: string;
    image: TImage;
    entities: TInstancesCatalog['entities'];
    microRegion: string;
    imagesVersionsMap: Map<string, TAvailableOption[]>;
  },
) => {
  const {
    regionalizedFlavorId,
    image,
    entities,
    microRegion,
    imagesVersionsMap,
  } = args;

  const hasImageOsTypeStock = hasImageOsTypeStockAvailable(
    regionalizedFlavorId,
    image.osType,
    entities.regionalizedFlavorOsTypes.byId,
  );
  if (!hasImageOsTypeStock) return acc;

  const regionalizedImage = entities.regionalizedImages.byId.get(
    `${image.id}_${microRegion}`,
  );

  addVersionToMap(imagesVersionsMap, image, regionalizedImage);
  updateImageVariantAvailability(imagesVersionsMap, image, acc);
  return acc;
};

const createWindowsImageVariant = (
  acc: Map<string, TImageOption>,
  args: {
    regionalizedFlavorId: string;
    image: TImage;
    entities: TInstancesCatalog['entities'];
    imagesVersionIds: string[];
    microRegion: string;
  },
) => {
  const {
    regionalizedFlavorId,
    image,
    entities,
    imagesVersionIds,
    microRegion,
  } = args;
  const regionalizedFlavorWindowsId = `${regionalizedFlavorId}_${image.variant}`;
  const hasWindowsStock =
    entities.regionalizedFlavorOsTypes.byId.get(regionalizedFlavorWindowsId)
      ?.hasStock ?? false;

  imagesVersionIds.forEach((imageId) => {
    const windowsVersionId = entities.regionalizedImages.byId.get(
      `${imageId}_${microRegion}`,
    )?.imageId;

    const windowsPrices =
      entities.flavorPrices.byId.get(`${regionalizedFlavorWindowsId}_price`)
        ?.prices ?? [];

    const windowsHourlyLicensePrice = windowsPrices.find(
      (price) => price.type === 'licence',
    )?.price.priceInUcents;

    const windowsMonthlyLicensePrice = windowsPrices.find(
      (price) => price.type === 'licenceMonth',
    )?.price.priceInUcents;

    if (!windowsVersionId || !windowsHourlyLicensePrice) return acc;

    acc.set(imageId, {
      label: imageId,
      value: imageId,
      windowsId: windowsVersionId,
      available: hasWindowsStock,
      windowsHourlyLicensePrice,
      windowsMonthlyLicensePrice,
      osType: image.osType,
    });
  });
  return acc;
};

export const selectImages: TSelectImages = (deps) => ({
  projectId,
  selectedImageType,
  microRegion,
  regionalizedFlavorId,
  distributionImageVariantId,
}) => {
  const { instancesCatalogPort } = deps;
  const entities = instancesCatalogPort.selectInstancesCatalog(projectId)
    ?.entities;

  if (!entities || !microRegion || !regionalizedFlavorId) return emptyResult;

  const imagesVersionIds =
    entities.imageTypes.byId.get(selectedImageType)?.imageIds ?? [];

  const imagesVersionsMap = new Map<string, TAvailableOption[]>();

  const variantOptionsMap = imagesVersionIds.reduce((acc, imageId) => {
    const image = entities.images.byId.get(imageId);
    if (!image) return acc;

    const selectedFlavorAcceptsOsImage = hasAvailableImageOsInSelectedFlavor(
      entities.regionalizedFlavors.byId,
      regionalizedFlavorId,
      image.osType,
    );

    const variantInMap = acc.get(image.variant);

    if (!variantInMap) {
      if (image.osType === 'windows') {
        if (!selectedFlavorAcceptsOsImage) {
          acc.set(imageId, {
            label: imageId,
            value: imageId,
            // `available` will be updated according to image versions availability
            available: false,
            osType: image.osType,
          });
          return acc;
        }

        return createWindowsImageVariant(acc, {
          regionalizedFlavorId,
          image,
          entities,
          imagesVersionIds,
          microRegion,
        });
      } else {
        acc.set(image.variant, {
          label: image.variant,
          value: image.variant,
          available: false,
          osType: image.osType,
        });
        if (!selectedFlavorAcceptsOsImage) return acc;
      }
    }

    return handleImageVersions(acc, {
      regionalizedFlavorId,
      image,
      entities,
      microRegion,
      imagesVersionsMap,
    });
  }, new Map<string, TImageOption>());

  return getOptions(
    variantOptionsMap,
    imagesVersionsMap,
    distributionImageVariantId,
  );
};

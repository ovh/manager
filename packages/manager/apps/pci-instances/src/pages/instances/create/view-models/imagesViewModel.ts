/* eslint-disable max-lines-per-function */
import { Deps } from '@/deps/deps';
import {
  TImage,
  TInstancesCatalog,
  TOsType,
  TRegionalizedFlavor,
  TRegionalizedFlavorOsType,
  TRegionalizedImage,
} from '@/domain/entities/instancesCatalog';
import { Reader } from '@/types/utils.type';
import { SelectOptionItem } from '@ovhcloud/ods-react';

export type TOption = { labelKey: string; value: string };

type TSelectImageTypesData = (projectId: string) => TOption[];

type TSelectImageTypes = Reader<Deps, TSelectImageTypesData>;

export const selectImagesTypes: TSelectImageTypes = (deps) => (projectId) => {
  const { instancesCatalogPort } = deps;
  const entities = instancesCatalogPort.selectInstancesCatalog(projectId)
    ?.entities;

  if (!entities) return [];

  return entities.imageTypes.allIds.map((type) => ({
    labelKey: `pci_instances_common_${type}_image_type`,

    value: type,
  }));
};

export type TImageOsType = 'baremetal-linux' | 'bsd' | 'linux' | 'windows';

export type TImageOption = {
  label: string;
  value: string;
  available: boolean;
  osType: TImageOsType;
  windowsId?: string;
  windowsHourlyLicensePrice?: number;
};

export type TCustomData = { available: boolean };
export type TAvailableOption = SelectOptionItem<TCustomData>;

export type TSelectImagesOptions = {
  images: TImageOption[];
  versions: Map<string, TAvailableOption[]>;
  preselected: {
    preselectedFirstAvailableVariantId: string | null;
    preselectedFirstAvailableVersion: TAvailableOption | null;
  };
};

type TSelectImageData = (
  projectId: string,
  selectedImageType: string | null,
  microRegion: string | null,
  regionalizedFlavorId: string | null,
) => TSelectImagesOptions;

type TselectImages = Reader<Deps, TSelectImageData>;

const emptyResult = {
  images: [],
  versions: new Map<string, TAvailableOption[]>(),
  preselected: {
    preselectedFirstAvailableVariantId: null,
    preselectedFirstAvailableVersion: null,
  },
};

const getOptions = (
  variantOptionsMap: Map<string, TImageOption>,
  imagesVersionsMap: Map<string, TAvailableOption[]>,
) => {
  const variants = [...variantOptionsMap.values()];

  const preselectedFirstAvailableVariantId =
    variants.find((variant) => variant.available)?.value ?? null;

  const preselectedFirstAvailableVersion = preselectedFirstAvailableVariantId
    ? imagesVersionsMap
        .get(preselectedFirstAvailableVariantId)
        ?.find((version) => !version.disabled) ?? null
    : null;

  return {
    images: variants,
    versions: imagesVersionsMap,
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

    const windowsHourlyLicensePrice = entities.flavorPrices.byId
      .get(`${regionalizedFlavorWindowsId}_price`)
      ?.prices.find((price) => price.type === 'licence')?.price.priceInUcents;

    if (!windowsVersionId || !windowsHourlyLicensePrice) return acc;

    acc.set(imageId, {
      label: imageId,
      value: imageId,
      windowsId: windowsVersionId,
      available: hasWindowsStock,
      windowsHourlyLicensePrice,
      osType: image.osType,
    });
  });
  return acc;
};

export const selectImages: TselectImages = (deps) => (
  projectId,
  selectedImageType,
  microRegion,
  regionalizedFlavorId,
) => {
  const { instancesCatalogPort } = deps;
  const entities = instancesCatalogPort.selectInstancesCatalog(projectId)
    ?.entities;

  if (!entities || !selectedImageType || !microRegion || !regionalizedFlavorId)
    return emptyResult;

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

  return getOptions(variantOptionsMap, imagesVersionsMap);
};

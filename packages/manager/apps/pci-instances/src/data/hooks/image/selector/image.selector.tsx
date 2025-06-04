import { TFunction } from 'i18next';
import { TImageDto } from '@/types/image/api.types';
import { TImage } from '@/types/image/entity.type';

const imageMapper = (image: TImageDto): TImage => ({
  id: image.id,
  name: image.name,
});

const RESCUE_TYPE = 'rescue';
const RESCUE_IMAGE_NAME = 'rescue-ovh';

export const imagesOptionsSelector = (data: TImage[]) => {
  return data.map((image) => ({
    label: image.name,
    value: image.id,
  }));
};

export const imagesRescueSelector = (
  data: TImageDto[],
  t: TFunction<'actions', undefined>,
): { label: string; value: string }[] => {
  const rescueImages = data
    .filter((image) => image.type === RESCUE_TYPE)
    .map((image) => ({
      id: image.id,
      name:
        image.name === RESCUE_IMAGE_NAME
          ? t('pci_instances_actions_rescue_start_instance_rescue_image_label')
          : image.name,
    }));

  const otherImages = data
    .filter((image) => image.type !== RESCUE_TYPE)
    .map(imageMapper);

  const images = [
    ...rescueImages.sort((a, b) => a.name.localeCompare(b.name)),
    ...otherImages.sort((a, b) => a.name.localeCompare(b.name)),
  ];

  return imagesOptionsSelector(images);
};

import type { TVpsImage } from '@/domain/entities/vps';
import {
  groupImagesByType,
  filterAvailableImages,
} from '@/domain/services/vpsTransform.service';

export type TImageForView = {
  id: string;
  name: string;
  distribution: string;
  type: string;
};

export type TGroupedImagesForView = Record<string, Array<TImageForView>>;

const mapImageToView = (image: TVpsImage): TImageForView => ({
  id: image.id,
  name: image.name,
  distribution: image.distribution,
  type: image.type,
});

export const selectImagesForView = (
  images?: Array<TVpsImage>,
): TGroupedImagesForView => {
  if (!images) return {};

  const availableImages = filterAvailableImages(images);
  const grouped = groupImagesByType(availableImages);

  const result: TGroupedImagesForView = {};

  Object.entries(grouped).forEach(([type, typeImages]) => {
    if (typeImages.length > 0) {
      result[type] = typeImages.map(mapImageToView);
    }
  });

  return result;
};

import { TFunction } from 'i18next';
import { imagesRescueSelector } from './image.selector';
import { TImageDto } from '@/types/image/api.types';

const t: TFunction = ((key: string, options?: { name: string }) => {
  if (options && options.name) {
    return `${key} ${options.name}`;
  }

  return key;
}) as TFunction;

const fakeImage: TImageDto = {
  name: 'Ubuntu',
  osType: '',
  baseImageRef: '',
  createdAt: '',
  id: 'foo',
  region: '',
  size: 0,
  status: 'active',
  type: 'official',
  visibility: 'public',
};

describe('imagesRescueSelector', () => {
  it('should prioritize rescue images and sort the rest alphabetically', () => {
    const images: TImageDto[] = [
      { ...fakeImage, id: '3' },
      { ...fakeImage, id: '1', name: 'Rescue Image', type: 'rescue' },
      { ...fakeImage, id: '2', name: 'CentOS' },
    ];

    const result = imagesRescueSelector(images, t);

    expect(result).toEqual([
      { value: '1', label: 'Rescue Image' },
      { value: '2', label: 'CentOS' },
      { value: '3', label: 'Ubuntu' },
    ]);
  });

  it('should handle an array with only rescue images and rescue-ovh', () => {
    const images: TImageDto[] = [
      { ...fakeImage, id: '1', name: 'rescue-ovh', type: 'rescue' },
      { ...fakeImage, id: '2', name: 'Rescue Image', type: 'rescue' },
    ];

    const result = imagesRescueSelector(images, t);

    expect(result).toEqual([
      {
        value: '1',
        label: 'pci_instances_actions_rescue_start_instance_rescue_image_label',
      },
      { value: '2', label: 'Rescue Image' },
    ]);
  });

  it('should handle an array with no rescue images', () => {
    const images: TImageDto[] = [
      { ...fakeImage, id: '3' },
      { ...fakeImage, id: '2', name: 'CentOS' },
    ];

    const result = imagesRescueSelector(images, t);

    expect(result).toEqual([
      { value: '2', label: 'CentOS' },
      { value: '3', label: 'Ubuntu' },
    ]);
  });
});

import { TFunction } from 'i18next';
import { imagesRescueSelector } from './image.selector';
import { TImage } from '@/data/api/image';

const t: TFunction = ((key: string, options?: any) => {
  if (options && options.name) {
    return `${key} ${options.name}`;
  }

  return key;
}) as TFunction;

describe('imagesRescueSelector', () => {
  it('should prioritize rescue images and sort the rest alphabetically', () => {
    const images: TImage[] = [
      { id: '3', name: 'Ubuntu', type: 'standard' },
      { id: '1', name: 'Rescue Image', type: 'rescue' },
      { id: '2', name: 'CentOS', type: 'standard' },
    ];

    const result = imagesRescueSelector(images, t);

    expect(result).toEqual([
      { id: '1', name: 'Rescue Image' },
      { id: '2', name: 'CentOS' },
      { id: '3', name: 'Ubuntu' },
    ]);
  });

  it('should handle an array with only rescue images and rescue-ovh', () => {
    const images: TImage[] = [
      { id: '1', name: 'rescue-ovh', type: 'rescue' },
      { id: '2', name: 'Rescue Image', type: 'rescue' },
    ];

    const result = imagesRescueSelector(images, t);

    expect(result).toEqual([
      {
        id: '1',
        name: 'pci_instances_actions_rescue_start_instance_rescue_image_label',
      },
      { id: '2', name: 'Rescue Image' },
    ]);
  });

  it('should handle an array with no rescue images', () => {
    const images: TImage[] = [
      { id: '3', name: 'Ubuntu', type: 'standard' },
      { id: '2', name: 'CentOS', type: 'standard' },
    ];

    const result = imagesRescueSelector(images, t);

    expect(result).toEqual([
      { id: '2', name: 'CentOS' },
      { id: '3', name: 'Ubuntu' },
    ]);
  });
});

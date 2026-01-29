import type { TVps, TVpsImage } from '../entities/vps';

export const formatMemory = (memoryInMb: number): string => {
  if (memoryInMb >= 1024) {
    return `${(memoryInMb / 1024).toFixed(0)} GB`;
  }
  return `${memoryInMb} MB`;
};

export const formatDiskSize = (sizeInGb: number): string => {
  if (sizeInGb >= 1000) {
    return `${(sizeInGb / 1000).toFixed(1)} TB`;
  }
  return `${sizeInGb} GB`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const getVpsDisplayTitle = (vps: TVps): string =>
  vps.displayName || vps.serviceName;

export const groupImagesByType = (
  images: Array<TVpsImage>,
): Record<string, Array<TVpsImage>> => {
  const grouped: Record<string, Array<TVpsImage>> = {
    linux: [],
    windows: [],
    plesk: [],
    cpanel: [],
    other: [],
  };

  images.forEach((image) => {
    const category = image.type in grouped ? image.type : 'other';
    grouped[category].push(image);
  });

  return grouped;
};

export const filterAvailableImages = (
  images: Array<TVpsImage>,
): Array<TVpsImage> => images.filter((image) => image.available);

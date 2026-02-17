import { useBytes } from '@ovh-ux/muk';

export const useFormatGiBSize = (sizeInGiB: number) => {
  const { formatBytes } = useBytes();

  return formatBytes(sizeInGiB * 1024 * 1024 * 1024, 3, 1024);
};

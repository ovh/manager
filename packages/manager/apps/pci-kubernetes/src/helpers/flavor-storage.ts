export type TFlavorDisk = {
  number: number;
  capacity: number;
  sizeUnit: string;
  technology: string;
};

export type TLocalStorageDisk = {
  id: string;
  count: number;
  capacityInBytes: number;
  technology: string;
};

const GIGABYTE = 10 ** 9;
const NVME_TECHNOLOGY = 'NVMe';

const toDiskCount = (number: number) => (Number.isFinite(number) && number > 0 ? number : 1);

const toLocalStorageDisk =
  (isNvme: boolean) =>
  (disk: TFlavorDisk, index: number): TLocalStorageDisk => {
    const technology = isNvme ? NVME_TECHNOLOGY : disk.technology;

    return {
      id: `${technology}-${disk.number}-${disk.capacity}-${index}`,
      count: toDiskCount(disk.number),
      capacityInBytes: disk.capacity * GIGABYTE,
      technology,
    };
  };

export const selectLocalStorageDisks = (
  storageDisks?: TFlavorDisk[],
  nvmeDisks?: TFlavorDisk[],
): TLocalStorageDisk[] => [
  ...(storageDisks ?? []).map(toLocalStorageDisk(false)),
  ...(nvmeDisks ?? []).map(toLocalStorageDisk(true)),
];

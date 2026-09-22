import { beforeEach, describe, expect, it } from 'vitest';
import { selectFlavorDisks } from '../selectFlavorDisks';
import {
  TDisk,
  TFlavor,
  TInstancesCatalog,
} from '@/domain/entities/instancesCatalog';
import { TDiskViewModel } from '@/pages/instances/create/view-models/mappers/diskMapper';

const nvmeDisk: TDisk = {
  capacity: { value: 100, unit: 'GB' },
  number: 1,
  interface: 'NVMe',
};

const catalogHolding = (flavors: [string, TDisk[]][]): TInstancesCatalog =>
  (({
    entities: {
      flavors: {
        byId: new Map(
          flavors.map(([name, disks]) => [
            name,
            { name, specifications: { disks } } as TFlavor,
          ]),
        ),
        allIds: flavors.map(([name]) => name),
      },
    },
  } as unknown) as TInstancesCatalog);

const nvmeDiskViewModel: TDiskViewModel = {
  id: '1_100_GB_NVMe_0',
  number: 1,
  capacityValue: 100,
  capacityUnit: 'gb',
  interface: 'NVMe',
};

const noDiskViewModel: TDiskViewModel = {
  id: 'no-disk',
  display: '-',
  number: 0,
  capacityValue: 0,
  capacityUnit: 'gb',
  interface: null,
};

describe.each`
  given                                  | catalog                                   | flavorName | expectedDisks
  ${'no catalog'}                        | ${undefined}                              | ${'b3-8'}  | ${null}
  ${'no flavor to look up'}              | ${catalogHolding([['b3-8', [nvmeDisk]]])} | ${null}    | ${null}
  ${'a flavor absent from the catalog'}  | ${catalogHolding([['b3-8', [nvmeDisk]]])} | ${'c3-4'}  | ${null}
  ${'the flavor, named identically'}     | ${catalogHolding([['b3-8', [nvmeDisk]]])} | ${'b3-8'}  | ${[nvmeDiskViewModel]}
  ${'the flavor, named in another case'} | ${catalogHolding([['B3-8', [nvmeDisk]]])} | ${'b3-8'}  | ${[nvmeDiskViewModel]}
  ${'the flavor, holding no disk'}       | ${catalogHolding([['b3-8', []]])}         | ${'b3-8'}  | ${[noDiskViewModel]}
`(
  'given $given',
  ({
    catalog,
    flavorName,
    expectedDisks,
  }: {
    catalog: TInstancesCatalog | undefined;
    flavorName: string | null;
    expectedDisks: TDiskViewModel[] | null;
  }) => {
    describe('when selecting the disks of the flavor', () => {
      let disks: TDiskViewModel[] | null;

      beforeEach(() => {
        disks = selectFlavorDisks(flavorName)(catalog);
      });

      it('reads them from the catalog whatever the casing of the flavor name', () => {
        expect(disks).toStrictEqual(expectedDisks);
      });
    });
  },
);

import { describe, expect, it } from 'vitest';
import {
  computeList,
  VCDCompute,
  storageList,
  VCDStorage,
} from '@ovh-ux/manager-module-vcd-api';
import {
  isVdcResourceDeletable,
  isVdcFreespareResource,
} from './vdcResourceDeletion';
import { VDC_RESOURCE_DELETION_TOOLTIPS } from './vdcResourceDeletion.constants';

describe('isVdcFreespareResource function test suite', () => {
  it.each([
    { type: 'compute', profile: 'vhost-5-0-FREESPARE', expected: true },
    { type: 'compute', profile: 'vhost-5-0-freespare', expected: true },
    { type: 'compute', profile: 'vhost-5-0-free-spare', expected: false },
    { type: 'compute', profile: 'vhost-5-0-initial-pack', expected: false },
    { type: 'storage', profile: 'storage-5-0-FREESPARE', expected: true },
    { type: 'storage', profile: 'storage-5-0-freespare', expected: true },
    { type: 'storage', profile: 'storage-5-0-free-spare', expected: false },
    { type: 'storage', profile: 'storage-5-0-initial-pack', expected: false },
  ])(
    'should return $expected with plancode $profile',
    ({ type, profile, expected }) => {
      if (type === 'compute') {
        const resource: VCDCompute = {
          ...computeList[0],
          currentState: { ...computeList[0].currentState, profile },
        };
        expect(isVdcFreespareResource(resource)).toBe(expected);
      } else {
        const resource: VCDStorage = {
          ...storageList[0],
          currentState: { ...storageList[0].currentState, profile },
        };
        expect(isVdcFreespareResource(resource)).toBe(expected);
      }
    },
  );
});

describe('isVdcResourceDeletable function test suite', () => {
  const makeFree = <T extends VCDCompute | VCDStorage>(
    resource: T,
    id: string,
  ): T => ({
    ...resource,
    id,
    currentState: {
      ...resource.currentState,
      profile: `${resource.currentState.profile}-freespare`,
    },
  });

  const freeCompute = makeFree(computeList[0], 'free-compute-id');
  const freeCompute2 = makeFree(computeList[1], 'free-compute-id-2');
  const freeStorage = makeFree(storageList[0], 'free-storage-id');
  const freeStorage2 = makeFree(storageList[1], 'free-storage-id-2');

  type ComputeCase = {
    type: 'compute';
    desc: string;
    resourceList: VCDCompute[];
    resource?: VCDCompute;
    expected: { isDeletable: boolean; tooltip: string };
  };
  type StorageCase = {
    type: 'storage';
    desc: string;
    resourceList: VCDStorage[];
    resource?: VCDStorage;
    expected: { isDeletable: boolean; tooltip: string };
  };

  const testCases: (ComputeCase | StorageCase)[] = [
    {
      type: 'compute',
      desc: 'return false & tooltip=default when no resource is provided',
      resourceList: computeList,
      resource: undefined,
      expected: {
        isDeletable: false,
        tooltip: VDC_RESOURCE_DELETION_TOOLTIPS.default,
      },
    },
    {
      type: 'compute',
      desc: 'return false & tooltip=minQuantity if only 1 compute',
      resourceList: computeList.slice(0, 1),
      resource: computeList[0],
      expected: {
        isDeletable: false,
        tooltip: VDC_RESOURCE_DELETION_TOOLTIPS.compute.minQuantity,
      },
    },
    {
      type: 'compute',
      desc:
        'return false & tooltip=freeFirst when deleting a paying compute while a free one exists',
      resourceList: [...computeList, freeCompute],
      resource: computeList[1],
      expected: {
        isDeletable: false,
        tooltip: VDC_RESOURCE_DELETION_TOOLTIPS.compute.freeFirst,
      },
    },
    {
      type: 'compute',
      desc: 'return true & tooltip=empty when deleting the free compute itself',
      resourceList: [...computeList, freeCompute],
      resource: freeCompute,
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      type: 'compute',
      desc:
        'return true & tooltip=empty when deleting a compute in a list without a free one',
      resourceList: computeList.filter((c) => !isVdcFreespareResource(c)),
      resource: computeList[0],
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      type: 'compute',
      desc:
        'return true & tooltip=empty when deleting the first freespare among several',
      resourceList: [...computeList, freeCompute, freeCompute2],
      resource: freeCompute,
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      type: 'compute',
      desc:
        'return true & tooltip=empty when deleting a non-first freespare among several',
      resourceList: [...computeList, freeCompute, freeCompute2],
      resource: freeCompute2,
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      type: 'storage',
      desc: 'return false & tooltip=default when no resource is provided',
      resourceList: storageList,
      resource: undefined,
      expected: {
        isDeletable: false,
        tooltip: VDC_RESOURCE_DELETION_TOOLTIPS.default,
      },
    },
    {
      type: 'storage',
      desc: 'return false & tooltip=minQuantity if only 1 storage',
      resourceList: storageList.slice(0, 1),
      resource: storageList[0],
      expected: {
        isDeletable: false,
        tooltip: VDC_RESOURCE_DELETION_TOOLTIPS.storage.minQuantity,
      },
    },
    {
      type: 'storage',
      desc:
        'return false & tooltip=freeFirst when deleting a paying storage while a free one exists',
      resourceList: [...storageList, freeStorage],
      resource: storageList[1],
      expected: {
        isDeletable: false,
        tooltip: VDC_RESOURCE_DELETION_TOOLTIPS.storage.freeFirst,
      },
    },
    {
      type: 'storage',
      desc: 'return true & tooltip=empty when deleting the free storage itself',
      resourceList: [...storageList, freeStorage],
      resource: freeStorage,
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      type: 'storage',
      desc:
        'return true & tooltip=empty when deleting a storage in a list without a free one',
      resourceList: storageList.filter((s) => !isVdcFreespareResource(s)),
      resource: storageList[0],
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      type: 'storage',
      desc:
        'return true & tooltip=empty when deleting the first freespare among several',
      resourceList: [...storageList, freeStorage, freeStorage2],
      resource: freeStorage,
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      type: 'storage',
      desc:
        'return true & tooltip=empty when deleting a non-first freespare among several',
      resourceList: [...storageList, freeStorage, freeStorage2],
      resource: freeStorage2,
      expected: { isDeletable: true, tooltip: '' },
    },
  ];

  it.each(testCases)('[$type] $desc', (testCase) => {
    const result = isVdcResourceDeletable(testCase);
    expect(result.isDeletable).toBe(testCase.expected.isDeletable);
    expect(result.tooltipTranslationKey).toBe(testCase.expected.tooltip);
  });
});

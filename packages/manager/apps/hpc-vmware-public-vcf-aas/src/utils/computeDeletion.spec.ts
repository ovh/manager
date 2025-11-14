import { describe, expect, it } from 'vitest';
import {
  computeList as mocks,
  VCDCompute,
} from '@ovh-ux/manager-module-vcd-api';
import { FREE_COMPUTE_PLANCODE, isComputeDeletable } from './computeDeletion';

const config = {
  tooltipDefault: 'managed_vcd_vdc_contact_support',
  tooltipMinQuantity: 'managed_vcd_vdc_compute_delete_tooltip_min_quantity',
  tooltipDeleteFreeFirst: 'managed_vcd_vdc_compute_delete_tooltip_free_compute',
};

describe('isComputeDeletable function test suite', () => {
  const freeComputeIndex = 0;
  const freeCompute: VCDCompute = {
    ...mocks[freeComputeIndex],
    currentState: {
      ...mocks[freeComputeIndex].currentState,
      profile: FREE_COMPUTE_PLANCODE,
    },
  };

  const testCases: {
    desc: string;
    computeList: VCDCompute[];
    compute: VCDCompute;
    expected: { isDeletable: boolean; tooltip: string };
  }[] = [
    {
      desc: 'return false & tooltip=contactSupport by default',
      compute: (undefined as unknown) as VCDCompute,
      computeList: mocks,
      expected: { isDeletable: false, tooltip: config.tooltipDefault },
    },
    {
      desc: 'return false & tooltip=minQuantity if only 1 compute',
      compute: mocks[0],
      computeList: mocks.slice(0, 1),
      expected: { isDeletable: false, tooltip: config.tooltipMinQuantity },
    },
    {
      desc:
        'return false & tooltip=deleteFree for deleting a paying compute with a free one in the list',
      compute: mocks[freeComputeIndex + 1],
      computeList: [...mocks, freeCompute],
      expected: { isDeletable: false, tooltip: config.tooltipDeleteFreeFirst },
    },
    {
      desc: 'return true & tooltip=empty for deleting a free compute',
      compute: mocks[0],
      computeList: [...mocks, freeCompute],
      expected: { isDeletable: true, tooltip: '' },
    },
    {
      desc:
        'return true & tooltip=empty for deleting a compute in a list without a free one',
      compute: mocks[0],
      computeList: mocks.filter(
        (c) => c.currentState.profile !== FREE_COMPUTE_PLANCODE,
      ),
      expected: { isDeletable: true, tooltip: '' },
    },
  ];

  it.each(testCases)('$desc', ({ expected, compute, computeList }) => {
    const result = isComputeDeletable({ computeList, compute });
    expect(result.isDeletable).toBe(expected.isDeletable);
    expect(result.tooltipTranslationKey).toBe(expected.tooltip);
  });
});

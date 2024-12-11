import { TVolume } from '@ovh-ux/manager-pci-common';
import * as pciCommon from '@ovh-ux/manager-pci-common';
import { UseQueryResult } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import VolumeList from './VolumeList.component';

const mockAllVolumes = vi.hoisted(() => [
  {
    id: 'volume-1',
    attachedTo: ['2345678'],
    creationDate: '2024-12-06T14:38:53Z',
    name: 'test-rabat',
    description: '',
    size: 10,
    status: 'in-use',
    region: 'AF-NORTH-LZ-RBA-A',
    bootable: false,
    planCode: 'plan-code',
    type: 'high-speed-gen2',
  },
  {
    id: 'volume-2',
    attachedTo: ['12345678'],
    creationDate: '2024-11-18T10:23:22Z',
    name: 'BlockRelease',
    description: '',
    size: 10,
    status: 'error',
    region: 'AF-NORTH-LZ-RBA-A',
    bootable: false,
    planCode: 'plan-code',
    type: 'high-speed',
  },
  {
    id: 'volume-3',
    attachedTo: ['1234567'],
    creationDate: '2024-10-31T08:59:16Z',
    name: 'VolRabaSpeed',
    description: '',
    size: 10,
    status: 'error',
    region: 'AF-NORTH-LZ-RBA-A',
    bootable: false,
    planCode: 'plan-code',
    type: 'high-speed',
  },
]);

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useVolumes: vi.fn().mockReturnValue({
      data: mockAllVolumes,
      isPending: false,
    } as UseQueryResult<TVolume[], Error>),
  };
});

describe('VolumeList', () => {
  const mockVolumes = [
    {
      quantity: {
        unit: 'GiBh',
        value: 2400,
      },
      totalPrice: 0.29,
      volumeId: 'volume-1',
      type: 'high-speed',
      region: 'EU-WEST-LZ-MRS-A',
    },
    {
      quantity: {
        unit: 'GiBh',
        value: 2600,
      },
      totalPrice: 0.31,
      volumeId: 'volume-2',
      type: 'high-speed-gen2',
      region: 'EU-WEST-LZ-BRU-A',
    },
    {
      quantity: {
        unit: 'GiBh',
        value: 650,
      },
      totalPrice: 0.08,
      volumeId: 'volume-3',
      type: 'high-speed-gen2',
      region: 'EU-CENTRAL-LZ-PRG-A',
    },
    {
      quantity: {
        unit: 'GiBh',
        value: 2000,
      },
      totalPrice: 0.24,
      volumeId: 'volume-4',
      type: 'high-speed-gen2',
      region: 'EU-CENTRAL-LZ-PRG-A',
    },
  ];

  it('matches snapshot with existing volumes', () => {
    vi.spyOn(pciCommon, 'useVolumes').mockReturnValue({
      data: mockAllVolumes,
      isPending: false,
    } as UseQueryResult<TVolume[], Error>);

    const { asFragment } = render(<VolumeList volumes={mockVolumes} />, {
      wrapper,
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty volumes', () => {
    vi.spyOn(pciCommon, 'useVolumes').mockReturnValue({
      data: mockAllVolumes,
      isPending: false,
    } as UseQueryResult<TVolume[], Error>);

    const { asFragment } = render(<VolumeList volumes={[]} />, {
      wrapper,
    });

    expect(asFragment()).toMatchSnapshot();
  });
});

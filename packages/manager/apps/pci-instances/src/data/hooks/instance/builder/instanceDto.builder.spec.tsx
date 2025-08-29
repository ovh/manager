import { describe, expect, test } from 'vitest';
import {
  buildPartialInstanceDto,
  buildPartialAggregatedInstanceDto,
} from './instanceDto.builder';
import {
  TAggregatedInstanceDto,
  TPartialAggregatedInstanceDto,
} from '@/types/instance/api.type';
import { TPartialInstance } from '@/types/instance/entity.type';

type Data = {
  desc: string;
  initial: TPartialAggregatedInstanceDto;
  steps: [
    keyof TAggregatedInstanceDto,
    TAggregatedInstanceDto[keyof TAggregatedInstanceDto],
  ][];
  expected: TPartialAggregatedInstanceDto;
};

type TInstanceData = {
  desc: string;
  instance: TPartialInstance;
  expected: TPartialAggregatedInstanceDto;
};

describe("Considering the 'buildPartialInstanceDto' function", () => {
  test.each<Data>([
    {
      desc: 'Should build with only id',
      initial: { id: 'instance-1' },
      steps: [],
      expected: { id: 'instance-1' },
    },
    {
      desc: 'Should build with name and pendingTask',
      initial: { id: 'instance-2' },
      steps: [
        ['name', 'my-instance'],
        ['pendingTask', true],
      ],
      expected: {
        id: 'instance-2',
        name: 'my-instance',
        pendingTask: true,
      },
    },
    {
      desc: 'Should override name field',
      initial: { id: 'instance-3', name: 'old-name' },
      steps: [['name', 'new-name']],
      expected: {
        id: 'instance-3',
        name: 'new-name',
      },
    },
    {
      desc: 'Should handle availabilityZone = null',
      initial: { id: 'instance-4' },
      steps: [['availabilityZone', null]],
      expected: {
        id: 'instance-4',
        availabilityZone: null,
      },
    },
  ])('$desc', ({ initial, steps, expected }: Data) => {
    let builder = buildPartialInstanceDto(initial);
    steps.forEach(([key, value]) => {
      builder = builder.with(key, value);
    });

    const result = builder.build();
    expect(result).toEqual(expected);
  });
});

describe("Considering the 'buildPartialAggregatedInstanceDto' function", () => {
  test.each<TInstanceData>([
    {
      desc: 'Should return TPartialAggregatedInstanceDto with only id and name',
      instance: {
        id: 'instance-1',
        name: 'instance 1',
        flavor: {
          id: 'fake-flavor',
          name: 'fake-flavor-name',
          specs: null,
        },
      },
      expected: { id: 'instance-1', name: 'instance 1' },
    },
    {
      desc: 'Should return TPartialAggregatedInstanceDto with id and region',
      instance: {
        id: 'instance-1',
        region: { name: 'fake-region', type: '', availabilityZone: null },
      },
      expected: {
        id: 'instance-1',
        region: 'fake-region',
      },
    },
    {
      desc: 'Should return TPartialAggregatedInstanceDto with id and status',
      instance: {
        id: 'instance-1',
        status: 'BUILDING',
      },
      expected: {
        id: 'instance-1',
        status: 'BUILDING',
      },
    },
    {
      desc:
        'Should return TPartialAggregatedInstanceDto with id and pedingTask',
      instance: {
        id: 'instance-1',
        task: {
          isPending: true,
          status: 'waiting',
        },
      },
      expected: {
        id: 'instance-1',
        taskState: 'waiting',
        pendingTask: true,
      },
    },
    {
      desc: 'Should return TPartialAggregatedInstanceDto with actions',
      instance: {
        id: 'instance-1',
        actions: [{ name: 'activate_monthly_billing', group: 'details' }],
      },
      expected: {
        id: 'instance-1',
        actions: [{ name: 'activate_monthly_billing', group: 'details' }],
      },
    },
    {
      desc: 'Should return TPartialAggregatedInstanceDto with volumes',
      instance: {
        id: 'instance-1',
        volumes: [{ id: 'fake-volume-1', name: 'fake-volume-1', size: 3 }],
      },
      expected: {
        id: 'instance-1',
        volumes: [{ id: 'fake-volume-1', name: 'fake-volume-1' }],
      },
    },
  ])('$desc', ({ instance, expected }: TInstanceData) => {
    const result = buildPartialAggregatedInstanceDto(instance);

    expect(result).toEqual(expected);
  });
});

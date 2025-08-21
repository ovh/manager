import { describe, expect, test } from 'vitest';
import {
  buildPartialInstanceDto,
  buildPartialInstanceFromInstancesDto,
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

type TInstanceDtoData = {
  desc: string;
  dto: TPartialAggregatedInstanceDto;
  expected: TPartialInstance;
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

describe("Considering the 'buildPartialInstanceFromInstancesDto' function", () => {
  test.each<TInstanceDtoData>([
    {
      desc: 'Should return TInstance with only id and name',
      dto: {
        id: 'instance-1',
        name: 'instance 1',
        flavorId: 'fake-flavor',
        flavorName: 'fake-flavor-name',
      },
      expected: { id: 'instance-1', name: 'instance 1' },
    },
    {
      desc: 'Should return TInstance with id and region',
      dto: {
        id: 'instance-1',
        flavorId: 'fake-flavor',
        flavorName: 'fake-flavor-name',
        region: 'fake-region',
      },
      expected: {
        id: 'instance-1',
        region: { name: 'fake-region', type: '', availabilityZone: null },
      },
    },
    {
      desc: 'Should return TInstance with id and region',
      dto: {
        id: 'instance-1',
        flavorId: 'fake-flavor',
        flavorName: 'fake-flavor-name',
        region: 'fake-region',
        availabilityZone: 'fake-availabilityZone',
      },
      expected: {
        id: 'instance-1',
        region: {
          name: 'fake-region',
          type: '',
          availabilityZone: 'fake-availabilityZone',
        },
      },
    },
    {
      desc: 'Should return TInstance with id and status',
      dto: {
        id: 'instance-1',
        status: 'BUILDING',
      },
      expected: {
        id: 'instance-1',
        status: 'BUILDING',
      },
    },
    {
      desc: 'Should return TInstance with id and task',
      dto: {
        id: 'instance-1',
        pendingTask: true,
        taskState: 'waiting',
      },
      expected: {
        id: 'instance-1',
        task: {
          isPending: true,
          status: 'waiting',
        },
      },
    },
    {
      desc: 'Should return TInstance with id and task',
      dto: {
        id: 'instance-1',
        pendingTask: false,
        taskState: 'ACTIVE',
      },
      expected: {
        id: 'instance-1',
        task: {
          isPending: false,
          status: 'ACTIVE',
        },
      },
    },
    {
      desc: 'Should return TInstance with actions',
      dto: {
        id: 'instance-1',
        actions: [{ name: 'activate_monthly_billing', group: 'details' }],
      },
      expected: {
        id: 'instance-1',
        actions: [{ name: 'activate_monthly_billing', group: 'details' }],
      },
    },
    {
      desc: 'Should return TInstance with volumes',
      dto: {
        id: 'instance-1',
        volumes: [{ id: 'fake-volume-1', name: 'fake-volume-1' }],
      },
      expected: {
        id: 'instance-1',
        volumes: [{ id: 'fake-volume-1', name: 'fake-volume-1', size: null }],
      },
    },
  ])('$desc', ({ dto, expected }: TInstanceDtoData) => {
    const result = buildPartialInstanceFromInstancesDto(dto);

    expect(result).toEqual(expected);
  });
});

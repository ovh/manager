import { describe, test } from 'vitest';
import { buildPartialInstanceDto } from './instanceDto.builder';
import { TInstanceDto, TPartialInstanceDto } from '@/types/instance/api.type';

type Data = {
  desc: string;
  initial: TPartialInstanceDto;
  steps: [keyof TInstanceDto, TInstanceDto[keyof TInstanceDto]][];
  expected: TPartialInstanceDto;
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

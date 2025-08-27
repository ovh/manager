import { describe, expect, it } from 'vitest';
import { getIsLogForwarderCreating } from './getIsLogForwarderCreating';
import { SecurityOption } from '@/types/compatibilityMatrix';

describe('getIsLogForwarderCreating', () => {
  it.each([
    {
      description: 'empty array',
      options: [],
      expected: false,
    },
    {
      description: 'undefined input',
      options: undefined,
      expected: false,
    },
    {
      description: 'no logForwarder option exists',
      options: [
        {
          compatible: true,
          description: 'Test option',
          enabled: true,
          name: 'base',
          reason: null,
          state: 'delivered',
        } as const,
        {
          compatible: true,
          description: 'Another test option',
          enabled: false,
          name: 'hids',
          reason: null,
          state: 'delivered',
        },
      ],
      expected: false,
    } as const,
  ] as const)(
    'should return $expected for $description',
    ({ options, expected }) => {
      const result = getIsLogForwarderCreating(options);
      expect(result).toBe(expected);
    },
  );

  it.each([
    { state: 'creating', expected: true },
    { state: 'deleted', expected: false },
    { state: 'deleting', expected: false },
    { state: 'disabled', expected: false },
    { state: 'pending', expected: true },
    { state: 'toCreate', expected: true },
    { state: 'updating', expected: true },
    { state: 'delivered', expected: false },
  ] as const)(
    'should return $expected when logForwarder state is $state',
    ({ state, expected }) => {
      const options: SecurityOption[] = [
        {
          compatible: true,
          description: 'Log forwarder option',
          enabled: true,
          name: 'logForwarder',
          reason: null,
          state,
        },
        {
          compatible: true,
          description: 'Another option',
          enabled: true,
          name: 'advancedSecurity',
          reason: null,
          state: 'deleted',
        },
      ];

      const result = getIsLogForwarderCreating(options);
      expect(result).toBe(expected);
    },
  );
});

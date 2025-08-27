import { describe, expect, it } from 'vitest';
import { getIsLogForwarderDelivered } from './getIsLogForwarderDelivered';
import { SecurityOption } from '@/types/compatibilityMatrix';

describe('getIsLogForwarderDelivered', () => {
  it.each([
    {
      description: 'empty array',
      options: [],
      expected: false,
    } as const,
    {
      description: 'undefined input',
      options: undefined,
      expected: false,
    } as const,
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
        } as const,
      ] as const,
      expected: false,
    } as const,
  ] as const)(
    'should return $expected for $description',
    ({ options, expected }) => {
      const result = getIsLogForwarderDelivered(options);
      expect(result).toBe(expected);
    },
  );

  it.each([
    { state: 'creating', expected: false },
    { state: 'deleted', expected: false },
    { state: 'deleting', expected: false },
    { state: 'disabled', expected: false },
    { state: 'pending', expected: false },
    { state: 'toCreate', expected: false },
    { state: 'updating', expected: false },
    { state: 'delivered', expected: true },
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

      const result = getIsLogForwarderDelivered(options);
      expect(result).toBe(expected);
    },
  );
});

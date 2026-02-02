import { describe, expect, it } from 'vitest';

import { tabsWithActiveTabOrDefault } from '../tabsWithActiveTabOrDefault';

describe('tabsWithActiveTabOrDefault', () => {
  it.each([
    {
      description: 'should activate default tab when all tabs are inactive',
      input: [
        { id: '1', name: 'Tab 1', isActive: false, isDefault: false },
        { id: '2', name: 'Tab 2', isActive: false, isDefault: true },
        { id: '3', name: 'Tab 3', isActive: false, isDefault: false },
      ],
      expected: [
        { id: '1', name: 'Tab 1', isActive: false, isDefault: false },
        { id: '2', name: 'Tab 2', isActive: true, isDefault: true },
        { id: '3', name: 'Tab 3', isActive: false, isDefault: false },
      ],
    },
    {
      description: 'should return tabs unchanged when at least one tab is active',
      input: [
        { id: '1', name: 'Tab 1', isActive: true, isDefault: false },
        { id: '2', name: 'Tab 2', isActive: false, isDefault: true },
        { id: '3', name: 'Tab 3', isActive: false, isDefault: false },
      ],
      expected: [
        { id: '1', name: 'Tab 1', isActive: true, isDefault: false },
        { id: '2', name: 'Tab 2', isActive: false, isDefault: true },
        { id: '3', name: 'Tab 3', isActive: false, isDefault: false },
      ],
    },
    {
      description: 'should handle all tabs inactive with no default tabs',
      input: [
        { id: '1', name: 'Tab 1', isActive: false, isDefault: false },
        { id: '2', name: 'Tab 2', isActive: false, isDefault: false },
        { id: '3', name: 'Tab 3', isActive: false, isDefault: false },
      ],
      expected: [
        { id: '1', name: 'Tab 1', isActive: false, isDefault: false },
        { id: '2', name: 'Tab 2', isActive: false, isDefault: false },
        { id: '3', name: 'Tab 3', isActive: false, isDefault: false },
      ],
    },
    {
      description: 'should handle single tab that is inactive and default',
      input: [{ id: '1', name: 'Tab 1', isActive: false, isDefault: true }],
      expected: [{ id: '1', name: 'Tab 1', isActive: true, isDefault: true }],
    },
    {
      description: 'should handle single tab that is active and not default',
      input: [{ id: '1', name: 'Tab 1', isActive: true, isDefault: false }],
      expected: [{ id: '1', name: 'Tab 1', isActive: true, isDefault: false }],
    },
  ])('$description', ({ input, expected }) => {
    const result = tabsWithActiveTabOrDefault(input);
    expect(result).toEqual(expected);
  });

  it('should return empty array when input is empty', () => {
    const result = tabsWithActiveTabOrDefault([]);
    expect(result).toEqual([]);
  });
});

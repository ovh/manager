import { renderHook } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import useDateFormat from './useDateFormat';

const mocks = vi.hoisted(() => ({
  environment: {
    getUserLocale: vi.fn().mockReturnValue('en_US'),
  },
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked-url'),
    },
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
}));

describe('useDateFormat', () => {
  it('should return Intl.DateTimeFormat with the correct locale and options', () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    vi.spyOn(React, 'useContext').mockReturnValue(mocks);

    const { result } = renderHook(() => useDateFormat({ options }));

    const formatter = result.current;
    expect(formatter.resolvedOptions().locale).toBe('en-US');
    expect(formatter.resolvedOptions().year).toBe('numeric');
    expect(formatter.resolvedOptions().month).toBe('long');
    expect(formatter.resolvedOptions().day).toBe('numeric');
    expect(formatter.format(new Date('2024-01-01'))).toBe('January 1, 2024');
  });

  it('should handle locale conversion correctly', () => {
    mocks.environment.getUserLocale.mockReturnValue('fr_FR');

    const { result } = renderHook(() => useDateFormat({ options: {} }));

    const formatter = result.current;
    expect(formatter.resolvedOptions().locale).toBe('fr-FR');
  });
});

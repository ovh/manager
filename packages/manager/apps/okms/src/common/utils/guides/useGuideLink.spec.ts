import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { Subsidiary, User } from '@ovh-ux/manager-config';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { useShellContext } from '@/common/hooks/useShellContext';

import { useGuideLink } from './useGuideLink';

const mockedGuides = { FR: 'fr-link', GB: 'gb-link' };

vi.mock('@/common/hooks/useShellContext', () => ({
  useShellContext: vi.fn(),
}));

type TestCases = {
  subsidiary: Subsidiary;
  expectedLink: string;
};

const testCases: TestCases[] = [
  { subsidiary: 'FR', expectedLink: mockedGuides.FR },
  { subsidiary: 'AU', expectedLink: mockedGuides.GB },
];

describe('useGuideLink test suite', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test.each(testCases)(
    'should return $expectedLink for subsidiary $subsidiary',
    ({ subsidiary, expectedLink }) => {
      // GIVEN
      vi.mocked(useShellContext).mockReturnValue({
        environment: {
          getUser: vi.fn(
            () =>
              ({
                ovhSubsidiary: subsidiary,
              }) as User,
          ),
        },
      } as unknown as ShellContextType);

      // WHEN
      const { result } = renderHook(() => useGuideLink(mockedGuides));

      // THEN
      expect(result.current).toBe(expectedLink);
    },
  );
});

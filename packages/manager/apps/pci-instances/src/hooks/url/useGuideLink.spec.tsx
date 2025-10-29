import { createContext } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuideLink } from './useGuideLink';
import { GUIDE_LINKS, TGuideKey } from './useGuideLink.constant';

const mockGetOvhSubsidiary = vi.hoisted(() => vi.fn());

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: createContext({
    environment: {
      getUser: mockGetOvhSubsidiary,
    },
  }),
}));

describe('useGuideLink', () => {
  const testCasesSingleKey = [
    {
      ovhSubsidiary: 'FR',
      key: 'FLAVOR' as TGuideKey,
      expected: GUIDE_LINKS.FLAVOR.FR,
      description: 'returns guide link for valid subsidiary',
    },
    {
      ovhSubsidiary: 'fakeSubsidiary',
      key: 'FLAVOR' as TGuideKey,
      expected: GUIDE_LINKS.FLAVOR.DEFAULT,
      description: 'returns default guide link for unknown subsidiary',
    },
  ];

  it.each(testCasesSingleKey)(
    'should $description',
    async ({ ovhSubsidiary, key, expected }) => {
      mockGetOvhSubsidiary.mockReturnValue({ ovhSubsidiary });

      const { result } = renderHook(() => useGuideLink(key));

      await waitFor(() => {
        expect(result.current).toStrictEqual(expected);
      });
    },
  );

  const testCasesMultipleKey = [
    {
      ovhSubsidiary: 'FR',
      key: ['FLAVOR', 'DISTRIBUTION_IMAGE'] as TGuideKey[],
      expected: {
        FLAVOR: GUIDE_LINKS.FLAVOR.FR,
        DISTRIBUTION_IMAGE: GUIDE_LINKS.DISTRIBUTION_IMAGE.FR,
      },
      description: 'returns guide links for valid subsidiary',
    },
    {
      ovhSubsidiary: 'fakeSubsidiary',
      key: ['FLAVOR', 'DISTRIBUTION_IMAGE'] as TGuideKey[],
      expected: {
        FLAVOR: GUIDE_LINKS.FLAVOR.DEFAULT,
        DISTRIBUTION_IMAGE: GUIDE_LINKS.DISTRIBUTION_IMAGE.DEFAULT,
      },
      description: 'returns default guide links for unknown subsidiary',
    },
  ];

  it.each(testCasesMultipleKey)(
    'should $description',
    async ({ ovhSubsidiary, key, expected }) => {
      mockGetOvhSubsidiary.mockReturnValue({ ovhSubsidiary });

      const { result } = renderHook(() => useGuideLink(key));

      await waitFor(() => {
        expect(result.current).toStrictEqual(expected);
      });
    },
  );
});

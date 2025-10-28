import { describe, it, vi } from 'vitest';
import { PropsWithChildren } from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { useSupport } from './useSupport';
import { getComponentWrapper } from '@/utils/tests/component-wrapper';

vi.mock('@/container/common/urls-constants', () => ({
  useURL: vi.fn(() => ({
    get: vi.fn((key) => `https://support.ovhcloud.com/${key}`),
  })),
}));

const wrapper = ({ children }: PropsWithChildren) =>
  getComponentWrapper({
    configuration: {},
  })(children as JSX.Element);

describe('useSupport', () => {
  it('returns the initial user from the environment', async () => {
    const { result } = renderHook(() => useSupport(), { wrapper });

    await waitFor(() => {
      expect(result.current).toEqual('https://support.ovhcloud.com/support');
    });
  });
});

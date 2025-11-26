import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/utils/test.provider';

import { useHostingUrl } from './useHostingUrl';

describe('useHostingUrl', () => {
  it('should return the correct hosting URL without path', async () => {
    const { result } = renderHook(() => useHostingUrl('test-service'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe('test-url');
    });
  });
});

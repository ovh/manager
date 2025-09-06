import { renderHook, waitFor } from '@testing-library/react';

import { useHostingUrl } from './useHostingUrl';

describe('useHostingUrl', () => {
  it('should return the correct hosting URL without path', async () => {
    const { result } = renderHook(() => useHostingUrl('test-service'));
    await waitFor(() => {
      expect(result.current).toBe('test-url');
    });
  });
});

import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/utils/test.provider';

import { useEmailsUrl } from './useEmailsUrl';

describe('useEmailsUrl', () => {
  it('should return the correct hosting URL without path', async () => {
    const { result } = renderHook(() => useEmailsUrl('test-service'), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe('test-url');
    });
  });
});

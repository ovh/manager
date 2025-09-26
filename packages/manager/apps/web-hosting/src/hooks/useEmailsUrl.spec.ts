import { renderHook, waitFor } from '@testing-library/react';

import { useEmailsUrl } from './useEmailsUrl';

describe('useEmailsUrl', () => {
  it('should return the correct hosting URL without path', async () => {
    const { result } = renderHook(() => useEmailsUrl('test-service'));
    await waitFor(() => {
      expect(result.current).toBe('test-url');
    });
  });
});

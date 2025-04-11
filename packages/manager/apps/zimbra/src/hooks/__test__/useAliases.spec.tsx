import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { aliasesMock } from '@/api/_mock_';
import { useAliases } from '../useAliases';
import { wrapper } from '@/utils/test.provider';

describe('useAliases', () => {
  it('should return a list of aliases', async () => {
    const { result } = renderHook(() => useAliases(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(aliasesMock);
  });
});

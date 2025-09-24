import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressRerefenceAvailableLanguageMock } from '@/data/__mocks__/managedWordpress/language';
import { wrapper } from '@/utils/test.provider';

import { useManagedWordpressReferenceAvailableLanguages } from './useManagedWordpressReferenceAvailableLanguages';

describe('useManagedWordpressReferenceAvailableLanguages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return available languages list', async () => {
    const { result } = renderHook(() => useManagedWordpressReferenceAvailableLanguages(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressRerefenceAvailableLanguageMock);
  });
});

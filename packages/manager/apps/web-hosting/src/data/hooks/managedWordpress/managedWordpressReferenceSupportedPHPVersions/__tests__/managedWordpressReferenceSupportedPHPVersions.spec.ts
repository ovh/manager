import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressRerefenceSupportedVersionMock } from '@/data/__mocks__/managedWordpress/supportedPhpVersion';
import { wrapper } from '@/utils/test.provider';

import { useManagedCmsLatestPhpVersion } from '../managedWordpressReferenceSupportedPHPVersions';

describe('useManagedWordpressReferenceAvailableLanguages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return available languages list', async () => {
    const { result } = renderHook(() => useManagedCmsLatestPhpVersion(), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(managedWordpressRerefenceSupportedVersionMock);
  });
});

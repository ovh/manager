import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { domainMock, domainsDiagnosticMock } from '@/data/api';
import { useDomainsDiagnostic } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useDomainsDiagnostic', () => {
  it('should return the diagnostics of a list of domains', async () => {
    const { result } = renderHook(() => useDomainsDiagnostic({ domainIds: [domainMock.id] }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainsDiagnosticMock);
  });
});

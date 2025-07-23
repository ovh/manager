import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { domainDiagnosticMock, domainMock } from '@/data/api';
import { useDomainDiagnostic } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useDomainDiagnostic', () => {
  it('should return the diagnostic of a domain', async () => {
    const { result } = renderHook(() => useDomainDiagnostic({ domainId: domainMock.id }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainDiagnosticMock);
  });
});

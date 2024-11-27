import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { domainsDiagnosticMock, domainDetailMock } from '@/api/_mock_';
import { useDomainsDiagnostic } from '../useDomainsDiagnostic';
import { wrapper } from '@/utils/test.provider';

describe('useDomainsDiagnostic', () => {
  it('should return the diagnostics of a list of domains', async () => {
    const { result } = renderHook(
      () => useDomainsDiagnostic({ domainIds: [domainDetailMock.id] }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainsDiagnosticMock);
  });
});

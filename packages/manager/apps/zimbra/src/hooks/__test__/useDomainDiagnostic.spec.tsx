import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { domainDiagnosticMock, domainDetailMock } from '@/api/_mock_';
import { useDomainDiagnostic } from '../useDomainDiagnostic';
import { wrapper } from '@/utils/test.provider';

describe('useDomainDiagnostic', () => {
  it('should return the diagnostic of a domain', async () => {
    const { result } = renderHook(
      () => useDomainDiagnostic({ domainId: domainDetailMock.id }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainDiagnosticMock);
  });
});

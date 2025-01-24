import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import Diagnostics from '../Diagnostics.page';
import { render, waitFor } from '@/utils/test.provider';
import { domainDetailMock } from '@/api/_mock_';
import { odsTabIsSelected, tabContent } from '@/utils/test.utils';
import { DnsRecordType } from '@/utils/dnsconfig.constants';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    domainId: domainDetailMock.id,
  }),
  vi.fn(),
]);

describe('Domain diagnostics page', () => {
  it('should display correctly and have 3 tabs', async () => {
    const { queryByTestId, container } = render(<Diagnostics />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(queryByTestId('refresh')).toBeInTheDocument();

    const tabs = container.querySelectorAll('ods-tab');

    expect(tabs.length).toBe(3);

    expect(container.querySelector(odsTabIsSelected(true))).toHaveAttribute(
      'id',
      DnsRecordType.MX,
    );

    await waitFor(() => {
      expect(queryByTestId(tabContent(DnsRecordType.MX))).toBeInTheDocument();
    });
  });
});

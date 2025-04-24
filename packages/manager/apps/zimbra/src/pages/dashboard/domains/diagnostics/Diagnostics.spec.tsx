import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import Diagnostics from './Diagnostics.page';
import { render, waitFor } from '@/utils/test.provider';
import { domainMock, platformMock } from '@/data/api';
import { odsTabIsSelected, tabContent } from '@/utils/test.utils';
import { DnsRecordType } from '@/utils/dnsconfig.constants';

vi.mocked(useParams).mockReturnValue({
  platformId: platformMock[0].id,
  domainId: domainMock.id,
});

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

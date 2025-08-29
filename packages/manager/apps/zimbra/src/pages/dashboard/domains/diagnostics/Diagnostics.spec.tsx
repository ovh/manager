import React from 'react';
import { describe, expect, vi } from 'vitest';
import { useLocation, useParams } from 'react-router-dom';
import Diagnostics from './Diagnostics.page';
import { render, waitFor } from '@/utils/test.provider';
import { domainMock, platformMock } from '@/data/api';
import { odsTabIsSelected, tabContent } from '@/utils/test.utils';
import { DnsRecordType } from '@/utils/dnsconfig.constants';
import { urls } from '@/routes/routes.constants';

vi.mocked(useParams).mockReturnValue({
  platformId: platformMock[0].id,
  domainId: domainMock.id,
});

describe('Domain diagnostics page', () => {
  it('should display correctly and have 3 tabs', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: urls.domains_diagnostic_mx
        .replace(':platformId', platformMock[0].id)
        .replace(':domainId', domainMock.id),
      search: '',
      hash: '',
      key: '',
      state: '',
    });
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

  it('should render SPF tab correctly when selected', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: urls.domains_diagnostic_spf
        .replace(':platformId', platformMock[0].id)
        .replace(':domainId', domainMock.id),
      search: '',
      hash: '',
      key: '',
      state: '',
    });

    const { queryByTestId } = render(<Diagnostics />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(queryByTestId(tabContent(DnsRecordType.SPF))).toBeInTheDocument();
  });

  it('should render DKIM tab correctly when selected', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: urls.domains_diagnostic_dkim
        .replace(':platformId', platformMock[0].id)
        .replace(':domainId', domainMock.id),
      search: '',
      hash: '',
      key: '',
      state: '',
    });
    const { queryByTestId } = render(<Diagnostics />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(queryByTestId(tabContent(DnsRecordType.DKIM))).toBeInTheDocument();
  });
});

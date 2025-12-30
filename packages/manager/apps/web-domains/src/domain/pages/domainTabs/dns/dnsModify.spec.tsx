import '@/common/setupTests';
import { render, waitFor } from '@/common/utils/test.provider';
import { describe, expect, Mock, vi } from 'vitest';
import {
  useGetDomainZone,
  useGetDomainResource,
} from '@/domain/hooks/data/query';
import { wrapper } from '@/common/utils/test.provider';
import DnsModifyPage from './dnsModify';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainZone: vi.fn(),
  useGetDomainResource: vi.fn(),
}));

vi.mock('@/domain/utils/dnsUtils', () => ({
  computeActiveConfiguration: vi.fn(),
}));

vi.mock('@/domain/components/ModifyNameServer/DnsConfigurationRadio', () => ({
  default: () => <div>Dns Configuration Radio Component</div>,
}));

describe('DnsModifyPage', () => {
  it('Render loading component when data is still fetching', async () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: true,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainResource: true,
    });
    const { getByTestId, container } = render(<DnsModifyPage />, {
      wrapper,
    });
    await waitFor(() => {
      expect(getByTestId('listing-page-spinner')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible();
  });

  it('Render DnsModify page', async () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: false,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainResource: false,
    });
    const { getByTestId, container } = render(<DnsModifyPage />, {
      wrapper,
    });
    await waitFor(() => {
      expect(getByTestId('modify-component')).toBeInTheDocument();
    });
    await expect(container).toBeAccessible();
  });
});

describe('DnsModifyPage W3C Validation', () => {
  it('should have valid html when loading', async () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: true,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainResource: true,
    });
    const { container } = render(<DnsModifyPage />, { wrapper });
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });

  it('should have valid html when loaded', async () => {
    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: {},
      isFetchingDomainZone: false,
    });
    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: {},
      isFetchingDomainResource: false,
    });
    const { container } = render(<DnsModifyPage />, { wrapper });
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});

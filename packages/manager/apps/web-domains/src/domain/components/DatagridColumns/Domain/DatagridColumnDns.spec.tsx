import '@/common/setupTests';

import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it } from 'vitest';
import DatagridColumnDns from './DatagridColumnDns';
import { TNameServerWithType } from '@/domain/types/domainResource';
import { wrapper } from '@/common/utils/test.provider';
import { DnsConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';

const createMockNameServer = (nameServer: string): TNameServerWithType => ({
  ipv4: null,
  ipv6: null,
  nameServer,
  nameServerType: DnsConfigurationTypeEnum.HOSTING,
});

describe('DatagridColumnDns', () => {
  it('should render single DNS server', () => {
    const mockDns: TNameServerWithType[] = [
      createMockNameServer('dns1.example.com'),
    ];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('dns1.example.com');
  });

  it('should render multiple DNS servers separated by semicolon', () => {
    const mockDns: TNameServerWithType[] = [
      createMockNameServer('dns1.example.com'),
      createMockNameServer('dns2.example.com'),
      createMockNameServer('dns3.example.com'),
    ];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent(
      'dns1.example.com; dns2.example.com; dns3.example.com',
    );
  });

  it('should render empty string when no DNS servers', () => {
    const mockDns: TNameServerWithType[] = [];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('');
  });

  it('should handle DNS servers with empty nameServer values', () => {
    const mockDns: TNameServerWithType[] = [
      createMockNameServer(''),
      createMockNameServer('dns1.example.com'),
      createMockNameServer(''),
    ];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('; dns1.example.com;');
  });

  it('should render DataGridTextCell component', () => {
    const mockDns: TNameServerWithType[] = [
      createMockNameServer('test.dns.com'),
    ];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    expect(screen.getByTestId('datagrid-text-cell')).toBeInTheDocument();
  });
});

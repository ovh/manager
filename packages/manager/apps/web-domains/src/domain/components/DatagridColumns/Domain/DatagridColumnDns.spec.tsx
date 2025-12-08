import React from 'react';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi } from 'vitest';
import DatagridColumnDns from './DatagridColumnDns';
import { NameServer, NameServerTypeEnum } from '@/domain/types/domainResource';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="datagrid-text-cell">{children}</div>
  ),
}));

const createMockNameServer = (nameServer: string): NameServer => ({
  id: Math.floor(Math.random() * 1000),
  ipv4: null,
  ipv6: null,
  nameServer,
  nameServerType: NameServerTypeEnum.HOSTED,
});

describe('DatagridColumnDns', () => {
  it('should render single DNS server', () => {
    const mockDns: NameServer[] = [createMockNameServer('dns1.example.com')];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('dns1.example.com');
  });

  it('should render multiple DNS servers separated by semicolon', () => {
    const mockDns: NameServer[] = [
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
    const mockDns: NameServer[] = [];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('');
  });

  it('should handle DNS servers with empty nameServer values', () => {
    const mockDns: NameServer[] = [
      createMockNameServer(''),
      createMockNameServer('dns1.example.com'),
      createMockNameServer(''),
    ];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('; dns1.example.com;');
  });

  it('should render DataGridTextCell component', () => {
    const mockDns: NameServer[] = [createMockNameServer('test.dns.com')];

    render(<DatagridColumnDns dns={mockDns} />, { wrapper });

    expect(screen.getByTestId('datagrid-text-cell')).toBeInTheDocument();
  });
});

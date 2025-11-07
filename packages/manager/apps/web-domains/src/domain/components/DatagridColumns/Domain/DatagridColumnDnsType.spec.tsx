import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DatagridColumnDnsType from './DatagridColumnDnsType';
import { NameServerTypeEnum } from '@/domain/types/domainResource';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="datagrid-text-cell">{children}</div>
  ),
}));

describe('DatagridColumnDnsType', () => {
  it('should render DNS type with first letter capitalized', () => {
    render(<DatagridColumnDnsType type={NameServerTypeEnum.HOSTED} />, {
      wrapper,
    });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('Hosted');
  });

  it('should handle all DNS type enum values', () => {
    const testCases = Object.values(NameServerTypeEnum).map((type) => ({
      type,
      expected: type.charAt(0).toUpperCase() + type.slice(1),
    }));

    testCases.forEach(({ type, expected }) => {
      const { rerender } = render(<DatagridColumnDnsType type={type} />, {
        wrapper,
      });

      const textCell = screen.getAllByTestId('datagrid-text-cell');
      expect(textCell.map((val) => val.textContent)).toContain(expected);

      if (testCases.indexOf({ type, expected }) < testCases.length - 1) {
        rerender(<DatagridColumnDnsType type={type} />);
      }
    });
  });

  it('should render DataGridTextCell component', () => {
    render(<DatagridColumnDnsType type={NameServerTypeEnum.EXTERNAL} />, {
      wrapper,
    });

    expect(screen.getByTestId('datagrid-text-cell')).toBeInTheDocument();
  });

  it('should capitalize single character type', () => {
    // Create a mock type for edge case testing
    const singleCharType = 'x' as NameServerTypeEnum;

    render(<DatagridColumnDnsType type={singleCharType} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('X');
  });

  it('should handle empty string type gracefully', () => {
    const emptyType = '' as NameServerTypeEnum;

    render(<DatagridColumnDnsType type={emptyType} />, { wrapper });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toHaveTextContent('');
  });
});

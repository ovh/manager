import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import DataGridCellLink from '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.component';
import { DataGridCellLinkProps } from '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.props';

const { mockGetTenantDashboardUrl } = vi.hoisted(() => ({
  mockGetTenantDashboardUrl: vi.fn(
    (params: { tenantId: string; resourceName: string }) =>
      `/mocked/${params.resourceName}/${params.tenantId}`,
  ),
}));
vi.mock('@/routes/Routes.utils', () => ({
  getTenantDashboardUrl: mockGetTenantDashboardUrl,
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useHref: (path: string) => path,
}));

// Mock ODS React components
vi.mock('@ovhcloud/ods-react', () => ({
  Link: ({
    href,
    children,
    'data-testid': testId,
  }: {
    href: string;
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <a data-testid={testId} href={href}>
      {children}
    </a>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  TEXT_PRESET: {
    small: 'small',
  },
}));

describe('DataGridCellLink', () => {
  const defaultProps: DataGridCellLinkProps = {
    tenantId: 'test-id',
    resourceName: 'test-resource',
    label: 'Test Label',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render link with correct props', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Test Label');
    });

    it('should render with custom tenantId', () => {
      const customProps = {
        ...defaultProps,
        tenantId: 'custom-id',
      };

      render(<DataGridCellLink {...customProps} />);

      expect(screen.getByTestId('cell-link-custom-id')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      const customProps = {
        ...defaultProps,
        label: 'Custom Label',
      };

      render(<DataGridCellLink {...customProps} />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have correct href for tenant dashboard path', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link).toHaveAttribute('href', '/mocked/test-resource/test-id');
      expect(mockGetTenantDashboardUrl).toHaveBeenCalledWith({
        tenantId: 'test-id',
        resourceName: 'test-resource',
      });
    });

    it('should have unique href based on tenantId', () => {
      const customProps = {
        ...defaultProps,
        tenantId: 'custom-id',
      };

      render(<DataGridCellLink {...customProps} />);

      const link = screen.getByTestId('cell-link-custom-id');
      expect(link).toHaveAttribute('href', '/mocked/test-resource/custom-id');
      expect(mockGetTenantDashboardUrl).toHaveBeenCalledWith({
        tenantId: 'custom-id',
        resourceName: 'test-resource',
      });
    });
  });

  describe('Props Validation', () => {
    it('should handle empty string props', () => {
      const emptyProps = {
        tenantId: '',
        resourceName: '',
        label: '',
      };

      render(<DataGridCellLink {...emptyProps} />);

      expect(screen.getByTestId('cell-link-')).toBeInTheDocument();
      const link = screen.getByRole('link');
      expect(link).toHaveTextContent('');
    });

    it('should handle special characters in props', () => {
      const specialProps = {
        tenantId: 'id-with-special-chars-123',
        resourceName: 'resource-special',
        label: 'Label with "quotes" & <tags>',
      };

      render(<DataGridCellLink {...specialProps} />);

      expect(screen.getByTestId('cell-link-id-with-special-chars-123')).toBeInTheDocument();
      expect(screen.getByText('Label with "quotes" & <tags>')).toBeInTheDocument();
    });

    it('should handle very long strings', () => {
      const longProps = {
        tenantId: 'a'.repeat(100),
        resourceName: 'b'.repeat(100),
        label: 'A'.repeat(200),
      };

      render(<DataGridCellLink {...longProps} />);

      expect(screen.getByTestId(`cell-link-${'a'.repeat(100)}`)).toBeInTheDocument();
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const undefinedProps = {
        tenantId: undefined as unknown as string,
        resourceName: undefined as unknown as string,
        label: undefined as unknown as string,
      };

      render(<DataGridCellLink {...undefinedProps} />);

      expect(screen.getByTestId('cell-link-undefined')).toBeInTheDocument();
    });

    it('should handle null props gracefully', () => {
      const nullProps = {
        tenantId: null as unknown as string,
        resourceName: null as unknown as string,
        label: null as unknown as string,
      };

      render(<DataGridCellLink {...nullProps} />);

      expect(screen.getByTestId('cell-link-null')).toBeInTheDocument();
    });

    it('should handle numeric props', () => {
      const numericProps = {
        tenantId: 123 as unknown as string,
        resourceName: 456 as unknown as string,
        label: 789 as unknown as string,
      };

      render(<DataGridCellLink {...numericProps} />);

      expect(screen.getByTestId('cell-link-123')).toBeInTheDocument();
      expect(screen.getByText('789')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should work with different tenantId formats', () => {
      const testCases = [
        'simple-id',
        'id-with-dashes',
        'id_with_underscores',
        'id.with.dots',
        'id123with456numbers',
        'ID-WITH-UPPERCASE',
      ];

      testCases.forEach((tenantId) => {
        const { unmount } = render(<DataGridCellLink {...defaultProps} tenantId={tenantId} />);

        expect(screen.getByTestId(`cell-link-${tenantId}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should render as a link element', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link.tagName).toBe('A');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link).toBeInTheDocument();

      // Test that it can receive focus
      link.focus();
      expect(document.activeElement).toBe(link);
    });

    it('should have accessible href', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link).toHaveAttribute('href');
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<DataGridCellLink {...defaultProps} />);

      const initialLink = screen.getByTestId('cell-link-test-id');

      // Re-render with same props
      rerender(<DataGridCellLink {...defaultProps} />);

      const rerenderedLink = screen.getByTestId('cell-link-test-id');
      expect(rerenderedLink).toBe(initialLink);
    });
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import DataGridCellLink from '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.component';
import { DataGridCellLinkProps } from '@/components/listing/common/datagrid-cells/datagrid-cell-link/DataGridCellLink.props';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock ODS components
vi.mock('@ovh-ux/manager-react-components', () => ({
  Links: ({
    onClickReturn,
    label,
    'data-testid': testId,
  }: {
    onClickReturn: () => void;
    label: string;
    'data-testid'?: string;
  }) => (
    <button data-testid={testId} onClick={onClickReturn} type="button">
      {label}
    </button>
  ),
}));

describe('DataGridCellLink', () => {
  const defaultProps: DataGridCellLinkProps = {
    id: 'test-id',
    label: 'Test Label',
    path: '/test/path',
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

    it('should render with custom id', () => {
      const customProps = {
        ...defaultProps,
        id: 'custom-id',
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

    it('should render with custom path', () => {
      const customProps = {
        ...defaultProps,
        path: '/custom/path',
      };

      render(<DataGridCellLink {...customProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call navigate with correct path when clicked', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      fireEvent.click(link);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/test/path');
    });

    it('should navigate to different paths', () => {
      const customProps = {
        ...defaultProps,
        path: '/different/path',
      };

      render(<DataGridCellLink {...customProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      fireEvent.click(link);

      expect(mockNavigate).toHaveBeenCalledWith('/different/path');
    });

    it('should handle multiple clicks', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      fireEvent.click(link);
      fireEvent.click(link);
      fireEvent.click(link);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('/test/path');
    });
  });

  describe('Props Validation', () => {
    it('should handle empty string props', () => {
      const emptyProps = {
        id: '',
        label: '',
        path: '',
      };

      render(<DataGridCellLink {...emptyProps} />);

      expect(screen.getByTestId('cell-link-')).toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('');
    });

    it('should handle special characters in props', () => {
      const specialProps = {
        id: 'id-with-special-chars-123',
        label: 'Label with "quotes" & <tags>',
        path: '/path/with/special-chars',
      };

      render(<DataGridCellLink {...specialProps} />);

      expect(screen.getByTestId('cell-link-id-with-special-chars-123')).toBeInTheDocument();
      expect(screen.getByText('Label with "quotes" & <tags>')).toBeInTheDocument();
    });

    it('should handle very long strings', () => {
      const longProps = {
        id: 'a'.repeat(100),
        label: 'A'.repeat(200),
        path: '/path/' + 'segment/'.repeat(50),
      };

      render(<DataGridCellLink {...longProps} />);

      expect(screen.getByTestId(`cell-link-${'a'.repeat(100)}`)).toBeInTheDocument();
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const undefinedProps = {
        id: undefined as unknown as string,
        label: undefined as unknown as string,
        path: undefined as unknown as string,
      };

      render(<DataGridCellLink {...undefinedProps} />);

      expect(screen.getByTestId('cell-link-undefined')).toBeInTheDocument();
    });

    it('should handle null props gracefully', () => {
      const nullProps = {
        id: null as unknown as string,
        label: null as unknown as string,
        path: null as unknown as string,
      };

      render(<DataGridCellLink {...nullProps} />);

      expect(screen.getByTestId('cell-link-null')).toBeInTheDocument();
    });

    it('should handle numeric props', () => {
      const numericProps = {
        id: 123 as unknown as string,
        label: 456 as unknown as string,
        path: 789 as unknown as string,
      };

      render(<DataGridCellLink {...numericProps} />);

      expect(screen.getByTestId('cell-link-123')).toBeInTheDocument();
      expect(screen.getByText('456')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should work with different id formats', () => {
      const testCases = [
        'simple-id',
        'id-with-dashes',
        'id_with_underscores',
        'id.with.dots',
        'id123with456numbers',
        'ID-WITH-UPPERCASE',
      ];

      testCases.forEach((id) => {
        const { unmount } = render(<DataGridCellLink {...defaultProps} id={id} />);

        expect(screen.getByTestId(`cell-link-${id}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('should maintain button semantics', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link.tagName).toBe('BUTTON');
      expect(link).toHaveAttribute('type', 'button');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable and clickable', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');
      expect(link).toBeInTheDocument();

      // Test that it can receive focus
      link.focus();
      expect(document.activeElement).toBe(link);
    });

    it('should handle keyboard navigation', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');

      // Test Enter key
      fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });
      // Note: The actual navigation is handled by the onClickReturn callback
      // which is triggered by the click event, not keydown
      expect(mockNavigate).not.toHaveBeenCalled();
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

    it('should handle rapid clicks', () => {
      render(<DataGridCellLink {...defaultProps} />);

      const link = screen.getByTestId('cell-link-test-id');

      // Simulate rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(link);
      }

      expect(mockNavigate).toHaveBeenCalledTimes(10);
    });
  });
});

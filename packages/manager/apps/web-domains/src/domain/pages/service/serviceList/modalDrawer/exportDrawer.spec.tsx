import '@/common/setupTests';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import ExportDrawer from './exportDrawer';

const mockOnClose = vi.fn();
const mockOnExport = vi.fn();
const mockDomainTreeViewOnChange = vi.fn();
const mockContactTreeViewOnChange = vi.fn();


vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: { count?: number }) => {
        if (options?.count !== undefined) {
          return `${key}_${options.count}`;
        }
        return key;
      },
    }),
  };
});

vi.mock('../treeViews/domainTreeView', () => ({
  default: ({
    selectedIds,
    onSelectionChange,
  }: {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
  }) => {
    mockDomainTreeViewOnChange.mockImplementation(onSelectionChange);
    return (
      <div data-testid="domain-tree-view">
        <span data-testid="domain-selected-count">{selectedIds.length}</span>
        {selectedIds.map((id) => (
          <span key={id} data-testid={`domain-selected-${id}`}>
            {id}
          </span>
        ))}
        <button
          data-testid="domain-tree-change"
          onClick={() => {
            const newValue = ['domain', 'expiration'];
            onSelectionChange(newValue);
          }}
        >
          Change Domain Selection
        </button>
      </div>
    );
  },
}));

vi.mock('../treeViews/contactTreeView', () => ({
  default: ({
    selectedIds,
    onSelectionChange,
  }: {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
  }) => {
    mockContactTreeViewOnChange.mockImplementation(onSelectionChange);
    return (
      <div data-testid="contact-tree-view">
        <span data-testid="contact-selected-count">{selectedIds.length}</span>
        {selectedIds.map((id) => (
          <span key={id} data-testid={`contact-selected-${id}`}>
            {id}
          </span>
        ))}
        <button
          data-testid="contact-tree-change"
          onClick={() => onSelectionChange(['owner', 'admin'])}
        >
          Change Contact Selection
        </button>
      </div>
    );
  },
}));

describe('ExportDrawer', () => {
  const defaultProps = {
    isDrawerOpen: true,
    onClose: mockOnClose,
    serviceNames: ['domain1.com', 'domain2.com'],
    onExport: mockOnExport,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render drawer when opened', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(screen.getByTestId('drawer')).toHaveAttribute('data-open', 'true');
      expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
      expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
    });

    it('should not render drawer when closed', () => {
      render(<ExportDrawer {...defaultProps} isDrawerOpen={false} />, {
        wrapper,
      });

      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });

    it('should render with correct drawer position', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(screen.getByTestId('drawer-content')).toHaveAttribute(
        'data-position',
        'right',
      );
    });

    it('should render drawer title', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      const titles = screen.getAllByTestId('text');
      const mainTitle = titles.find(
        (t) => t.getAttribute('data-preset') === 'heading2',
      );

      expect(mainTitle).toHaveTextContent('domain_table_drawer_title');
    });
  });

  describe('Service Names Display', () => {
    it('should display selected count when services are selected', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(
        screen.getByText('domain_table_drawer_selected_count_2'),
      ).toBeInTheDocument();
    });

    it('should display "all" message when no services selected', () => {
      render(<ExportDrawer {...defaultProps} serviceNames={[]} />, {
        wrapper,
      });

      expect(
        screen.getByText('domain_table_drawer_selected_all'),
      ).toBeInTheDocument();
    });

    it('should display info message', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(screen.getByText('domain_table_drawer_info')).toBeInTheDocument();
    });
  });

  describe('TreeView Components', () => {
    it('should render domain tree view with default selection', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(screen.getByTestId('domain-tree-view')).toBeInTheDocument();
      expect(screen.getByTestId('domain-selected-count')).toHaveTextContent(
        '4',
      );
      expect(screen.getByTestId('domain-selected-domain')).toBeInTheDocument();
      expect(
        screen.getByTestId('domain-selected-domain-utf8'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('domain-selected-expiration'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('domain-selected-dns-server'),
      ).toBeInTheDocument();
    });

    it('should render contact tree view with default selection', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(screen.getByTestId('contact-tree-view')).toBeInTheDocument();
      expect(screen.getByTestId('contact-selected-count')).toHaveTextContent(
        '1',
      );
      expect(screen.getByTestId('contact-selected-owner')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render cancel and validate buttons', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      const buttons = screen.getAllByTestId('button');
      expect(buttons).toHaveLength(2); // 2 TreeView buttons + 2 action buttons

      const cancelButton = buttons.find(
        (btn) => btn.getAttribute('data-variant') === 'ghost',
      );
      const validateButton = buttons.find(
        (btn) => btn.getAttribute('data-variant') === 'default',
      );

      expect(cancelButton).toHaveTextContent(
        '@ovh-ux/manager-common-translations/actions:cancel',
      );
      expect(validateButton).toHaveTextContent(
        '@ovh-ux/manager-common-translations/actions:validate',
      );
    });

    it('should call onClose when cancel button is clicked', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      const buttons = screen.getAllByTestId('button');
      const cancelButton = buttons.find(
        (btn) => btn.getAttribute('data-variant') === 'ghost',
      );

      if (cancelButton) {
        fireEvent.click(cancelButton);
      }

      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    it('should call onExport with correct selection when validate is clicked', async () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      const buttons = screen.getAllByTestId('button');
      const validateButton = buttons.find(
        (btn) => btn.getAttribute('data-variant') === 'default',
      );

      if (validateButton) {
        fireEvent.click(validateButton);
      }

      await waitFor(() => {
        expect(mockOnExport).toHaveBeenCalledWith({
          domainColumns: ['domain', 'domain-utf8', 'expiration', 'dns-server'],
          contactColumns: ['owner'],
        });
      });
    });
  });

  describe('Drawer Interactions', () => {
    it('should call onClose when drawer requests to close', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      fireEvent.click(screen.getByTestId('drawer'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Info Message', () => {
    it('should render non-dismissible info message', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      const message = screen.getByTestId('message');
      expect(message).toHaveAttribute('data-dismissible', 'false');
      expect(message).toHaveTextContent(
        'domain_table_drawer_column_info_message',
      );
    });
  });

  describe('Column Headers', () => {
    it('should render domain column header with count', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(
        screen.getByText('domain_table_drawer_column_domain_2'),
      ).toBeInTheDocument();
    });

    it('should render contact column header', () => {
      render(<ExportDrawer {...defaultProps} />, { wrapper });

      expect(
        screen.getByText('domain_table_drawer_column_contact'),
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single service name', () => {
      render(
        <ExportDrawer {...defaultProps} serviceNames={['single-domain.com']} />,
        { wrapper },
      );

      expect(
        screen.getByText('domain_table_drawer_selected_count_1'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('domain_table_drawer_column_domain_1'),
      ).toBeInTheDocument();
    });

    it('should handle many service names', () => {
      const manyServices = Array.from(
        { length: 50 },
        (_, i) => `domain${i}.com`,
      );

      render(<ExportDrawer {...defaultProps} serviceNames={manyServices} />, {
        wrapper,
      });

      expect(
        screen.getByText('domain_table_drawer_selected_count_50'),
      ).toBeInTheDocument();
    });

    it('should handle onExport returning a promise', async () => {
      const asyncOnExport = vi.fn().mockResolvedValue({ success: true });

      render(<ExportDrawer {...defaultProps} onExport={asyncOnExport} />, {
        wrapper,
      });

      const buttons = screen.getAllByTestId('button');
      const validateButton = buttons.find(
        (btn) => btn.getAttribute('data-variant') === 'default',
      );

      if (validateButton) {
        fireEvent.click(validateButton);
      }

      await waitFor(() => {
        expect(asyncOnExport).toHaveBeenCalled();
      });
    });
  });
});

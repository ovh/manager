import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import TenantsListActions from '@/components/listing/tenants/actions/TenantsListActions.component';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock translation namespaces
vi.mock('@ovh-ux/manager-common-translations', () => ({
  NAMESPACES: {
    ACTIONS: '@ovh-ux/manager-common-translations/ACTIONS',
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'tenants:listing.details_action': 'View Details',
        '@ovh-ux/manager-common-translations/ACTIONS:modify': 'Edit',
        'tenants:listing.access_grafana_action': 'Access Grafana',
        'tenants:listing.copy_uid_action': 'Copy UID',
        'tenants:listing.generate_access_token_action': 'Generate Access Token',
        '@ovh-ux/manager-common-translations/ACTIONS:delete': 'Delete',
      };
      return translations[key] || key;
    },
  })),
}));

// Mock ODS components
vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BUTTON_COLOR: {
    critical: 'critical',
  },
  ODS_BUTTON_VARIANT: {
    ghost: 'ghost',
  },
  ODS_ICON_NAME: {
    ellipsisVertical: 'ellipsis-vertical',
  },
  ODS_POPOVER_POSITION: {
    bottomEnd: 'bottom-end',
  },
}));

// Mock manager-react-components
vi.mock('@ovh-ux/muk', () => ({
  ActionMenu: ({
    items,
    isCompact,
    variant,
    icon,
    popoverPosition,
    id,
  }: {
    items: Array<{ id: string | number; label: string; onClick?: () => void; color?: string }>;
    isCompact: boolean;
    variant: string;
    icon: string;
    popoverPosition: string;
    id: string;
  }) => (
    <div
      data-testid="action-menu"
      data-compact={isCompact}
      data-variant={variant}
      data-icon={icon}
      data-position={popoverPosition}
      data-id={id}
    >
      {items.map((item) => (
        <button
          key={item.id}
          data-testid={`action-item-${item.id}`}
          onClick={item.onClick}
          data-color={item.color}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
  ActionMenuItem: {},
}));

vi.mock('@/routes/Routes.utils', () => ({
  getDeleteTenantUrl: (tenantId: string) => `/metrics/tenants/delete/${tenantId}`,
}));

describe('TenantsListActions', () => {
  const testTenantId: string = 'test-tenant-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render action menu with correct props', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toBeInTheDocument();
      expect(actionMenu).toHaveAttribute('data-compact', 'true');
      expect(actionMenu).toHaveAttribute('data-variant', 'ghost');
      expect(actionMenu).toHaveAttribute('data-icon', 'ellipsis-vertical');
      expect(actionMenu).toHaveAttribute('data-position', 'bottom-end');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${testTenantId}`);
    });

    it('should render all action items', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-5')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-6')).toBeInTheDocument();
    });

    it('should render action labels correctly', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Access Grafana')).toBeInTheDocument();
      expect(screen.getByText('Copy UID')).toBeInTheDocument();
      expect(screen.getByText('Generate Access Token')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should have correct container styling', () => {
      const { container } = render(<TenantsListActions tenantId={testTenantId} />);

      const containerDiv = container.querySelector('.flex.justify-end');
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to tenant details when details action is clicked', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const detailsButton = screen.getByTestId('action-item-1');
      fireEvent.click(detailsButton);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(testTenantId);
    });

    it('should navigate with different tenant IDs', () => {
      const differentTenantId = 'different-tenant-456';
      render(<TenantsListActions tenantId={differentTenantId} />);

      const detailsButton = screen.getByTestId('action-item-1');
      fireEvent.click(detailsButton);

      expect(mockNavigate).toHaveBeenCalledWith(differentTenantId);
    });
  });

  describe('Action Items Configuration', () => {
    it('should have correct action item IDs', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-5')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-6')).toBeInTheDocument();
    });

    it('should have delete action with critical color', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const deleteButton = screen.getByTestId('action-item-6');
      expect(deleteButton).toHaveAttribute('data-color', 'critical');
    });

    it('should not have color attribute for non-critical actions', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const detailsButton = screen.getByTestId('action-item-1');
      const editButton = screen.getByTestId('action-item-2');
      const grafanaButton = screen.getByTestId('action-item-3');

      expect(detailsButton).not.toHaveAttribute('data-color');
      expect(editButton).not.toHaveAttribute('data-color');
      expect(grafanaButton).not.toHaveAttribute('data-color');
    });
  });

  describe('Non-Navigation Actions', () => {
    it('should render edit action without onClick handler', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const editButton = screen.getByTestId('action-item-2');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveTextContent('Edit');
    });

    it('should render grafana action without onClick handler', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const grafanaButton = screen.getByTestId('action-item-3');
      expect(grafanaButton).toBeInTheDocument();
      expect(grafanaButton).toHaveTextContent('Access Grafana');
    });

    it('should render copy UID action without onClick handler', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const copyButton = screen.getByTestId('action-item-4');
      expect(copyButton).toBeInTheDocument();
      expect(copyButton).toHaveTextContent('Copy UID');
    });

    it('should render generate token action without onClick handler', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const tokenButton = screen.getByTestId('action-item-5');
      expect(tokenButton).toBeInTheDocument();
      expect(tokenButton).toHaveTextContent('Generate Access Token');
    });

    it('should render delete action without onClick handler', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const deleteButton = screen.getByTestId('action-item-6');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent('Delete');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tenant ID', () => {
      render(<TenantsListActions tenantId="" />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', 'actions-');
    });

    it('should handle special characters in tenant ID', () => {
      const specialTenantId = 'tenant-with-special-chars-123!@#';
      render(<TenantsListActions tenantId={specialTenantId} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${specialTenantId}`);
    });

    it('should handle very long tenant ID', () => {
      const longTenantId = 'a'.repeat(100);
      render(<TenantsListActions tenantId={longTenantId} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${longTenantId}`);
    });
  });

  describe('Component Structure', () => {
    it('should have correct DOM structure', () => {
      const { container } = render(<TenantsListActions tenantId={testTenantId} />);

      const flexContainer = container.querySelector('.flex.justify-end');
      const actionMenu = flexContainer?.querySelector('[data-testid="action-menu"]');

      expect(flexContainer).toBeInTheDocument();
      expect(actionMenu).toBeInTheDocument();
    });

    it('should render all action items in correct order', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      expect(actionItems).toHaveLength(6);

      expect(actionItems[0]).toHaveTextContent('View Details');
      expect(actionItems[1]).toHaveTextContent('Edit');
      expect(actionItems[2]).toHaveTextContent('Access Grafana');
      expect(actionItems[3]).toHaveTextContent('Copy UID');
      expect(actionItems[4]).toHaveTextContent('Generate Access Token');
      expect(actionItems[5]).toHaveTextContent('Delete');
    });
  });

  describe('Accessibility', () => {
    it('should render action items as buttons', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item.tagName).toBe('BUTTON');
      });
    });

    it('should have proper button semantics', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily with same tenant ID', () => {
      const { rerender } = render(<TenantsListActions tenantId={testTenantId} />);

      const initialActionMenu = screen.getByTestId('action-menu');

      // Re-render with same props
      rerender(<TenantsListActions tenantId={testTenantId} />);

      const rerenderedActionMenu = screen.getByTestId('action-menu');
      expect(rerenderedActionMenu).toBe(initialActionMenu);
    });

    it('should handle multiple clicks on navigation action', () => {
      render(<TenantsListActions tenantId={testTenantId} />);

      const detailsButton = screen.getByTestId('action-item-1');

      // Click multiple times
      fireEvent.click(detailsButton);
      fireEvent.click(detailsButton);
      fireEvent.click(detailsButton);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith(testTenantId);
    });
  });
});

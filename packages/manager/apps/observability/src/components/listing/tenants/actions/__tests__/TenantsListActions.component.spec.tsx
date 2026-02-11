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
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock ODS React components
vi.mock('@ovhcloud/ods-react', () => ({
  ICON_NAME: {
    ellipsisVertical: 'ellipsis-vertical',
  },
  POPOVER_POSITION: {
    bottomEnd: 'bottom-end',
  },
  BUTTON_COLOR: {
    critical: 'critical',
  },
  BUTTON_VARIANT: {
    ghost: 'ghost',
  },
}));

// Mock MUK components
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
  getDeleteTenantUrl: (params: { tenantId: string; resourceName: string }) =>
    `/metrics/tenants/delete/${params.tenantId}`,
  getEditTenantUrl: (params: { tenantId: string; resourceName: string }) =>
    `/metrics/tenants/${params.resourceName}/${params.tenantId}/edit`,
  getTenantDashboardUrl: (params: { tenantId: string; resourceName: string }) =>
    `/metrics/tenants/${params.resourceName}/${params.tenantId}`,
}));

describe('TenantsListActions', () => {
  const testParams = {
    tenantId: 'test-tenant-123',
    resourceName: 'test-resource',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render action menu with correct props', () => {
      render(<TenantsListActions {...testParams} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toBeInTheDocument();
      expect(actionMenu).toHaveAttribute('data-compact', 'true');
      expect(actionMenu).toHaveAttribute('data-variant', 'ghost');
      expect(actionMenu).toHaveAttribute('data-icon', 'ellipsis-vertical');
      expect(actionMenu).toHaveAttribute('data-position', 'bottom-end');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${testParams.tenantId}`);
    });

    it('should render all action items', () => {
      render(<TenantsListActions {...testParams} />);

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-5')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-6')).toBeInTheDocument();
    });

    it('should render action labels correctly', () => {
      render(<TenantsListActions {...testParams} />);

      expect(screen.getByText(`tenants:listing.details_action`)).toBeInTheDocument();
      expect(
        screen.getByText(`@ovh-ux/manager-common-translations/ACTIONS:modify`),
      ).toBeInTheDocument();
      expect(screen.getByText(`tenants:listing.access_grafana_action`)).toBeInTheDocument();
      expect(screen.getByText(`tenants:listing.copy_uid_action`)).toBeInTheDocument();
      expect(screen.getByText(`tenants:listing.generate_access_token_action`)).toBeInTheDocument();
      expect(
        screen.getByText(`@ovh-ux/manager-common-translations/ACTIONS:delete`),
      ).toBeInTheDocument();
    });

    it('should have correct container styling', () => {
      const { container } = render(<TenantsListActions {...testParams} />);

      const containerDiv = container.querySelector('.flex.justify-end');
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to tenant details when details action is clicked', () => {
      render(<TenantsListActions {...testParams} />);

      const detailsButton = screen.getByTestId('action-item-1');
      fireEvent.click(detailsButton);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/metrics/tenants/${testParams.resourceName}/${testParams.tenantId}`,
      );
    });

    it('should navigate with different tenant IDs', () => {
      const differentParams = {
        tenantId: 'different-tenant-456',
        resourceName: 'different-resource',
      };
      render(<TenantsListActions {...differentParams} />);

      const detailsButton = screen.getByTestId('action-item-1');
      fireEvent.click(detailsButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/metrics/tenants/${differentParams.resourceName}/${differentParams.tenantId}`,
      );
    });
  });

  describe('Action Items Configuration', () => {
    it('should have correct action item IDs', () => {
      render(<TenantsListActions {...testParams} />);

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-5')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-6')).toBeInTheDocument();
    });

    it('should have delete action with critical color', () => {
      render(<TenantsListActions {...testParams} />);

      const deleteButton = screen.getByTestId('action-item-6');
      expect(deleteButton).toHaveAttribute('data-color', 'critical');
    });

    it('should not have color attribute for non-critical actions', () => {
      render(<TenantsListActions {...testParams} />);

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
      render(<TenantsListActions {...testParams} />);

      const editButton = screen.getByTestId('action-item-2');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveTextContent(`@ovh-ux/manager-common-translations/ACTIONS:modify`);
    });

    it('should render grafana action without onClick handler', () => {
      render(<TenantsListActions {...testParams} />);

      const grafanaButton = screen.getByTestId('action-item-3');
      expect(grafanaButton).toBeInTheDocument();
      expect(grafanaButton).toHaveTextContent(`tenants:listing.access_grafana_action`);
    });

    it('should render copy UID action without onClick handler', () => {
      render(<TenantsListActions {...testParams} />);

      const copyButton = screen.getByTestId('action-item-4');
      expect(copyButton).toBeInTheDocument();
      expect(copyButton).toHaveTextContent(`tenants:listing.copy_uid_action`);
    });

    it('should render generate token action without onClick handler', () => {
      render(<TenantsListActions {...testParams} />);

      const tokenButton = screen.getByTestId('action-item-5');
      expect(tokenButton).toBeInTheDocument();
      expect(tokenButton).toHaveTextContent(`tenants:listing.generate_access_token_action`);
    });

    it('should render delete action without onClick handler', () => {
      render(<TenantsListActions {...testParams} />);

      const deleteButton = screen.getByTestId('action-item-6');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent('@ovh-ux/manager-common-translations/ACTIONS:delete');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tenant ID', () => {
      render(<TenantsListActions tenantId="" resourceName="" />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', 'actions-');
    });

    it('should handle special characters in tenant ID', () => {
      const specialTenantId = 'tenant-with-special-chars-123!@#';
      render(<TenantsListActions tenantId={specialTenantId} resourceName="resource" />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${specialTenantId}`);
    });

    it('should handle very long tenant ID', () => {
      const longTenantId = 'a'.repeat(100);
      render(<TenantsListActions tenantId={longTenantId} resourceName="resource" />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${longTenantId}`);
    });
  });

  describe('Component Structure', () => {
    it('should have correct DOM structure', () => {
      const { container } = render(<TenantsListActions {...testParams} />);

      const flexContainer = container.querySelector('.flex.justify-end');
      const actionMenu = flexContainer?.querySelector('[data-testid="action-menu"]');

      expect(flexContainer).toBeInTheDocument();
      expect(actionMenu).toBeInTheDocument();
    });

    it('should render all action items in correct order', () => {
      render(<TenantsListActions {...testParams} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      expect(actionItems).toHaveLength(6);

      expect(actionItems[0]).toHaveTextContent(`tenants:listing.details_action`);
      expect(actionItems[1]).toHaveTextContent(
        `@ovh-ux/manager-common-translations/ACTIONS:modify`,
      );
      expect(actionItems[2]).toHaveTextContent(`tenants:listing.access_grafana_action`);
      expect(actionItems[3]).toHaveTextContent(`tenants:listing.copy_uid_action`);
      expect(actionItems[4]).toHaveTextContent(`tenants:listing.generate_access_token_action`);
      expect(actionItems[5]).toHaveTextContent(
        `@ovh-ux/manager-common-translations/ACTIONS:delete`,
      );
    });
  });

  describe('Accessibility', () => {
    it('should render action items as buttons', () => {
      render(<TenantsListActions {...testParams} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item.tagName).toBe('BUTTON');
      });
    });

    it('should have proper button semantics', () => {
      render(<TenantsListActions {...testParams} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily with same tenant ID', () => {
      const { rerender } = render(<TenantsListActions {...testParams} />);

      const initialActionMenu = screen.getByTestId('action-menu');

      // Re-render with same props
      rerender(<TenantsListActions {...testParams} />);

      const rerenderedActionMenu = screen.getByTestId('action-menu');
      expect(rerenderedActionMenu).toBe(initialActionMenu);
    });

    it('should handle multiple clicks on navigation action', () => {
      render(<TenantsListActions {...testParams} />);

      const detailsButton = screen.getByTestId('action-item-1');

      // Click multiple times
      fireEvent.click(detailsButton);
      fireEvent.click(detailsButton);
      fireEvent.click(detailsButton);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/metrics/tenants/${testParams.resourceName}/${testParams.tenantId}`,
      );
    });
  });
});

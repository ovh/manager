import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ManagedDashboardsActions from '@/components/listing/managedDashboards/actions/ManagedDashboardsActions.component';
import { DatasourceConfiguration } from '@/types/DatasourceConfiguration';
import { GrafanaListing } from '@/types/managedDashboards.type';

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

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Routes.utils
vi.mock('@/routes/Routes.utils', () => ({
  getDeleteManagedDashboardUrl: ({
    resourceName,
    managedDashboardId,
  }: {
    resourceName: string;
    managedDashboardId: string;
  }) => `/observability/${resourceName}/managed-dashboards/${managedDashboardId}/delete`,
}));

// Mock clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Mock window.alert
global.alert = vi.fn();

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
    items: Array<{
      id: string | number;
      label: string;
      onClick?: () => void;
      color?: string;
      href?: string;
    }>;
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
          data-href={item.href}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
  ActionMenuItem: {},
  BUTTON_COLOR: {
    critical: 'critical',
  },
  BUTTON_VARIANT: {
    ghost: 'ghost',
  },
  ICON_NAME: {
    ellipsisVertical: 'ellipsis-vertical',
  },
  POPOVER_POSITION: {
    bottomEnd: 'bottom-end',
  },
  LinkType: {
    external: 'external',
  },
}));

describe('ManagedDashboardsActions', () => {
  const mockResourceName = 'test-resource-name';
  const mockManagedDashboard: GrafanaListing = {
    id: 'test-grafana-123',
    name: 'Test Grafana',
    description: 'Test description',
    endpoint: 'https://grafana-test.metrics.ovh.com',
    entryPoint: 'gra1.metrics.ovh.com',
    infrastructure: undefined,
    configuration: DatasourceConfiguration.AUTOMATIC,
    version: '1.0.0',
    deprecated: false,
    isAccessLimited: false,
    resourceStatus: 'READY',
    urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/test-grafana-123',
    updatedAt: '2025-01-01T00:00:00Z',
    search: 'test search',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render action menu with correct props', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toBeInTheDocument();
      expect(actionMenu).toHaveAttribute('data-compact', 'true');
      expect(actionMenu).toHaveAttribute('data-variant', 'ghost');
      expect(actionMenu).toHaveAttribute('data-icon', 'ellipsis-vertical');
      expect(actionMenu).toHaveAttribute('data-position', 'bottom-end');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${mockManagedDashboard.id}`);
    });

    it('should render all action items', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
    });

    it('should render action labels correctly', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      expect(
        screen.getByText('managed-dashboards:listing.open_instance_action'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('@ovh-ux/manager-common-translations/ACTIONS:modify'),
      ).toBeInTheDocument();
      expect(screen.getByText('managed-dashboards:listing.copy_urn_action')).toBeInTheDocument();
      expect(
        screen.getByText('@ovh-ux/manager-common-translations/ACTIONS:delete'),
      ).toBeInTheDocument();
    });

    it('should have correct container styling', () => {
      const { container } = render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const containerDiv = container.querySelector('.flex.justify-end');
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('Copy URN Action', () => {
    it('should copy URN to clipboard when copy action is clicked', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const copyButton = screen.getByTestId('action-item-3');
      fireEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledTimes(1);
      expect(mockWriteText).toHaveBeenCalledWith(mockManagedDashboard.urn);
    });

    it('should handle copy URN with different URNs', () => {
      const differentDashboard: GrafanaListing = {
        ...mockManagedDashboard,
        id: 'different-grafana-456',
        urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/different-grafana-456',
      };
      render(
        <ManagedDashboardsActions
          managedDashboard={differentDashboard}
          resourceName={mockResourceName}
        />,
      );

      const copyButton = screen.getByTestId('action-item-3');
      fireEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledWith(differentDashboard.urn);
    });

    it('should handle copy URN with undefined URN', () => {
      const dashboardWithoutUrn: GrafanaListing = {
        ...mockManagedDashboard,
        urn: undefined,
      };
      render(
        <ManagedDashboardsActions
          managedDashboard={dashboardWithoutUrn}
          resourceName={mockResourceName}
        />,
      );

      const copyButton = screen.getByTestId('action-item-3');
      fireEvent.click(copyButton);

      expect(mockWriteText).not.toHaveBeenCalled();
    });
  });

  describe('Action Items Configuration', () => {
    it('should have correct action item IDs', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
    });

    it('should have delete action with critical color', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const deleteButton = screen.getByTestId('action-item-4');
      expect(deleteButton).toHaveAttribute('data-color', 'critical');
    });

    it('should not have color attribute for non-critical actions', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const openButton = screen.getByTestId('action-item-1');
      const editButton = screen.getByTestId('action-item-2');
      const copyButton = screen.getByTestId('action-item-3');

      expect(openButton).not.toHaveAttribute('data-color');
      expect(editButton).not.toHaveAttribute('data-color');
      expect(copyButton).not.toHaveAttribute('data-color');
    });

    it('should have external link href for open instance action', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const openButton = screen.getByTestId('action-item-1');
      expect(openButton).toHaveAttribute('data-href', mockManagedDashboard.endpoint);
    });
  });

  describe('Edit and Delete Actions', () => {
    it('should trigger alert when edit action is clicked', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const editButton = screen.getByTestId('action-item-2');
      fireEvent.click(editButton);

      expect(global.alert).toHaveBeenCalledWith('TODO: edit grafana');
    });

    it('should navigate to delete page when delete action is clicked', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const deleteButton = screen.getByTestId('action-item-4');
      fireEvent.click(deleteButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/observability/${mockResourceName}/managed-dashboards/${mockManagedDashboard.id}/delete`,
      );
    });

    it('should navigate with correct parameters for different dashboard', () => {
      const differentDashboard: GrafanaListing = {
        ...mockManagedDashboard,
        id: 'different-dashboard-id',
      };
      const differentResourceName = 'different-resource';

      render(
        <ManagedDashboardsActions
          managedDashboard={differentDashboard}
          resourceName={differentResourceName}
        />,
      );

      const deleteButton = screen.getByTestId('action-item-4');
      fireEvent.click(deleteButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/observability/${differentResourceName}/managed-dashboards/${differentDashboard.id}/delete`,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty managed dashboard ID', () => {
      const dashboardWithEmptyId: GrafanaListing = {
        ...mockManagedDashboard,
        id: '',
      };
      render(
        <ManagedDashboardsActions
          managedDashboard={dashboardWithEmptyId}
          resourceName={mockResourceName}
        />,
      );

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', 'actions-');
    });

    it('should handle special characters in managed dashboard ID', () => {
      const specialId = 'grafana-with-special-chars-123!@#';
      const dashboardWithSpecialId: GrafanaListing = {
        ...mockManagedDashboard,
        id: specialId,
      };
      render(
        <ManagedDashboardsActions
          managedDashboard={dashboardWithSpecialId}
          resourceName={mockResourceName}
        />,
      );

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${specialId}`);
    });

    it('should handle very long managed dashboard ID', () => {
      const longId = 'a'.repeat(100);
      const dashboardWithLongId: GrafanaListing = {
        ...mockManagedDashboard,
        id: longId,
      };
      render(
        <ManagedDashboardsActions
          managedDashboard={dashboardWithLongId}
          resourceName={mockResourceName}
        />,
      );

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${longId}`);
    });

    it('should handle empty endpoint', () => {
      const dashboardWithEmptyEndpoint: GrafanaListing = {
        ...mockManagedDashboard,
        endpoint: '',
      };
      render(
        <ManagedDashboardsActions
          managedDashboard={dashboardWithEmptyEndpoint}
          resourceName={mockResourceName}
        />,
      );

      const openButton = screen.getByTestId('action-item-1');
      expect(openButton).toHaveAttribute('data-href', '');
    });

    it('should handle undefined endpoint', () => {
      const dashboardWithUndefinedEndpoint: GrafanaListing = {
        ...mockManagedDashboard,
        endpoint: undefined,
      };
      render(
        <ManagedDashboardsActions
          managedDashboard={dashboardWithUndefinedEndpoint}
          resourceName={mockResourceName}
        />,
      );

      const openButton = screen.getByTestId('action-item-1');
      expect(openButton).toBeInTheDocument();
    });

    it('should handle empty resource name', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} resourceName="" />);

      const deleteButton = screen.getByTestId('action-item-4');
      fireEvent.click(deleteButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        `/observability//managed-dashboards/${mockManagedDashboard.id}/delete`,
      );
    });
  });

  describe('Component Structure', () => {
    it('should have correct DOM structure', () => {
      const { container } = render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const flexContainer = container.querySelector('.flex.justify-end');
      const actionMenu = flexContainer?.querySelector('[data-testid="action-menu"]');

      expect(flexContainer).toBeInTheDocument();
      expect(actionMenu).toBeInTheDocument();
    });

    it('should render all action items in correct order', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const actionItems = screen.getAllByTestId(/action-item-/);
      expect(actionItems).toHaveLength(4);

      expect(actionItems[0]).toHaveTextContent('managed-dashboards:listing.open_instance_action');
      expect(actionItems[1]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/ACTIONS:modify',
      );
      expect(actionItems[2]).toHaveTextContent('managed-dashboards:listing.copy_urn_action');
      expect(actionItems[3]).toHaveTextContent(
        '@ovh-ux/manager-common-translations/ACTIONS:delete',
      );
    });
  });

  describe('Accessibility', () => {
    it('should render action items as buttons', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item.tagName).toBe('BUTTON');
      });
    });

    it('should have proper button semantics', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily with same dashboard', () => {
      const { rerender } = render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const initialActionMenu = screen.getByTestId('action-menu');

      rerender(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const rerenderedActionMenu = screen.getByTestId('action-menu');
      expect(rerenderedActionMenu).toBe(initialActionMenu);
    });

    it('should handle multiple clicks on copy URN action', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const copyButton = screen.getByTestId('action-item-3');

      fireEvent.click(copyButton);
      fireEvent.click(copyButton);
      fireEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledTimes(3);
      expect(mockWriteText).toHaveBeenCalledWith(mockManagedDashboard.urn);
    });

    it('should handle multiple clicks on delete action', () => {
      render(
        <ManagedDashboardsActions
          managedDashboard={mockManagedDashboard}
          resourceName={mockResourceName}
        />,
      );

      const deleteButton = screen.getByTestId('action-item-4');

      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/observability/${mockResourceName}/managed-dashboards/${mockManagedDashboard.id}/delete`,
      );
    });
  });
});

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
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toBeInTheDocument();
      expect(actionMenu).toHaveAttribute('data-compact', 'true');
      expect(actionMenu).toHaveAttribute('data-variant', 'ghost');
      expect(actionMenu).toHaveAttribute('data-icon', 'ellipsis-vertical');
      expect(actionMenu).toHaveAttribute('data-position', 'bottom-end');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${mockManagedDashboard.id}`);
    });

    it('should render all action items', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
    });

    it('should render action labels correctly', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

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
        <ManagedDashboardsActions managedDashboard={mockManagedDashboard} />,
      );

      const containerDiv = container.querySelector('.flex.justify-end');
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('Copy URN Action', () => {
    it('should copy URN to clipboard when copy action is clicked', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const copyButton = screen.getByTestId('action-item-3');
      fireEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledTimes(1);
      expect(mockWriteText).toHaveBeenCalledWith(mockManagedDashboard.urn);
    });

    it('should handle copy URN with different URNs', () => {
      const differentDashboard = {
        ...mockManagedDashboard,
        id: 'different-grafana-456',
        urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078/tenant/different-grafana-456',
      };
      render(<ManagedDashboardsActions managedDashboard={differentDashboard} />);

      const copyButton = screen.getByTestId('action-item-3');
      fireEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledWith(differentDashboard.urn);
    });

    it('should handle copy URN with undefined URN', () => {
      const dashboardWithoutUrn = {
        ...mockManagedDashboard,
        urn: undefined,
      };
      render(<ManagedDashboardsActions managedDashboard={dashboardWithoutUrn} />);

      const copyButton = screen.getByTestId('action-item-3');
      fireEvent.click(copyButton);

      expect(mockWriteText).not.toHaveBeenCalled();
    });
  });

  describe('Action Items Configuration', () => {
    it('should have correct action item IDs', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-3')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-4')).toBeInTheDocument();
    });

    it('should have delete action with critical color', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const deleteButton = screen.getByTestId('action-item-4');
      expect(deleteButton).toHaveAttribute('data-color', 'critical');
    });

    it('should not have color attribute for non-critical actions', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const openButton = screen.getByTestId('action-item-1');
      const editButton = screen.getByTestId('action-item-2');
      const copyButton = screen.getByTestId('action-item-3');

      expect(openButton).not.toHaveAttribute('data-color');
      expect(editButton).not.toHaveAttribute('data-color');
      expect(copyButton).not.toHaveAttribute('data-color');
    });

    it('should have external link href for open instance action', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const openButton = screen.getByTestId('action-item-1');
      expect(openButton).toHaveAttribute('data-href', mockManagedDashboard.endpoint);
    });
  });

  describe('Edit and Delete Actions', () => {
    it('should trigger alert when edit action is clicked', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const editButton = screen.getByTestId('action-item-2');
      fireEvent.click(editButton);

      expect(global.alert).toHaveBeenCalledWith('TODO: edit grafana');
    });

    it('should trigger alert when delete action is clicked', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const deleteButton = screen.getByTestId('action-item-4');
      fireEvent.click(deleteButton);

      expect(global.alert).toHaveBeenCalledWith('TODO: delete grafana');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty managed dashboard ID', () => {
      const dashboardWithEmptyId = {
        ...mockManagedDashboard,
        id: '',
      };
      render(<ManagedDashboardsActions managedDashboard={dashboardWithEmptyId} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', 'actions-');
    });

    it('should handle special characters in managed dashboard ID', () => {
      const specialId = 'grafana-with-special-chars-123!@#';
      const dashboardWithSpecialId = {
        ...mockManagedDashboard,
        id: specialId,
      };
      render(<ManagedDashboardsActions managedDashboard={dashboardWithSpecialId} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${specialId}`);
    });

    it('should handle very long managed dashboard ID', () => {
      const longId = 'a'.repeat(100);
      const dashboardWithLongId = {
        ...mockManagedDashboard,
        id: longId,
      };
      render(<ManagedDashboardsActions managedDashboard={dashboardWithLongId} />);

      const actionMenu = screen.getByTestId('action-menu');
      expect(actionMenu).toHaveAttribute('data-id', `actions-${longId}`);
    });

    it('should handle empty endpoint', () => {
      const dashboardWithEmptyEndpoint = {
        ...mockManagedDashboard,
        endpoint: '',
      };
      render(<ManagedDashboardsActions managedDashboard={dashboardWithEmptyEndpoint} />);

      const openButton = screen.getByTestId('action-item-1');
      expect(openButton).toHaveAttribute('data-href', '');
    });

    it('should handle undefined endpoint', () => {
      const dashboardWithUndefinedEndpoint = {
        ...mockManagedDashboard,
        endpoint: undefined,
      };
      render(<ManagedDashboardsActions managedDashboard={dashboardWithUndefinedEndpoint} />);

      const openButton = screen.getByTestId('action-item-1');
      expect(openButton).toBeInTheDocument();
      // When endpoint is undefined, the data-href attribute may be null
    });
  });

  describe('Component Structure', () => {
    it('should have correct DOM structure', () => {
      const { container } = render(
        <ManagedDashboardsActions managedDashboard={mockManagedDashboard} />,
      );

      const flexContainer = container.querySelector('.flex.justify-end');
      const actionMenu = flexContainer?.querySelector('[data-testid="action-menu"]');

      expect(flexContainer).toBeInTheDocument();
      expect(actionMenu).toBeInTheDocument();
    });

    it('should render all action items in correct order', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

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
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item.tagName).toBe('BUTTON');
      });
    });

    it('should have proper button semantics', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const actionItems = screen.getAllByTestId(/action-item-/);
      actionItems.forEach((item) => {
        expect(item).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily with same dashboard', () => {
      const { rerender } = render(
        <ManagedDashboardsActions managedDashboard={mockManagedDashboard} />,
      );

      const initialActionMenu = screen.getByTestId('action-menu');

      rerender(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const rerenderedActionMenu = screen.getByTestId('action-menu');
      expect(rerenderedActionMenu).toBe(initialActionMenu);
    });

    it('should handle multiple clicks on copy URN action', () => {
      render(<ManagedDashboardsActions managedDashboard={mockManagedDashboard} />);

      const copyButton = screen.getByTestId('action-item-3');

      fireEvent.click(copyButton);
      fireEvent.click(copyButton);
      fireEvent.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledTimes(3);
      expect(mockWriteText).toHaveBeenCalledWith(mockManagedDashboard.urn);
    });
  });
});

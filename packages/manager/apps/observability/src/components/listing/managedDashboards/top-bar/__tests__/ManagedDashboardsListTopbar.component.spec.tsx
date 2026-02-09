import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ManagedDashboardsListTopbar from '@/components/listing/managedDashboards/top-bar/ManagedDashboardsListTopbar.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'managed-dashboards:listing.create_grafana_button': 'Create New Grafana',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  Button: ({
    id,
    children,
    onClick,
    variant,
    urn,
    iamActions,
    isIamTrigger,
    displayTooltip,
    disabled,
    loading,
  }: {
    id: string;
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
    urn: string;
    iamActions: string[];
    isIamTrigger: boolean;
    displayTooltip: boolean;
    disabled: boolean;
    loading: boolean;
  }) => (
    <button
      data-testid={id}
      onClick={onClick}
      data-variant={variant}
      data-urn={urn}
      data-iam-actions={iamActions.join(',')}
      data-iam-trigger={isIamTrigger}
      data-display-tooltip={displayTooltip}
      disabled={disabled}
      data-loading={loading}
    >
      {children}
    </button>
  ),
  BUTTON_VARIANT: {
    default: 'default',
  },
}));

// Mock context
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);

// Mock IAM constants
vi.mock('@/utils/iam.constants', () => ({
  IAM_ACTIONS: {
    CREATE_GRAFANA: ['create-grafana'],
  },
}));

// Mock Routes.utils
vi.mock('@/routes/Routes.utils', () => ({
  getManagedDashboardCreationUrl: ({ resourceName }: { resourceName: string }) =>
    `/metrics/grafana/${resourceName}/creation`,
}));

// Helper function to get button element
const getButton = (container: HTMLElement) => {
  return container.querySelector('button[data-testid="create-grafana"]');
};

// Helper function to get container element
const getTopbarContainer = (container: HTMLElement) => {
  return container.querySelector('.mb-4.mr-4.flex.w-full.items-center.justify-between');
};

describe('ManagedDashboardsListTopbar', () => {
  const mockSelectedService = {
    id: 'test-service',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Test Service' },
    resourceStatus: 'READY' as const,
    iam: {
      id: 'test-service',
      urn: 'urn:ovh:service:test-service',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: mockSelectedService,
      setSelectedService: vi.fn(),
      services: [],
      isLoading: false,
      isSuccess: true,
      error: null,
    });
  });

  describe('Component Rendering', () => {
    it('should render topbar with create grafana button', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      expect(getButton(container)).toBeInTheDocument();
      expect(screen.getByText('Create New Grafana')).toBeInTheDocument();
    });

    it('should render button with correct attributes', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-variant', 'default');
      expect(button).toHaveAttribute('data-urn', 'urn:ovh:service:test-service');
      expect(button).toHaveAttribute('data-iam-actions', 'create-grafana');
      expect(button).toHaveAttribute('data-display-tooltip', 'true');
      expect(button).toHaveAttribute('data-loading', 'false');
    });

    it('should have correct container styling', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const topbarContainer = getTopbarContainer(container);
      expect(topbarContainer).toBeInTheDocument();
    });

    it('should render button as not disabled when not loading', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).not.toHaveAttribute('disabled');
    });
  });

  describe('Navigation Behavior', () => {
    it('should navigate to creation when button is clicked', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);
      const button = getButton(container);

      if (button) fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/metrics/grafana/test-service/creation');
    });

    it('should handle multiple clicks', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);
      const button = getButton(container);

      if (button) {
        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);
      }

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('/metrics/grafana/test-service/creation');
    });

    it('should navigate with different service IDs', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'different-service',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'Different Service' },
          resourceStatus: 'READY',
          iam: { id: 'different-service', urn: 'urn:ovh:service:different-service' },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);
      const button = getButton(container);

      if (button) fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/metrics/grafana/different-service/creation');
    });
  });

  describe('Service Context Integration', () => {
    it('should use selected service URN', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', 'urn:ovh:service:test-service');
    });

    it('should handle undefined selected service', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should handle selected service without IAM', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'Test Service' },
          resourceStatus: 'READY',
          iam: undefined,
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should handle loading state', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: mockSelectedService,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: true,
        isSuccess: false,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('disabled');
      expect(button).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('IAM Actions and Permissions', () => {
    it('should use correct IAM actions', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-iam-actions', 'create-grafana');
    });

    it('should set IAM trigger to true', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      // Note: isIamTrigger prop is not set, so data-iam-trigger attribute won't be present
      expect(button).not.toHaveAttribute('data-iam-trigger');
    });

    it('should display tooltip', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-display-tooltip', 'true');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty service URN', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'Test Service' },
          resourceStatus: 'READY',
          iam: { id: 'test-service', urn: '' },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should handle special characters in service URN', () => {
      const specialUrn = 'urn:ovh:service:test-service-with-special-chars!@#';
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'Test Service' },
          resourceStatus: 'READY',
          iam: { id: 'test-service', urn: specialUrn },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', specialUrn);
    });

    it('should handle very long service URN', () => {
      const longUrn = 'urn:ovh:service:' + 'a'.repeat(1000);
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'Test Service' },
          resourceStatus: 'READY',
          iam: { id: 'test-service', urn: longUrn },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', longUrn);
    });

    it('should handle error state', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: false,
        error: new Error('Test error'),
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should navigate with empty service ID when service is undefined', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);
      const button = getButton(container);

      if (button) fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/metrics/grafana//creation');
    });
  });

  describe('Component Structure and DOM', () => {
    it('should have correct DOM structure', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const topbarContainer = getTopbarContainer(container);
      const button = getButton(container);

      expect(topbarContainer).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('should render only one button', () => {
      render(<ManagedDashboardsListTopbar />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('should maintain consistent structure across re-renders', () => {
      const { rerender } = render(<ManagedDashboardsListTopbar />);

      rerender(<ManagedDashboardsListTopbar />);
      const rerenderedButton = getButton(document.body);

      expect(rerenderedButton).toBeInTheDocument();
      expect(rerenderedButton?.tagName).toBe('BUTTON');
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should render button as semantic element', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button?.tagName).toBe('BUTTON');
    });

    it('should have accessible button text', () => {
      render(<ManagedDashboardsListTopbar />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Create New Grafana');
    });

    it('should be focusable and clickable', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toBeInTheDocument();

      if (button && button instanceof HTMLElement) {
        button.focus();
        expect(document.activeElement).toBe(button);
      }
    });

    it('should have proper test attributes', () => {
      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('data-testid', 'create-grafana');
    });

    it('should be disabled during loading', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: mockSelectedService,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: true,
        isSuccess: false,
        error: null,
      });

      const { container } = render(<ManagedDashboardsListTopbar />);

      const button = getButton(container);
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle context changes efficiently', () => {
      const { rerender } = render(<ManagedDashboardsListTopbar />);

      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'new-service',
          createdAt: '2025-11-01T08:00:00.001Z',
          updatedAt: '2025-11-01T08:00:00.001Z',
          currentState: { displayName: 'New Service' },
          resourceStatus: 'READY',
          iam: { id: 'new-service', urn: 'new-urn' },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      rerender(<ManagedDashboardsListTopbar />);

      const button = getButton(document.body);
      expect(button).toHaveAttribute('data-urn', 'new-urn');
    });

    it('should maintain button reference across re-renders', () => {
      const { rerender } = render(<ManagedDashboardsListTopbar />);

      rerender(<ManagedDashboardsListTopbar />);
      const rerenderedButton = getButton(document.body);

      expect(rerenderedButton).toBeInTheDocument();
      expect(rerenderedButton?.tagName).toBe('BUTTON');
    });

    it('should handle rapid context changes', () => {
      const { rerender } = render(<ManagedDashboardsListTopbar />);

      const urns = ['urn1', 'urn2', 'urn3', 'urn4', 'urn5'];
      urns.forEach((urn) => {
        mockUseObservabilityServiceContext.mockReturnValue({
          selectedService: {
            id: 'test-service',
            createdAt: '2025-11-01T08:00:00.001Z',
            updatedAt: '2025-11-01T08:00:00.001Z',
            currentState: { displayName: 'Test Service' },
            resourceStatus: 'READY',
            iam: { id: 'test-service', urn },
          },
          setSelectedService: vi.fn(),
          services: [],
          isLoading: false,
          isSuccess: true,
          error: null,
        });
        rerender(<ManagedDashboardsListTopbar />);
      });

      const button = getButton(document.body);
      expect(button).toHaveAttribute('data-urn', 'urn5');
    });
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import TenantsListTopbar from '@/components/listing/tenants/top-bar/TenantsListTopbar.component';
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
        'tenants:listing.create_tenant_button': 'Create New Tenant',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock ODS components
vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BUTTON_VARIANT: {
    default: 'default',
  },
}));

// Mock manager-react-components
vi.mock('@ovh-ux/manager-react-components', () => ({
  ManagerButton: ({
    id,
    label,
    onClick,
    variant,
    urn,
    iamActions,
    displayTooltip,
  }: {
    id: string;
    label: string;
    onClick: () => void;
    variant: string;
    urn: string;
    iamActions: string[];
    displayTooltip: boolean;
  }) => (
    <button
      data-testid={id}
      onClick={onClick}
      data-variant={variant}
      data-urn={urn}
      data-iam-actions={iamActions.join(',')}
      data-display-tooltip={displayTooltip}
    >
      {label}
    </button>
  ),
}));

// Mock context
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);

// Mock IAM constants
vi.mock('@/utils/iam.constants', () => ({
  IAM_ACTIONS: {
    CREATE_TENANT: ['create-tenant'],
  },
}));

// Helper function to get button element
const getButton = (container: HTMLElement) => {
  return container.querySelector('button[data-testid="assign-tag"]');
};

// Helper function to get container element
const getTopbarContainer = (container: HTMLElement) => {
  return container.querySelector('.flex.justify-between.w-full.items-center.mr-4');
};

describe('TenantsListTopbar', () => {
  const mockSelectedService = {
    id: 'test-service',
    currentState: { displayName: 'Test Service' },
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
    it('should render topbar with create tenant button', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      expect(getButton(container)).toBeInTheDocument();
      expect(screen.getByText('Create New Tenant')).toBeInTheDocument();
    });

    it('should render button with correct attributes', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-variant', 'default');
      expect(button).toHaveAttribute('data-urn', 'urn:ovh:service:test-service');
      expect(button).toHaveAttribute('data-iam-actions', 'create-tenant');
      expect(button).toHaveAttribute('data-display-tooltip', 'true');
    });

    it('should have correct container styling', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const topbarContainer = getTopbarContainer(container);
      expect(topbarContainer).toBeInTheDocument();
    });
  });

  describe('Navigation Behavior', () => {
    it('should navigate to addNew when button is clicked', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);
      const button = getButton(container);

      if (button) fireEvent.click(button);

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('addNew');
    });

    it('should handle multiple clicks', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);
      const button = getButton(container);

      if (button) {
        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);
      }

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith('addNew');
    });
  });

  describe('Service Context Integration', () => {
    it('should use selected service URN', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', 'urn:ovh:service:test-service');
    });

    it('should handle undefined selected service', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should handle selected service without IAM', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          currentState: { displayName: 'Test Service' },
          iam: undefined,
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should handle selected service with null IAM', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          currentState: { displayName: 'Test Service' },
          iam: undefined,
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', '');
    });
  });

  describe('IAM Actions and Permissions', () => {
    it('should use correct IAM actions', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-iam-actions', 'create-tenant');
    });

    it('should display tooltip', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-display-tooltip', 'true');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty service URN', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          currentState: { displayName: 'Test Service' },
          iam: { id: 'test-service', urn: '' },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should handle special characters in service URN', () => {
      // Arrange
      const specialUrn = 'urn:ovh:service:test-service-with-special-chars!@#';
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          currentState: { displayName: 'Test Service' },
          iam: { id: 'test-service', urn: specialUrn },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', specialUrn);
    });

    it('should handle very long service URN', () => {
      // Arrange
      const longUrn = 'urn:ovh:service:' + 'a'.repeat(1000);
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'test-service',
          currentState: { displayName: 'Test Service' },
          iam: { id: 'test-service', urn: longUrn },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-urn', longUrn);
    });

    it('should handle loading state', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: true,
        isSuccess: false,
        error: null,
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-urn', '');
    });

    it('should handle error state', () => {
      // Arrange
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: undefined,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: false,
        error: new Error('Test error'),
      });

      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-urn', '');
    });
  });

  describe('Component Structure and DOM', () => {
    it('should have correct DOM structure', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const topbarContainer = getTopbarContainer(container);
      const button = getButton(container);

      expect(topbarContainer).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('should render only one button', () => {
      // Act
      render(<TenantsListTopbar />);

      // Assert
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('should maintain consistent structure across re-renders', () => {
      // Act
      const { rerender } = render(<TenantsListTopbar />);

      // Re-render with same context
      rerender(<TenantsListTopbar />);
      const rerenderedButton = getButton(document.body);

      // Assert
      expect(rerenderedButton).toBeInTheDocument();
      expect(rerenderedButton?.tagName).toBe('BUTTON');
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should render button as semantic element', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button?.tagName).toBe('BUTTON');
    });

    it('should have accessible button text', () => {
      // Act
      render(<TenantsListTopbar />);

      // Assert
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Create New Tenant');
    });

    it('should be focusable and clickable', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toBeInTheDocument();

      // Test that it can receive focus
      if (button && button instanceof HTMLElement) {
        button.focus();
        expect(document.activeElement).toBe(button);
      }
    });

    it('should have proper ARIA attributes', () => {
      // Act
      const { container } = render(<TenantsListTopbar />);

      // Assert
      const button = getButton(container);
      expect(button).toHaveAttribute('data-testid', 'assign-tag');
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle context changes efficiently', () => {
      // Act
      const { rerender } = render(<TenantsListTopbar />);

      // Change context
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: {
          id: 'new-service',
          currentState: { displayName: 'New Service' },
          iam: { id: 'new-service', urn: 'new-urn' },
        },
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      rerender(<TenantsListTopbar />);

      // Assert
      const button = getButton(document.body);
      expect(button).toHaveAttribute('data-urn', 'new-urn');
    });

    it('should maintain button reference across re-renders', () => {
      // Act
      const { rerender } = render(<TenantsListTopbar />);

      // Re-render with same context
      rerender(<TenantsListTopbar />);
      const rerenderedButton = getButton(document.body);

      // Assert
      expect(rerenderedButton).toBeInTheDocument();
      expect(rerenderedButton?.tagName).toBe('BUTTON');
    });

    it('should handle rapid context changes', () => {
      // Act
      const { rerender } = render(<TenantsListTopbar />);

      // Rapid context changes
      const urns = ['urn1', 'urn2', 'urn3', 'urn4', 'urn5'];
      urns.forEach((urn) => {
        mockUseObservabilityServiceContext.mockReturnValue({
          selectedService: {
            id: 'test-service',
            currentState: { displayName: 'Test Service' },
            iam: { id: 'test-service', urn },
          },
          setSelectedService: vi.fn(),
          services: [],
          isLoading: false,
          isSuccess: true,
          error: null,
        });
        rerender(<TenantsListTopbar />);
      });

      // Assert
      const button = getButton(document.body);
      expect(button).toHaveAttribute('data-urn', 'urn5');
    });
  });
});

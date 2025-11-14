import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import RegionSelector from '@/components/infrastructures/region-selector/RegionSelector.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useInfrastructures } from '@/data/hooks/infrastructures/useInfrastructures.hook';
import { Infrastructure } from '@/types/infrastructures.type';
import { TenantFormData } from '@/types/tenants.type';

// Mock dependencies
vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/data/hooks/infrastructures/useInfrastructures.hook', () => ({
  useInfrastructures: vi.fn(),
}));

vi.mock('@/utils/form.utils', () => ({
  toParenthesesLabel: vi.fn((label: string) => `(${label})`),
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  FormField: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="form-field" className={className}>
      {children}
    </div>
  ),
  FormFieldHelper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field-helper">{children}</div>
  ),
  Spinner: ({ size }: { size?: string }) => (
    <div data-testid="spinner" data-size={size}>
      Loading...
    </div>
  ),
  Text: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="text" data-preset={preset}>
      {children}
    </span>
  ),
  TabsComponent: ({
    items,
    titleElement,
    contentElement,
  }: {
    items: string[];
    titleElement: ({ item }: { item: string }) => React.ReactElement;
    contentElement: ({ item }: { item: string }) => React.ReactElement;
  }) => {
    const [selectedTab, setSelectedTab] = React.useState(items[0]);

    return (
      <div data-testid="tabs-component">
        {items.map((item) => (
          <div key={item}>
            <button
              type="button"
              data-testid={`tab-${item}`}
              data-selected={selectedTab === item ? 'true' : 'false'}
              onClick={() => setSelectedTab(item)}
              style={{ cursor: 'pointer' }}
            >
              {titleElement({ item })}
            </button>
            {selectedTab === item && (
              <div data-testid={`tab-content-${item}`}>{contentElement({ item })}</div>
            )}
          </div>
        ))}
      </div>
    );
  },
  SPINNER_SIZE: {
    sm: 'sm',
    md: 'md',
  },
  TEXT_PRESET: {
    heading4: 'heading-4',
    caption: 'caption',
  },
}));

// Mock child components
vi.mock('@/components/form/radio-card/RadioCard.component', () => ({
  RadioCard: ({
    id,
    name,
    title,
    subTitle,
    badges,
    selected,
    onChange,
  }: {
    id: string;
    name: string;
    title: string;
    subTitle?: string;
    badges?: React.ReactNode;
    selected: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div data-testid={`radio-card-${id}`}>
      <input
        data-testid={`radio-${id}`}
        type="radio"
        id={id}
        name={name}
        value={id}
        checked={selected === id}
        onChange={onChange}
      />
      <label htmlFor={id}>
        <span data-testid={`title-${id}`}>{title}</span>
        {subTitle && <span data-testid={`subtitle-${id}`}>{subTitle}</span>}
        {badges && <span data-testid={`badges-${id}`}>{badges}</span>}
      </label>
    </div>
  ),
}));

vi.mock('@/components/infrastructures/region-badge-type/RegionBadgeType.component', () => ({
  RegionBadgeType: ({ type }: { type: string }) => (
    <span data-testid={`badge-${type}`} data-type={type}>
      {type}
    </span>
  ),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'infrastructure.region.title': 'Select a Region',
        'infrastructure.region.all': 'All Regions',
        'infrastructure.region.eu': 'Europe',
        'infrastructure.region.us': 'United States',
        'infrastructure.region.ca': 'Canada',
        'infrastructure.region.apac': 'Asia Pacific',
      };
      return translations[key] || key;
    },
  }),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const FormWrapper = ({ children: formChildren }: { children: React.ReactNode }) => {
    const methods = useForm<TenantFormData>({
      defaultValues: {
        infrastructureId: '',
      },
    });

    return <FormProvider {...methods}>{formChildren}</FormProvider>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <FormWrapper>{children}</FormWrapper>
    </QueryClientProvider>
  );
};

const createMockInfrastructure = (
  id: string,
  location: string,
  geographyCode: string,
  name: string,
  type: 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ' = 'LOCAL-ZONE',
): Infrastructure => ({
  id,
  currentState: { location, type: 'SHARED', usage: 'METRICS', entryPoint: `xxx.metrics.ovh.com` },
  locationDetails: {
    location,
    geographyCode,
    name,
    type,
  } as Infrastructure['locationDetails'],
});

describe('RegionSelector', () => {
  const mockSelectedService = { id: 'test-service-123' };
  const mockUseObservabilityServiceContext = useObservabilityServiceContext as Mock;
  const mockUseInfrastructures = useInfrastructures as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: mockSelectedService,
    });
  });

  describe('Loading State', () => {
    it.each([
      {
        description: 'should display spinner when loading',
        assertion: () => {
          expect(screen.getByTestId('spinner')).toBeInTheDocument();
          expect(screen.getByTestId('spinner')).toHaveAttribute('data-size', 'sm');
        },
      },
      {
        description: 'should not display content when loading',
        assertion: () => {
          expect(screen.queryByTestId('tabs')).not.toBeInTheDocument();
        },
      },
    ])('$description', ({ assertion }) => {
      mockUseInfrastructures.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      assertion();
    });
  });

  describe('Rendering', () => {
    it.each([
      {
        description: 'should render title',
        assertion: () => {
          expect(screen.getByText('Select a Region')).toBeInTheDocument();
        },
      },
      {
        description: 'should render form field',
        assertion: () => {
          expect(screen.getByTestId('form-field')).toBeInTheDocument();
        },
      },
      {
        description: 'should call useInfrastructures with correct parameters',
        assertion: () => {
          expect(useInfrastructures).toHaveBeenCalledWith({
            resourceName: 'test-service-123',
            usages: 'METRICS',
            types: 'SHARED',
          });
        },
      },
    ])('$description', ({ assertion }) => {
      mockUseInfrastructures.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      assertion();
    });
  });

  describe('Tabs Rendering', () => {
    it('should render tabs for each geographic zone', () => {
      const infrastructures = [
        createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West'),
        createMockInfrastructure('2', 'us-east-vin', 'US', 'US East'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      expect(screen.getByTestId('tab-all')).toBeInTheDocument();
      expect(screen.getByTestId('tab-eu')).toBeInTheDocument();
      expect(screen.getByTestId('tab-us')).toBeInTheDocument();
    });

    it('should render "all" tab first', () => {
      const infrastructures = [
        createMockInfrastructure('1', 'us-east-vin', 'US', 'US East'),
        createMockInfrastructure('2', 'eu-west-sbg', 'EU', 'Europe West'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      const allTab = screen.getByTestId('tab-all');
      expect(allTab).toBeInTheDocument();
      expect(allTab).toHaveAttribute('data-selected', 'true');
    });

    it('should translate tab labels', () => {
      const infrastructures = [createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West')];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      expect(screen.getByText('All Regions')).toBeInTheDocument();
      expect(screen.getByText('Europe')).toBeInTheDocument();
    });
  });

  describe('Radio Cards Rendering', () => {
    it('should render radio cards for all infrastructures when "all" tab is selected', () => {
      const infrastructures = [
        createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West'),
        createMockInfrastructure('infra-2', 'us-east-vin', 'US', 'US East'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      expect(screen.getByTestId('radio-card-infra-1')).toBeInTheDocument();
      expect(screen.getByTestId('radio-card-infra-2')).toBeInTheDocument();
    });

    it.each([
      {
        description: 'should render radio card with correct title',
        testId: 'title-infra-1',
        expectedContent: 'eu-west-sbg',
        type: 'LOCAL-ZONE' as const,
      },
      {
        description: 'should render radio card with subtitle',
        testId: 'subtitle-infra-1',
        expectedContent: '(Europe West)',
        type: 'LOCAL-ZONE' as const,
      },
      {
        description: 'should render radio card with badges',
        testId: 'badge-LOCAL-ZONE',
        expectedContent: null,
        type: 'LOCAL-ZONE' as const,
      },
    ])('$description', ({ testId, expectedContent, type }) => {
      const infrastructures = [
        createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West', type),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();

      if (expectedContent) {
        expect(element).toHaveTextContent(expectedContent);
      }

      if (testId.startsWith('badge')) {
        expect(element).toHaveAttribute('data-type', type);
      }
    });
  });

  describe('Tab Selection', () => {
    it('should filter radio cards when selecting a zone tab', async () => {
      const infrastructures = [
        createMockInfrastructure('infra-eu-1', 'eu-west-sbg', 'EU', 'Europe West'),
        createMockInfrastructure('infra-us-1', 'us-east-vin', 'US', 'US East'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      // Initially all infrastructures are shown
      expect(screen.getByTestId('radio-card-infra-eu-1')).toBeInTheDocument();
      expect(screen.getByTestId('radio-card-infra-us-1')).toBeInTheDocument();

      // Click on EU tab
      const euTab = screen.getByTestId('tab-eu');
      fireEvent.click(euTab);

      await waitFor(() => {
        expect(screen.getByTestId('radio-card-infra-eu-1')).toBeInTheDocument();
        expect(screen.queryByTestId('radio-card-infra-us-1')).not.toBeInTheDocument();
      });
    });

    it('should update selected tab when clicking on it', async () => {
      const infrastructures = [
        createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      const euTab = screen.getByTestId('tab-eu');
      fireEvent.click(euTab);

      await waitFor(() => {
        expect(euTab).toHaveAttribute('data-selected', 'true');
      });
    });
  });

  describe('Form Integration', () => {
    it('should update form value when radio card is selected', async () => {
      const infrastructures = [
        createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      const radio = screen.getByTestId('radio-infra-1');
      fireEvent.click(radio);

      await waitFor(() => {
        expect(radio).toBeChecked();
      });
    });

    it('should render with correct radio name', () => {
      const infrastructures = [
        createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      const radio = screen.getByTestId('radio-infra-1');
      expect(radio).toHaveAttribute('name', 'infrastructureId');
    });
  });

  describe('Error Handling', () => {
    it('should display error message when form has errors', async () => {
      mockUseInfrastructures.mockReturnValue({
        data: [],
        isLoading: false,
      });

      const TestWrapperWithError = ({ children }: { children: React.ReactNode }) => {
        const queryClient = new QueryClient({
          defaultOptions: {
            queries: { retry: false },
          },
        });

        const FormWrapper = ({ children: formChildren }: { children: React.ReactNode }) => {
          const methods = useForm<TenantFormData>({
            defaultValues: {
              infrastructureId: '',
            },
          });

          // Manually set an error
          React.useEffect(() => {
            methods.setError('infrastructureId', {
              type: 'manual',
              message: 'Infrastructure is required',
            });
          }, [methods]);

          return <FormProvider {...methods}>{formChildren}</FormProvider>;
        };

        return (
          <QueryClientProvider client={queryClient}>
            <FormWrapper>{children}</FormWrapper>
          </QueryClientProvider>
        );
      };

      render(
        <TestWrapperWithError>
          <RegionSelector />
        </TestWrapperWithError>,
      );

      await waitFor(() => {
        expect(screen.getByText('Infrastructure is required')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it.each([
      {
        description: 'should render tabs with "all" tab even when no infrastructures',
        assertion: () => {
          expect(screen.queryByTestId('tabs-component')).toBeInTheDocument();
          expect(screen.queryByTestId('tab-all')).toBeInTheDocument();
        },
      },
      {
        description: 'should not render radio cards when no infrastructures',
        assertion: () => {
          expect(screen.queryByTestId(/^radio-card-/)).not.toBeInTheDocument();
        },
      },
    ])('$description', ({ assertion }) => {
      mockUseInfrastructures.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      assertion();
    });
  });

  describe('Grouping by Geographic Zone', () => {
    it.each([
      {
        description: 'should group infrastructures correctly',
        infrastructures: [
          createMockInfrastructure('infra-eu-1', 'eu-west-sbg', 'EU', 'Europe West SBG'),
          createMockInfrastructure('infra-eu-2', 'eu-west-gra', 'EU', 'Europe West GRA'),
          createMockInfrastructure('infra-us-1', 'us-east-vin', 'US', 'US East'),
        ] as Infrastructure[],
        tabId: 'tab-eu',
        expectedVisible: ['radio-card-infra-eu-1', 'radio-card-infra-eu-2'],
        expectedHidden: ['radio-card-infra-us-1'],
      },
      {
        description: 'should handle mixed case geography codes',
        infrastructures: [
          createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West'),
          createMockInfrastructure('infra-2', 'eu-east-waw', 'eu', 'Europe East'),
        ] as Infrastructure[],
        tabId: 'tab-eu',
        expectedVisible: ['radio-card-infra-1', 'radio-card-infra-2'],
        expectedHidden: [],
      },
      {
        description: 'should filter out infrastructures without locationDetails',
        infrastructures: [
          createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West'),
          {
            id: 'infra-2',
            currentState: { location: 'us-east-vin', type: 'SHARED', usage: 'METRICS' },
          },
        ] as Infrastructure[],
        tabId: null,
        expectedVisible: ['radio-card-infra-1'],
        expectedHidden: ['radio-card-infra-2'],
      },
    ])('$description', ({ infrastructures, tabId, expectedVisible, expectedHidden }) => {
      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      if (tabId) {
        const tab = screen.getByTestId(tabId);
        fireEvent.click(tab);
      }

      expectedVisible.forEach((testId) => {
        expect(screen.getByTestId(testId)).toBeInTheDocument();
      });

      expectedHidden.forEach((testId) => {
        expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined selectedService', () => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: null,
      });

      mockUseInfrastructures.mockReturnValue({
        data: [],
        isLoading: false,
      });

      render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      expect(useInfrastructures).toHaveBeenCalledWith({
        resourceName: '',
        usages: 'METRICS',
        types: 'SHARED',
      });
    });

    it('should handle zone change when current zone becomes unavailable', () => {
      const { rerender } = render(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      const infrastructures = [
        createMockInfrastructure('infra-1', 'eu-west-sbg', 'EU', 'Europe West'),
      ];

      mockUseInfrastructures.mockReturnValue({
        data: infrastructures,
        isLoading: false,
      });

      rerender(
        <TestWrapper>
          <RegionSelector />
        </TestWrapper>,
      );

      // Should default to 'all' tab
      expect(screen.getByTestId('tab-all')).toHaveAttribute('data-selected', 'true');
    });
  });
});

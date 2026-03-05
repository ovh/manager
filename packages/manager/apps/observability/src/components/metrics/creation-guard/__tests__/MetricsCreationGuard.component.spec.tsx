import React from 'react';

import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MetricsCreationGuard from '@/components/metrics/creation-guard/MetricsCreationGuard.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { ObservabilityService } from '@/types/observability.type';

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@ovh-ux/muk', () => ({
  RedirectionGuard: ({
    children,
    condition,
    isLoading,
    route,
  }: {
    children: React.ReactNode;
    condition: boolean;
    isLoading: boolean;
    route: string;
  }) => (
    <div
      data-testid="redirection-guard"
      data-condition={condition}
      data-is-loading={isLoading}
      data-route={route}
    >
      {children}
    </div>
  ),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);

const mockService: ObservabilityService = {
  id: 'service-1',
  createdAt: '2025-11-01T08:00:00.001Z',
  updatedAt: '2025-11-01T08:00:00.001Z',
  currentState: { displayName: 'Service One' },
  resourceStatus: 'READY',
};

describe('MetricsCreationGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RedirectionGuard condition', () => {
    it.each([
      {
        scenario: 'no service selected and isSuccess is true',
        contextValue: {
          selectedService: undefined,
          isLoading: false,
          isSuccess: true,
        },
        expectedCondition: 'true',
      },
      {
        scenario: 'service selected and isSuccess is true',
        contextValue: {
          selectedService: mockService,
          isLoading: false,
          isSuccess: true,
        },
        expectedCondition: 'false',
      },
      {
        scenario: 'no service selected and isSuccess is false',
        contextValue: {
          selectedService: undefined,
          isLoading: false,
          isSuccess: false,
        },
        expectedCondition: 'false',
      },
      {
        scenario: 'service selected and isSuccess is false',
        contextValue: {
          selectedService: mockService,
          isLoading: false,
          isSuccess: false,
        },
        expectedCondition: 'false',
      },
    ])(
      'should set condition to $expectedCondition when $scenario',
      ({ contextValue, expectedCondition }) => {
        mockUseObservabilityServiceContext.mockReturnValue({
          services: [],
          setSelectedService: vi.fn(),
          error: null,
          ...contextValue,
        });

        render(
          <MetricsCreationGuard route="/redirect">
            <div>Content</div>
          </MetricsCreationGuard>,
        );

        const guard = screen.getByTestId('redirection-guard');
        expect(guard).toHaveAttribute('data-condition', expectedCondition);
      },
    );
  });

  describe('RedirectionGuard isLoading', () => {
    it.each([
      { isLoading: true, expectedIsLoading: 'true' },
      { isLoading: false, expectedIsLoading: 'false' },
    ])(
      'should pass isLoading=$isLoading to RedirectionGuard',
      ({ isLoading, expectedIsLoading }) => {
        mockUseObservabilityServiceContext.mockReturnValue({
          services: [],
          selectedService: mockService,
          setSelectedService: vi.fn(),
          isSuccess: true,
          error: null,
          isLoading,
        });

        render(
          <MetricsCreationGuard route="/redirect">
            <div>Content</div>
          </MetricsCreationGuard>,
        );

        const guard = screen.getByTestId('redirection-guard');
        expect(guard).toHaveAttribute('data-is-loading', expectedIsLoading);
      },
    );
  });

  it('should pass route prop to RedirectionGuard', () => {
    mockUseObservabilityServiceContext.mockReturnValue({
      services: [],
      selectedService: mockService,
      setSelectedService: vi.fn(),
      isLoading: false,
      isSuccess: true,
      error: null,
    });

    const testRoute = '/custom/redirect/path';

    render(
      <MetricsCreationGuard route={testRoute}>
        <div>Content</div>
      </MetricsCreationGuard>,
    );

    const guard = screen.getByTestId('redirection-guard');
    expect(guard).toHaveAttribute('data-route', testRoute);
  });

  it('should render children inside RedirectionGuard', () => {
    mockUseObservabilityServiceContext.mockReturnValue({
      services: [],
      selectedService: mockService,
      setSelectedService: vi.fn(),
      isLoading: false,
      isSuccess: true,
      error: null,
    });

    render(
      <MetricsCreationGuard route="/redirect">
        <div data-testid="child-content">Child Content</div>
      </MetricsCreationGuard>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});

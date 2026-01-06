import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDeleteSubscription } from '@/data/hooks/tenants/useDeleteSubscription.hook';
import UnsubscribeLink from '@/pages/tenants/dashboard/subscription/UnsubscribeLink.component';
import { UnsubscribeLinkProps } from '@/pages/tenants/dashboard/subscription/UnsubscribeLink.props';
import { TenantSubscriptionListing } from '@/types/tenants.type';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockAddError = vi.fn();
const mockAddSuccess = vi.fn();

vi.mock('@ovh-ux/muk', () => ({
  BUTTON_VARIANT: {
    ghost: 'ghost',
    default: 'default',
  },
  Button: ({
    id,
    onClick,
    urn,
    variant,
    iamActions,
    isIamTrigger,
    displayTooltip,
    loading,
    children,
  }: {
    id: string;
    onClick: () => void;
    urn: string;
    variant: string;
    iamActions: string[];
    isIamTrigger: boolean;
    displayTooltip: boolean;
    loading: boolean;
    children: React.ReactNode;
  }) => (
    <button
      data-testid={id}
      onClick={onClick}
      data-urn={urn}
      data-variant={variant}
      data-iam-actions={JSON.stringify(iamActions)}
      data-iam-trigger={isIamTrigger}
      data-display-tooltip={displayTooltip}
      disabled={loading}
      data-loading={loading}
      type="button"
    >
      {children}
    </button>
  ),
  useNotifications: () => ({
    addError: mockAddError,
    addSuccess: mockAddSuccess,
  }),
}));

const mockDeleteSubscription = vi.fn();

vi.mock('@/data/hooks/tenants/useDeleteSubscription.hook', () => ({
  useDeleteSubscription: vi.fn(),
}));

const mockUseDeleteSubscription = vi.mocked(useDeleteSubscription);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const createMockSubscription = (
  overrides: Partial<TenantSubscriptionListing> = {},
): TenantSubscriptionListing => ({
  id: 'subscription-123',
  urn: 'urn:v1:ldp:resource:subscription-123',
  resourceStatus: 'READY',
  resource: {
    name: 'test-resource',
    type: 'logs',
  },
  tags: {},
  search: '',
  ...overrides,
});

describe('UnsubscribeLink.component', () => {
  const defaultProps: UnsubscribeLinkProps = {
    tenantId: 'tenant-123',
    resourceName: 'resource-456',
    subscription: createMockSubscription(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDeleteSubscription.mockReturnValue({
      mutate: mockDeleteSubscription,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteSubscription>);
  });

  describe('Rendering', () => {
    it.each([
      {
        description: 'button with correct id',
        testId: 'delete-subscription',
        assertion: (element: HTMLElement) => expect(element).toBeInTheDocument(),
      },
      {
        description: 'button with ghost variant',
        testId: 'delete-subscription',
        assertion: (element: HTMLElement) =>
          expect(element).toHaveAttribute('data-variant', 'ghost'),
      },
      {
        description: 'button with IAM trigger enabled',
        testId: 'delete-subscription',
        assertion: (element: HTMLElement) =>
          expect(element).toHaveAttribute('data-iam-trigger', 'true'),
      },
      {
        description: 'button with tooltip enabled',
        testId: 'delete-subscription',
        assertion: (element: HTMLElement) =>
          expect(element).toHaveAttribute('data-display-tooltip', 'true'),
      },
    ])('should render $description', ({ testId, assertion }) => {
      render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

      const element = screen.getByTestId(testId);
      assertion(element);
    });

    it('should render translated unsubscribe title', () => {
      render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

      expect(
        screen.getByText('tenants:dashboard.subscription_listing.unsubscribe.title'),
      ).toBeInTheDocument();
    });

    it.each([
      {
        description: 'subscription URN',
        subscription: createMockSubscription({ urn: 'urn:custom:subscription:abc' }),
        expectedUrn: 'urn:custom:subscription:abc',
      },
      {
        description: 'different subscription URN',
        subscription: createMockSubscription({ urn: 'urn:v1:ldp:resource:xyz-789' }),
        expectedUrn: 'urn:v1:ldp:resource:xyz-789',
      },
    ])('should pass correct $description to button', ({ subscription, expectedUrn }) => {
      render(<UnsubscribeLink {...defaultProps} subscription={subscription} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByTestId('delete-subscription')).toHaveAttribute('data-urn', expectedUrn);
    });

    it('should pass correct IAM actions to button', () => {
      render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

      const button = screen.getByTestId('delete-subscription');
      const iamActionsAttr = button.getAttribute('data-iam-actions') ?? '[]';
      const iamActions = JSON.parse(iamActionsAttr) as string[];
      expect(iamActions).toEqual(['ldp:apiovh:output/metric/tenant/subscription/delete']);
    });
  });

  describe('Loading State', () => {
    it.each([
      { isPending: true, expectedDisabled: true, description: 'disabled when loading' },
      { isPending: false, expectedDisabled: false, description: 'enabled when not loading' },
    ])('should be $description', ({ isPending, expectedDisabled }) => {
      mockUseDeleteSubscription.mockReturnValue({
        mutate: mockDeleteSubscription,
        isPending,
      } as unknown as ReturnType<typeof useDeleteSubscription>);

      render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

      const button = screen.getByTestId('delete-subscription');
      if (expectedDisabled) {
        expect(button).toBeDisabled();
      } else {
        expect(button).not.toBeDisabled();
      }
    });

    it.each([
      { isPending: true, expectedLoading: 'true' },
      { isPending: false, expectedLoading: 'false' },
    ])(
      'should have loading=$expectedLoading when isPending=$isPending',
      ({ isPending, expectedLoading }) => {
        mockUseDeleteSubscription.mockReturnValue({
          mutate: mockDeleteSubscription,
          isPending,
        } as unknown as ReturnType<typeof useDeleteSubscription>);

        render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

        expect(screen.getByTestId('delete-subscription')).toHaveAttribute(
          'data-loading',
          expectedLoading,
        );
      },
    );
  });

  describe('Click Handler', () => {
    it.each([
      {
        description: 'default props',
        props: defaultProps,
        expectedPayload: {
          tenantId: 'tenant-123',
          resourceName: 'resource-456',
          subscriptionId: 'subscription-123',
        },
      },
      {
        description: 'different tenant and resource',
        props: {
          tenantId: 'tenant-abc',
          resourceName: 'resource-xyz',
          subscription: createMockSubscription({ id: 'sub-999' }),
        },
        expectedPayload: {
          tenantId: 'tenant-abc',
          resourceName: 'resource-xyz',
          subscriptionId: 'sub-999',
        },
      },
      {
        description: 'another combination',
        props: {
          tenantId: 'my-tenant',
          resourceName: 'my-resource',
          subscription: createMockSubscription({ id: 'my-subscription' }),
        },
        expectedPayload: {
          tenantId: 'my-tenant',
          resourceName: 'my-resource',
          subscriptionId: 'my-subscription',
        },
      },
    ])(
      'should call deleteSubscription with correct payload for $description',
      ({ props, expectedPayload }) => {
        render(<UnsubscribeLink {...props} />, { wrapper: createWrapper() });

        fireEvent.click(screen.getByTestId('delete-subscription'));

        expect(mockDeleteSubscription).toHaveBeenCalledTimes(1);
        expect(mockDeleteSubscription).toHaveBeenCalledWith(expectedPayload);
      },
    );
  });

  describe('Mutation Callbacks', () => {
    it('should call addSuccess on mutation success', async () => {
      let capturedOnSuccess: (() => void) | undefined;

      mockUseDeleteSubscription.mockImplementation((options) => {
        capturedOnSuccess = options?.onSuccess as () => void;
        return {
          mutate: mockDeleteSubscription,
          isPending: false,
        } as unknown as ReturnType<typeof useDeleteSubscription>;
      });

      render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

      // Simulate success callback
      capturedOnSuccess?.();

      await waitFor(() => {
        expect(mockAddSuccess).toHaveBeenCalledWith(
          'tenants:dashboard.subscription_listing.unsubscribe.success',
        );
      });
    });

    it.each([
      {
        description: 'error with message property',
        error: { message: 'Network error' },
      },
      {
        description: 'error with different message',
        error: { message: 'Unauthorized access' },
      },
    ])('should call addError on mutation error with $description', async ({ error }) => {
      let capturedOnError: ((err: Error) => void) | undefined;

      mockUseDeleteSubscription.mockImplementation((options) => {
        capturedOnError = options?.onError as ((err: Error) => void) | undefined;
        return {
          mutate: mockDeleteSubscription,
          isPending: false,
        } as unknown as ReturnType<typeof useDeleteSubscription>;
      });

      render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

      // Simulate error callback
      capturedOnError?.(error as Error);

      await waitFor(() => {
        expect(mockAddError).toHaveBeenCalledWith(expect.stringContaining('error_message'));
      });
    });
  });

  describe('Hook Integration', () => {
    it('should call useDeleteSubscription on mount', () => {
      render(<UnsubscribeLink {...defaultProps} />, { wrapper: createWrapper() });

      expect(mockUseDeleteSubscription).toHaveBeenCalledTimes(1);
      expect(mockUseDeleteSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          onSuccess: expect.any(Function) as unknown,
          onError: expect.any(Function) as unknown,
        }),
      );
    });
  });
});

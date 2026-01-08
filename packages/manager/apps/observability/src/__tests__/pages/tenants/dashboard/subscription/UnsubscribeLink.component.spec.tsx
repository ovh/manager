import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UnsubscribeLink from '@/pages/tenants/dashboard/subscription/UnsubscribeLink.component';
import { UnsubscribeLinkProps } from '@/pages/tenants/dashboard/subscription/UnsubscribeLink.props';
import { TenantSubscriptionListing } from '@/types/tenants.type';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockGetDeleteTenantSubscriptionUrl = vi.fn(
  (params: { tenantId: string; resourceName: string; subscriptionId: string }) =>
    `/metrics/tenants/${params.resourceName}/${params.tenantId}/subscription/delete/${params.subscriptionId}`,
);

vi.mock('@/routes/Routes.utils', () => ({
  getDeleteTenantSubscriptionUrl: (params: {
    tenantId: string;
    resourceName: string;
    subscriptionId: string;
  }) => mockGetDeleteTenantSubscriptionUrl(params),
}));

vi.mock('@ovh-ux/muk', () => ({
  BUTTON_VARIANT: {
    ghost: 'ghost',
    default: 'default',
  },
  Button: ({
    id,
    onClick,
    variant,
    children,
  }: {
    id: string;
    onClick: () => void;
    variant: string;
    children: React.ReactNode;
  }) => (
    <button data-testid={id} onClick={onClick} data-variant={variant} type="button">
      {children}
    </button>
  ),
}));

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
  });

  describe('Rendering', () => {
    it('should render button with correct id', () => {
      render(<UnsubscribeLink {...defaultProps} />);

      expect(screen.getByTestId('delete-subscription')).toBeInTheDocument();
    });

    it('should render button with ghost variant', () => {
      render(<UnsubscribeLink {...defaultProps} />);

      expect(screen.getByTestId('delete-subscription')).toHaveAttribute('data-variant', 'ghost');
    });

    it('should render translated unsubscribe cta', () => {
      render(<UnsubscribeLink {...defaultProps} />);

      expect(
        screen.getByText('tenants:dashboard.subscription_listing.unsubscribe.cta'),
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to delete subscription URL when clicked', () => {
      render(<UnsubscribeLink {...defaultProps} />);

      fireEvent.click(screen.getByTestId('delete-subscription'));

      expect(mockGetDeleteTenantSubscriptionUrl).toHaveBeenCalledWith({
        tenantId: 'tenant-123',
        resourceName: 'resource-456',
        subscriptionId: 'subscription-123',
      });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        '/metrics/tenants/resource-456/tenant-123/subscription/delete/subscription-123',
      );
    });

    it('should navigate with correct params for different subscription', () => {
      const props = {
        tenantId: 'tenant-abc',
        resourceName: 'resource-xyz',
        subscription: createMockSubscription({ id: 'sub-999' }),
      };

      render(<UnsubscribeLink {...props} />);

      fireEvent.click(screen.getByTestId('delete-subscription'));

      expect(mockGetDeleteTenantSubscriptionUrl).toHaveBeenCalledWith({
        tenantId: 'tenant-abc',
        resourceName: 'resource-xyz',
        subscriptionId: 'sub-999',
      });
      expect(mockNavigate).toHaveBeenCalledWith(
        '/metrics/tenants/resource-xyz/tenant-abc/subscription/delete/sub-999',
      );
    });

    it('should handle multiple clicks', () => {
      render(<UnsubscribeLink {...defaultProps} />);

      const button = screen.getByTestId('delete-subscription');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledTimes(3);
    });
  });
});

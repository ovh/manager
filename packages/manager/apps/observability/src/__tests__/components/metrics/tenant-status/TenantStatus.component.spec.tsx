import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TenantStatus } from '@/components/metrics/tenant-status/TenantStatus.component';
import { TenantResourceStatus } from '@/types/tenants.type';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  Badge: ({ children, color }: { children: React.ReactNode; color: string }) => (
    <span data-testid="badge" data-color={color}>
      {children}
    </span>
  ),
  BADGE_COLOR: {
    success: 'success',
    critical: 'critical',
    warning: 'warning',
    neutral: 'neutral',
  },
}));

describe('TenantStatus.component', () => {
  it.each([
    { status: 'READY' as TenantResourceStatus, expectedColor: 'success' },
    { status: 'ERROR' as TenantResourceStatus, expectedColor: 'critical' },
    { status: 'UPDATING' as TenantResourceStatus, expectedColor: 'warning' },
    { status: 'DELETING' as TenantResourceStatus, expectedColor: 'warning' },
    { status: 'SUSPENDED' as TenantResourceStatus, expectedColor: 'warning' },
    { status: 'CREATING' as TenantResourceStatus, expectedColor: 'warning' },
    { status: 'UNKNOWN' as TenantResourceStatus, expectedColor: 'neutral' },
  ])('renders $status status with $expectedColor color', ({ status, expectedColor }) => {
    render(<TenantStatus status={status} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-color', expectedColor);
    expect(badge).toHaveTextContent(`tenants:status.${status}`);
  });
});

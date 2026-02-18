import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ResourceBadgeStatus } from '@/components/services/status/ResourceBadgeStatus.component';
import { ResourceStatus } from '@/types/resource.type';

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
    information: 'information',
    critical: 'critical',
    warning: 'warning',
    neutral: 'neutral',
  },
}));

describe('ResourceBadgeStatus.component', () => {
  it.each([
    { status: 'READY' as ResourceStatus, expectedColor: 'success' },
    { status: 'ERROR' as ResourceStatus, expectedColor: 'warning' },
    { status: 'UPDATING' as ResourceStatus, expectedColor: 'information' },
    { status: 'DELETING' as ResourceStatus, expectedColor: 'information' },
    { status: 'SUSPENDED' as ResourceStatus, expectedColor: 'critical' },
    { status: 'CREATING' as ResourceStatus, expectedColor: 'information' },
    { status: 'UNKNOWN' as ResourceStatus, expectedColor: 'neutral' },
    { status: undefined, expectedColor: 'neutral' },
  ])('renders $status status with $expectedColor color', ({ status, expectedColor }) => {
    render(<ResourceBadgeStatus status={status} />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-color', expectedColor);
    expect(badge).toHaveTextContent(`services:status.${status ?? 'UNKNOWN'}`);
  });
});

import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { VrackSegmentResourceStatus } from '@ovh-ux/manager-module-vcd-api';
import {
  getVrackSegmentColorFromResourceStatus,
  VrackSegmentStatusBadge,
} from './VrackSegmentStatusBadge.component';

describe('getVrackSegmentColorFromResourceStatus function', () => {
  it.each([
    ['CREATING', 'information'],
    ['DELETING', 'information'],
    ['ERROR', 'critical'],
    ['READY', 'success'],
    ['SUSPENDED', 'warning'],
    ['UPDATING', 'information'],
  ] as const)(
    'encodes "%s" to "%s"',
    (input: VrackSegmentResourceStatus, expected: OdsBadgeColor) => {
      expect(getVrackSegmentColorFromResourceStatus(input)).toBe(expected);
    },
  );
});

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsBadge: ({ color, label }: { color: string; label: string }) => (
    <div role="status" data-color={color} aria-label={label} />
  ),
}));

// Mock useTranslation
vi.mock('react-i18next', async () => {
  return {
    useTranslation: () => ({
      t: (key: string) => `__${key}__`,
    }),
  };
});

describe('VrackSegmentStatusBadge', () => {
  it.each([
    ['CREATING', 'information'],
    ['DELETING', 'information'],
    ['ERROR', 'critical'],
    ['READY', 'success'],
    ['SUSPENDED', 'warning'],
    ['UPDATING', 'information'],
  ] as const)('renders correctly for %s', (status, expectedColor) => {
    render(<VrackSegmentStatusBadge resourceStatus={status} />);

    const badge = screen.getByRole('status', {
      name: `__managed_vcd_dashboard_vrack_status_${status.toLowerCase()}__`,
    });
    expect(badge).toHaveAttribute('data-color', expectedColor);
  });
});

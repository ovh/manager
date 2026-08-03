import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { LicenseApiValue } from '@/types/Order.type';

import LicenseTypeCell from './LicenseTypeCell.component';

describe('LicenseTypeCell', () => {
  it('shows the transition while an operation is in flight and the requested license differs', async () => {
    await renderWithProviders(
      <LicenseTypeCell
        licenseType={LicenseApiValue.VDP_PREMIUM}
        licenseTypeRequested={LicenseApiValue.VDP_ADVANCED}
        isInFlight
      />,
    );

    expect(screen.getByText('Premium → Advanced')).toBeInTheDocument();
  });

  it('shows the effective license alone when no operation is in flight, even if the requested one differs', async () => {
    await renderWithProviders(
      <LicenseTypeCell
        licenseType={LicenseApiValue.VDP_PREMIUM}
        licenseTypeRequested={LicenseApiValue.VDP_ADVANCED}
        isInFlight={false}
      />,
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows the effective license alone when the requested one is identical', async () => {
    await renderWithProviders(
      <LicenseTypeCell
        licenseType={LicenseApiValue.VDP_PREMIUM}
        licenseTypeRequested={LicenseApiValue.VDP_PREMIUM}
        isInFlight
      />,
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows the effective license alone when no requested license is returned', async () => {
    await renderWithProviders(
      <LicenseTypeCell licenseType={LicenseApiValue.VDP_PREMIUM} isInFlight />,
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('falls back to the raw API value for an unknown license type', async () => {
    await renderWithProviders(
      <LicenseTypeCell licenseType="VEEAM_DATA_PLATFORM_ULTIMATE" isInFlight={false} />,
    );

    expect(screen.getByText('VEEAM_DATA_PLATFORM_ULTIMATE')).toBeInTheDocument();
  });
});

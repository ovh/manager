import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import BillingPeriodNotice from './BillingPeriodNotice.component';

describe('BillingPeriodNotice', () => {
  it('renders the period notice with the dates formatted and in bold', async () => {
    const { container } = await renderWithProviders(
      <BillingPeriodNotice beginDate="2026-07-01T12:00:00Z" endDate="2026-07-31T12:00:00Z" />,
    );

    expect(container).toHaveTextContent(
      'Consommation de la période de facturation en cours, du 01/07/2026 au 31/07/2026.',
    );
    const strongs = container.querySelectorAll('strong');
    expect(strongs).toHaveLength(2);
    expect(strongs[0]).toHaveTextContent('01/07/2026');
    expect(strongs[1]).toHaveTextContent('31/07/2026');
  });

  it('renders the fallback notice when a date is missing', async () => {
    await renderWithProviders(<BillingPeriodNotice beginDate={null} endDate={null} />);

    expect(
      screen.getByText('Consommation de la période de facturation en cours.'),
    ).toBeInTheDocument();
  });
});

import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getBackupServicesCatalog } from '@/data/api/catalog/catalog.requests';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { OrderCatalog } from '@/types/Catalog.type';

import OnboardingPricingHighlight from './OnboardingPricingHighlight.component';

vi.mock('@/data/api/catalog/catalog.requests');

const mockedGetBackupServicesCatalog = vi.mocked(getBackupServicesCatalog);

const catalog: OrderCatalog = {
  locale: { currencyCode: 'EUR', taxRate: 0.2 },
  plans: [
    {
      planCode: 'vspc-backuplicenses-enterpriseplus-vm',
      pricings: [
        {
          mode: 'default',
          commitment: 0,
          intervalUnit: 'none',
          interval: 0,
          price: 999_000_000,
          tax: 199_800_000,
        },
      ],
    },
    {
      planCode: 'vspc-backuplicenses-foundation-vm',
      pricings: [
        {
          mode: 'default',
          commitment: 0,
          intervalUnit: 'none',
          interval: 0,
          price: 1_500_000_000,
          tax: 300_000_000,
        },
      ],
    },
  ],
};

const renderOnboardingPricingHighlight = async () => {
  const wrapper = await testWrapperBuilder()
    .withQueryClient()
    .withShellContext()
    .withI18next()
    .build();
  return render(<OnboardingPricingHighlight />, { wrapper });
};

describe('OnboardingPricingHighlight', () => {
  it('shows a loading state while the catalogue resolves', async () => {
    mockedGetBackupServicesCatalog.mockReturnValue(new Promise(() => {}));

    const { container } = await renderOnboardingPricingHighlight();

    expect(container.querySelector('ods-skeleton')).toBeInTheDocument();
  });

  it('displays the price of the cheapest of the two step ① licenses', async () => {
    mockedGetBackupServicesCatalog.mockResolvedValue(catalog);

    const { container } = await renderOnboardingPricingHighlight();

    // `i18ntest.utils.ts` fusionne les ressources via `addResourceBundle`, donc les clés
    // `highlights.pricing_prefix`/`_suffix` sont bien traduites ici : on vérifie le texte réel.
    // Le prix affiché doit être celui du plan le moins cher (999_000_000, Enterprise Plus),
    // pas celui de Foundation (1_500_000_000).
    await waitFor(() => expect(container.textContent).toContain('À partir de'));
    expect(container.textContent).toContain('9,99');
    expect(container.textContent).not.toContain('15,00');
    expect(mockedGetBackupServicesCatalog).toHaveBeenCalledWith(expect.any(String));
  });

  it('renders nothing when neither license plan is in the catalogue', async () => {
    mockedGetBackupServicesCatalog.mockResolvedValue({ ...catalog, plans: [] });

    const { container } = await renderOnboardingPricingHighlight();

    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});

import { describe, expect, it } from 'vitest';

import { OrderCatalog } from '@/types/Catalog.type';

import { getDefaultPricing, getLowestPricing } from './planPricing';

/** Forme réelle observée sur `vspc-backuplicenses-advanced-vm` (2026-08-03) : en
 * `pricingType: 'consumption'`, donc `intervalUnit: 'none'` / `interval: 0`. Les licences sont
 * publiées sous `addons`, jamais sous `plans` — `plans` ne porte que `backup-tenant`. */
const catalog: OrderCatalog = {
  locale: { currencyCode: 'EUR', taxRate: 0.2 },
  plans: [{ planCode: 'backup-tenant', pricings: [] }],
  addons: [
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
        // Engagement 12 mois : ne doit pas être pris pour le prix catalogue par défaut.
        {
          mode: 'default',
          commitment: 12,
          intervalUnit: 'none',
          interval: 0,
          price: 1_200_000_000,
          tax: 240_000_000,
        },
      ],
    },
  ],
};

describe('getDefaultPricing', () => {
  it('trouve le prix catalogue par défaut du plan demandé', () => {
    expect(getDefaultPricing(catalog, 'vspc-backuplicenses-foundation-vm')).toEqual({
      mode: 'default',
      commitment: 0,
      intervalUnit: 'none',
      interval: 0,
      price: 1_500_000_000,
      tax: 300_000_000,
    });
  });

  it("renvoie undefined si le plan n'existe pas dans le catalogue", () => {
    expect(getDefaultPricing(catalog, 'unknown-plan-code')).toBeUndefined();
  });

  it('renvoie undefined si le catalogue est encore en chargement', () => {
    expect(getDefaultPricing(undefined, 'vspc-backuplicenses-foundation-vm')).toBeUndefined();
  });
});

describe('getLowestPricing', () => {
  const twoPlansCatalog: OrderCatalog = {
    ...catalog,
    addons: [
      ...catalog.addons,
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
    ],
  };

  it('renvoie le prix le plus bas parmi les plans demandés', () => {
    expect(
      getLowestPricing(twoPlansCatalog, [
        'vspc-backuplicenses-foundation-vm',
        'vspc-backuplicenses-enterpriseplus-vm',
      ]),
    ).toEqual({
      mode: 'default',
      commitment: 0,
      intervalUnit: 'none',
      interval: 0,
      price: 999_000_000,
      tax: 199_800_000,
    });
  });

  it("ignore les plans absents du catalogue et ne renvoie pas d'erreur", () => {
    expect(
      getLowestPricing(twoPlansCatalog, ['unknown-plan-code', 'vspc-backuplicenses-foundation-vm']),
    ).toEqual(getDefaultPricing(twoPlansCatalog, 'vspc-backuplicenses-foundation-vm'));
  });

  it("renvoie undefined si aucun des plans demandés n'existe dans le catalogue", () => {
    expect(getLowestPricing(twoPlansCatalog, ['unknown-plan-code'])).toBeUndefined();
  });
});

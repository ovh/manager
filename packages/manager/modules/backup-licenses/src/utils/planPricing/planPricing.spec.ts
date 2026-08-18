import { describe, expect, it } from 'vitest';

import { OrderCatalog } from '@/types/Catalog.type';

import { formatCatalogPrice, getDefaultPricing, getLowestPricing } from './planPricing';

/** Forme réelle observée sur `vspc-backuplicenses-advanced-vm` (2026-08-03) : en
 * `pricingType: 'consumption'`, donc `intervalUnit: 'none'` / `interval: 0`. Les licences sont
 * publiées sous `addons`, jamais sous `plans` — `plans` ne porte que `backup-tenant`. */
const catalog: OrderCatalog = {
  locale: { currencyCode: 'EUR', taxRate: 0.2 },
  plans: [{ planCode: 'backup-tenant', pricings: [] }],
  addons: [
    {
      planCode: 'backup-vault-backuplicenses-500g-consumption',
      pricings: [
        {
          capacities: ['installation'],
          mode: 'default',
          commitment: 0,
          intervalUnit: 'none',
          interval: 0,
          price: 0,
          tax: 0,
        },
        {
          capacities: ['consumption'],
          mode: 'default',
          commitment: 0,
          intervalUnit: 'none',
          interval: 0,
          price: 700_000,
          tax: 140_000,
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

  it("écarte le frais de mise en service et rend le tarif à l'unité consommée", () => {
    expect(
      getDefaultPricing(catalog, 'backup-vault-backuplicenses-500g-consumption'),
    ).toMatchObject({ capacities: ['consumption'], price: 700_000 });
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

describe('formatCatalogPrice', () => {
  /**
   * 700 000 µcents = 0,007 € : c'est le tarif au Gio du vault. `formattedPrice` du catalogue rend
   * « 0.01 € » et le composant `Price` en fait autant — afficher ce montant demande de le formater
   * depuis la valeur brute.
   */
  it('garde un tarif sous le centime au lieu de l’arrondir à 0,01 €', () => {
    expect(formatCatalogPrice(700_000, 'EUR', 'fr_FR')).toMatch(/0,007/);
  });

  it('rend un prix courant à deux décimales, sans zéros superflus', () => {
    expect(formatCatalogPrice(1_298_999_936, 'EUR', 'fr_FR')).toMatch(/12,99/);
  });

  it('suit la locale demandée pour le séparateur décimal', () => {
    expect(formatCatalogPrice(700_000, 'EUR', 'en_GB')).toMatch(/0\.007/);
  });

  it('rend la devise que le catalogue annonce', () => {
    expect(formatCatalogPrice(1_298_999_936, 'CAD', 'fr_CA')).toMatch(/\$/);
  });
});

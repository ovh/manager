import { describe, expect, it } from 'vitest';

import type { TLoadBalancerCatalogDTO, TPricingDTO } from '../dto.type';
import { mapLoadBalancerCatalogDTOToEntity } from '../mapper';

const createPlanDTO = (planCode: string, product: string, pricings: TPricingDTO[]) => ({
  planCode,
  product,
  pricings,
});

describe('mapLoadBalancerCatalogDTOToEntity', () => {
  it('returns empty array when no addons', () => {
    const dto: TLoadBalancerCatalogDTO = { addons: [] };
    const result = mapLoadBalancerCatalogDTOToEntity(dto);
    expect(result).toEqual([]);
  });

  it('returns empty array when no octavia-loadbalancer addons', () => {
    const dto: TLoadBalancerCatalogDTO = {
      addons: [
        createPlanDTO('other-plan', 'other-product', [{ price: 1000, intervalUnit: 'hour' }]),
      ],
    };
    const result = mapLoadBalancerCatalogDTOToEntity(dto);
    expect(result).toEqual([]);
  });

  it('maps single octavia-loadbalancer addon to catalog array', () => {
    const dto: TLoadBalancerCatalogDTO = {
      addons: [
        createPlanDTO(
          'octavia-loadbalancer.loadbalancer-s.hour.consumption',
          'publiccloud-octavia-loadbalancer-loadbalancer-s',
          [
            { price: 830000, intervalUnit: 'none' },
            { price: 600000000, intervalUnit: 'month' },
          ],
        ),
      ],
    };
    const result = mapLoadBalancerCatalogDTOToEntity(dto);
    expect(result).toHaveLength(1);
    expect(result[0].planCode).toBe('octavia-loadbalancer.loadbalancer-s.hour.consumption');
    expect(result[0].product).toBe('publiccloud-octavia-loadbalancer-loadbalancer-s');
    expect(result[0].pricing).toHaveLength(2);
    expect(result[0].pricing[0]).toEqual({ priceInUcents: 830000, type: 'none' });
    expect(result[0].pricing[1]).toEqual({ priceInUcents: 600000000, type: 'month' });
  });

  it('maps multiple octavia-loadbalancer addons to catalog array', () => {
    const dto: TLoadBalancerCatalogDTO = {
      addons: [
        createPlanDTO(
          'octavia-loadbalancer.loadbalancer-s.hour.consumption',
          'publiccloud-octavia-loadbalancer-loadbalancer-s',
          [{ price: 830000, intervalUnit: 'none' }],
        ),
        createPlanDTO(
          'octavia-loadbalancer.loadbalancer-m.hour.consumption',
          'publiccloud-octavia-loadbalancer-loadbalancer-m',
          [{ price: 2080000, intervalUnit: 'none' }],
        ),
      ],
    };
    const result = mapLoadBalancerCatalogDTOToEntity(dto);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      planCode: 'octavia-loadbalancer.loadbalancer-s.hour.consumption',
      product: 'publiccloud-octavia-loadbalancer-loadbalancer-s',
      pricing: [{ priceInUcents: 830000, type: 'none' }],
    });
    expect(result[1]).toEqual({
      planCode: 'octavia-loadbalancer.loadbalancer-m.hour.consumption',
      product: 'publiccloud-octavia-loadbalancer-loadbalancer-m',
      pricing: [{ priceInUcents: 2080000, type: 'none' }],
    });
  });

  it('excludes addons that do not match octavia-loadbalancer', () => {
    const dto: TLoadBalancerCatalogDTO = {
      addons: [
        createPlanDTO('loadbalancer.other', 'other', [{ price: 1, intervalUnit: 'hour' }]),
        createPlanDTO(
          'octavia-loadbalancer.loadbalancer-s.hour.consumption',
          'publiccloud-octavia-loadbalancer-loadbalancer-s',
          [{ price: 100, intervalUnit: 'hour' }],
        ),
      ],
    };
    const result = mapLoadBalancerCatalogDTOToEntity(dto);
    expect(result).toHaveLength(1);
    expect(result[0].pricing).toHaveLength(1);
    expect(result[0].pricing[0].priceInUcents).toBe(100);
  });
});

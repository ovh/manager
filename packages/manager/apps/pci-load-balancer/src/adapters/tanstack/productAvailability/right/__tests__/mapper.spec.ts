import { describe, expect, it } from 'vitest';

import type { TProductAvailabilityDTO } from '../dto.type';
import { mapProductAvailabilityDTOToEntity } from '../mapper';

describe('mapLoadBalancerAvailabilityRegionsDTOToEntity', () => {
  it('returns empty array when no plans', () => {
    const dto: TProductAvailabilityDTO = { plans: [] };
    const result = mapProductAvailabilityDTOToEntity(dto);
    expect(result).toEqual([]);
  });

  it('returns empty array when no octavia-loadbalancer plans', () => {
    const dto: TProductAvailabilityDTO = {
      plans: [
        {
          code: 'other-plan',
          regions: [{ name: 'GRA5' }],
        },
      ],
    };
    const result = mapProductAvailabilityDTOToEntity(dto);
    expect(result).toEqual([]);
  });

  it('maps single octavia-loadbalancer plan to entity with full plan code and regions', () => {
    const planCode = 'octavia-loadbalancer.loadbalancer-l.hour.consumption';
    const dto: TProductAvailabilityDTO = {
      plans: [
        {
          code: planCode,
          regions: [{ name: 'GRA5' }, { name: 'BHS5' }],
        },
      ],
    };
    const result = mapProductAvailabilityDTOToEntity(dto);
    expect(result).toHaveLength(1);
    expect(result[0].planCode).toBe(planCode);
    expect(result[0].regions).toEqual(['GRA5', 'BHS5']);
  });

  it('returns one entity per octavia-loadbalancer plan with respective regions', () => {
    const dto: TProductAvailabilityDTO = {
      plans: [
        {
          code: 'octavia-loadbalancer.loadbalancer-s.hour.consumption',
          regions: [{ name: 'GRA5' }, { name: 'BHS5' }],
        },
        {
          code: 'octavia-loadbalancer.loadbalancer-m.hour.consumption',
          regions: [{ name: 'GRA5' }, { name: 'SBG5' }],
        },
      ],
    };
    const result = mapProductAvailabilityDTOToEntity(dto);
    expect(result).toHaveLength(2);
    expect(result[0].planCode).toBe('octavia-loadbalancer.loadbalancer-s.hour.consumption');
    expect(result[0].regions).toEqual(['GRA5', 'BHS5']);
    expect(result[1].planCode).toBe('octavia-loadbalancer.loadbalancer-m.hour.consumption');
    expect(result[1].regions).toEqual(['GRA5', 'SBG5']);
  });

  it('excludes plans that do not match octavia-loadbalancer', () => {
    const dto: TProductAvailabilityDTO = {
      plans: [
        {
          code: 'loadbalancer.other',
          regions: [{ name: 'OTHER-REGION' }],
        },
        {
          code: 'octavia-loadbalancer.loadbalancer-s.hour.consumption',
          regions: [{ name: 'GRA5' }],
        },
      ],
    };
    const result = mapProductAvailabilityDTOToEntity(dto);
    expect(result).toHaveLength(1);
    expect(result[0].planCode).toBe('octavia-loadbalancer.loadbalancer-s.hour.consumption');
    expect(result[0].regions).toEqual(['GRA5']);
  });
});

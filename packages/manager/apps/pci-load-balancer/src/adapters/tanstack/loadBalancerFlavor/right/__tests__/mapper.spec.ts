import { describe, expect, it } from 'vitest';

import type { TLoadBalancerFlavorDTO } from '../dto.type';
import { mapLoadBalancerFlavorsDTOToEntity } from '../mapper';

const createFlavorDTO = (id: string, name: string, region: string): TLoadBalancerFlavorDTO => ({
  id,
  name,
  region,
});

describe('mapLoadBalancerFlavorsDTOToEntity', () => {
  it('returns empty array when given empty array', () => {
    const result = mapLoadBalancerFlavorsDTOToEntity([]);
    expect(result).toEqual([]);
  });

  it('maps single item to entity array', () => {
    const dtos = [createFlavorDTO('id-1', 'small', 'BHS5')];
    const result = mapLoadBalancerFlavorsDTOToEntity(dtos);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 'id-1', name: 'small', region: 'BHS5' });
  });

  it('maps multiple items to entity array', () => {
    const dtos = [
      createFlavorDTO('id-1', 'small', 'BHS5'),
      createFlavorDTO('id-2', 'large', 'BHS5'),
      createFlavorDTO('id-3', 'medium', 'BHS5'),
    ];
    const result = mapLoadBalancerFlavorsDTOToEntity(dtos);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ id: 'id-1', name: 'small', region: 'BHS5' });
    expect(result[1]).toEqual({ id: 'id-2', name: 'large', region: 'BHS5' });
    expect(result[2]).toEqual({ id: 'id-3', name: 'medium', region: 'BHS5' });
  });
});

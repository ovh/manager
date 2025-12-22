import { describe, it, expect } from 'vitest';
import { getRegionFlag } from './flagHelper';

describe('getRegionFlag', () => {
  it('should return "ca" for BHS and TOR', () => {
    expect(getRegionFlag('BHS')).toBe('ca');
    expect(getRegionFlag('TOR')).toBe('ca');
  });

  it('should return "fr" for EU-WEST-PAR, GRA, SBG, PAR, RBX', () => {
    expect(getRegionFlag('EU-WEST-PAR')).toBe('fr');
    expect(getRegionFlag('GRA')).toBe('fr');
    expect(getRegionFlag('SBG')).toBe('fr');
    expect(getRegionFlag('PAR')).toBe('fr');
    expect(getRegionFlag('RBX')).toBe('fr');
  });

  it('should return "pl" for WAW', () => {
    expect(getRegionFlag('WAW')).toBe('pl');
  });

  it('should return "de" for DE', () => {
    expect(getRegionFlag('DE')).toBe('de');
  });

  it('should return "sg" for SGP', () => {
    expect(getRegionFlag('SGP')).toBe('sg');
  });

  it('should return "gb" for UK', () => {
    expect(getRegionFlag('UK')).toBe('gb');
  });

  it('should return "us" for US-EAST-VA and US-WEST-OR', () => {
    expect(getRegionFlag('US-EAST-VA')).toBe('us');
    expect(getRegionFlag('US-WEST-OR')).toBe('us');
  });

  it('should return undefined for unknown region', () => {
    expect(getRegionFlag('UNKNOWN')).toBeUndefined();
    expect(getRegionFlag('')).toBeUndefined();
    expect(getRegionFlag('123')).toBeUndefined();
  });
});

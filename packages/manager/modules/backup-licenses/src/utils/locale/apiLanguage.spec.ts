import { describe, expect, it } from 'vitest';

import { toApiLanguage } from './apiLanguage';

describe('toApiLanguage', () => {
  it('accepte une locale manager supportée', () => {
    expect(toApiLanguage('fr_FR')).toBe('fr_FR');
    expect(toApiLanguage('pt_PT')).toBe('pt_PT');
  });

  it('normalise le séparateur BCP 47', () => {
    expect(toApiLanguage('en-GB')).toBe('en_GB');
  });

  it("retourne undefined quand la locale n'est pas acceptée par l'API", () => {
    expect(toApiLanguage('fr')).toBeUndefined();
    expect(toApiLanguage('zz_ZZ')).toBeUndefined();
    expect(toApiLanguage(undefined)).toBeUndefined();
  });
});

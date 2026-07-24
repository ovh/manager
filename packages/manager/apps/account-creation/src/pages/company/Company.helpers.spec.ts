import { describe, expect, it } from 'vitest';
import { getLegalFormFromCode } from './Company.helpers';

describe('getLegalFormFromCode', () => {
  it.each(['1000', '2110', '3120', '5499', '6540'])(
    'maps %s (1/2/3/5/6.*) to corporation (B2B)',
    (code) => {
      expect(getLegalFormFromCode(code)).toBe('corporation');
    },
  );

  it.each(['9210', '9999'])('maps %s (9.*) to association', (code) => {
    expect(getLegalFormFromCode(code)).toBe('association');
  });

  it.each(['4110', '4000', '7150', '7389', '8110'])(
    'maps %s (4.* / 7.* / 8110) to administration (B2G)',
    (code) => {
      expect(getLegalFormFromCode(code)).toBe('administration');
    },
  );

  it('only treats 8110 as administration among 8xxx codes', () => {
    expect(getLegalFormFromCode('8130')).toBe('corporation');
  });
});

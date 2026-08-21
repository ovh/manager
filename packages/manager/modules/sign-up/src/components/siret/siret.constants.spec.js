import { describe, expect, it } from 'vitest';

import {
  byLegalForm,
  calculateFRVATNumber,
  fromSuggestion,
  getCompanyNameLabelKey,
  getLegalFormFromCode,
  getModalReviewIntroKey,
  getUpdateSearchAssistantLabelKey,
  hasMissingValues,
  isMissingValue,
  isNdValue,
  SIRET_SEARCH_REGEXP,
} from './siret.constants';

describe('isNdValue', () => {
  it.each([['[ND]'], ['[nd]'], ['[ND] [ND]'], ['  [ND]  ']])(
    'detects the withheld token %p',
    (value) => {
      expect(isNdValue(value)).toBe(true);
    },
  );

  it.each([[''], [null], [undefined]])('is false for %p', (value) => {
    // an empty value is not a [ND] token: that distinction is why isMissingValue
    // exists, and why empty values used to go unnoticed
    expect(isNdValue(value)).toBe(false);
  });

  it('is false for a real value', () => {
    expect(isNdValue('COURRIERES')).toBe(false);
  });
});

describe('fromSuggestion', () => {
  it('blanks a withheld value instead of falling back', () => {
    expect(fromSuggestion('[ND]', 'previous')).toBe('');
  });

  it('keeps a real value', () => {
    expect(fromSuggestion('COURRIERES', 'previous')).toBe('COURRIERES');
  });

  it('falls back on the previous value when asked to', () => {
    expect(fromSuggestion('', 'previous')).toBe('previous');
  });

  it('blanks an empty value when no fallback is given', () => {
    expect(fromSuggestion('', '')).toBe('');
  });
});

describe('isMissingValue', () => {
  // both shapes the directory answers with, per provider
  it.each([
    ['[ND]', 'withheld token'],
    ['[nd]', 'lowercase token'],
    ['[ND] [ND]', 'repeated token'],
    ['', 'empty string'],
    [null, 'null'],
    [undefined, 'absent'],
    ['   ', 'blanks only'],
  ])('treats %p (%s) as missing', (value) => {
    expect(isMissingValue(value)).toBe(true);
  });

  it.each([['COURRIERES'], ['12 rue de la Paix'], ['62710']])(
    'treats %p as present',
    (value) => {
      expect(isMissingValue(value)).toBe(false);
    },
  );
});

describe('hasMissingValues', () => {
  const complete = {
    name: 'OVH',
    address: '2 rue Kellermann',
    zipCode: '59100',
    city: 'ROUBAIX',
  };

  it('is false when the directory returned everything', () => {
    expect(hasMissingValues(complete)).toBe(false);
  });

  it.each(['name', 'address', 'zipCode', 'city'])(
    'is true when %s alone is empty',
    (key) => {
      expect(hasMissingValues({ ...complete, [key]: '' })).toBe(true);
    },
  );

  it.each(['name', 'address', 'zipCode', 'city'])(
    'is true when %s alone is withheld',
    (key) => {
      expect(hasMissingValues({ ...complete, [key]: '[ND]' })).toBe(true);
    },
  );

  it('is true on the real payload of a non-disclosed company', () => {
    // verbatim from GET /me/suggest/company, provider DATA_GOUV_RECHERCHE_ENTREPRISES
    expect(
      hasMissingValues({
        address: '',
        area: '32',
        city: 'COURRIERES',
        legalFormCode: '1000',
        name: '',
        primaryCNIN: '984715045',
        secondaryCNIN: '98471504500014',
        vatID: 'FR59984715045',
        zipCode: '',
      }),
    ).toBe(true);
  });

  it('does not blow up without a suggestion', () => {
    expect(hasMissingValues(undefined)).toBe(true);
  });

  it('ignores values the assistant does not fill', () => {
    // area and creationDate are never written to the form
    expect(hasMissingValues({ ...complete, area: '', creationDate: '' })).toBe(
      false,
    );
  });
});

describe('byLegalForm', () => {
  it.each([
    ['corporation', 'base_corporation'],
    ['association', 'base_association'],
    ['administration', 'base_administration'],
  ])('suffixes the key for %s', (legalForm, expected) => {
    expect(byLegalForm('base', legalForm)).toBe(expected);
  });

  it.each([['individual'], [undefined], [null], ['']])(
    'keeps the base key for %p',
    (legalForm) => {
      expect(byLegalForm('base', legalForm)).toBe('base');
    },
  );
});

describe('legal-form aware label keys', () => {
  it('names the company after its legal form', () => {
    expect(getCompanyNameLabelKey('association')).toBe(
      'siret_manual_company_name_association',
    );
    expect(getCompanyNameLabelKey('individual')).toBe(
      'siret_manual_company_name',
    );
  });

  it('adapts the update button label', () => {
    expect(getUpdateSearchAssistantLabelKey('administration')).toBe(
      'siret_update_search_assistant_administration',
    );
  });

  it('adapts the modal review intro', () => {
    expect(getModalReviewIntroKey('corporation')).toBe(
      'siret_modal_review_intro_corporation',
    );
    expect(getModalReviewIntroKey(undefined)).toBe('siret_modal_review_intro');
  });
});

describe('getLegalFormFromCode', () => {
  it.each([
    ['9220', 'association'],
    ['4110', 'administration'],
    ['7220', 'administration'],
    ['8110', 'administration'],
    ['1000', 'corporation'],
    ['5710', 'corporation'],
  ])('maps INSEE code %s to %s', (code, expected) => {
    expect(getLegalFormFromCode(code)).toBe(expected);
  });

  it('returns null without a code', () => {
    expect(getLegalFormFromCode(undefined)).toBeNull();
  });
});

describe('calculateFRVATNumber', () => {
  it('computes the VAT number from a 9-digit SIREN', () => {
    // key = (12 + 3 * (siren % 97)) % 97
    expect(calculateFRVATNumber('984715045')).toBe('FR59984715045');
  });

  it.each([['12345678'], ['1234567890'], ['abcdefghi'], [''], [undefined]])(
    'refuses %p',
    (siren) => {
      expect(calculateFRVATNumber(siren)).toBeNull();
    },
  );
});

describe('SIRET_SEARCH_REGEXP', () => {
  it('accepts 14 digits, spaced or not', () => {
    expect(SIRET_SEARCH_REGEXP.test('98471504500014')).toBe(true);
    expect(SIRET_SEARCH_REGEXP.test('984 715 045 00014')).toBe(true);
  });

  it.each([['9847150450001'], ['984715045000145'], ['9847150450001A'], ['']])(
    'rejects %p',
    (value) => {
      expect(SIRET_SEARCH_REGEXP.test(value)).toBe(false);
    },
  );
});

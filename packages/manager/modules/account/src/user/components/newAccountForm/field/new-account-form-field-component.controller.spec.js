import { describe, expect, it } from 'vitest';

import NewAccountFormFieldController from './new-account-form-field-component.controller';

// Only getTranslatedEnums is exercised: $filter('orderBy') returns the list as
// is, $translate echoes the key.
const build = ({ fieldName = 'legalform', values, savedLegalform }) => {
  const ctrl = new NewAccountFormFieldController(
    () => (list) => list,
    {},
    {},
    (fn) => fn(),
    { instant: (key) => key },
    {},
    { getUser: () => ({}) },
  );
  ctrl.rule = { fieldName, in: values };
  ctrl.newAccountForm = {
    model: {},
    originalModel: { legalform: savedLegalform },
  };
  return ctrl;
};

const keys = (ctrl) => ctrl.getTranslatedEnums().map(({ key }) => key);

const LEGALFORMS = [
  'administration',
  'association',
  'corporation',
  'individual',
  'other',
];

describe('the account category list', () => {
  it('no longer offers "Autre"', () => {
    expect(
      keys(build({ values: LEGALFORMS, savedLegalform: 'corporation' })),
    ).toEqual(['administration', 'association', 'corporation', 'individual']);
  });

  it('keeps "Autre" for an account that still holds it', () => {
    expect(
      keys(build({ values: LEGALFORMS, savedLegalform: 'other' })),
    ).toContain('other');
  });

  it('leaves the other lists untouched', () => {
    expect(
      keys(build({ fieldName: 'sex', values: ['female', 'other'] })),
    ).toEqual(['female', 'other']);
  });
});

import { User } from '@ovh-ux/manager-config';
import {
  getOtherCategoryDescriptionKey,
  isUserCategoryOther,
} from './otherCategoryModal.helpers';

const buildUser = (overrides: Partial<User>): User =>
  ({ legalform: 'other', country: 'FR', ...overrides } as User);

describe('isUserCategoryOther', () => {
  it.each(['FR', 'DE', 'TR', 'CA', 'US'])(
    'returns true for a customer in %s whose category is "other"',
    (country) => {
      expect(
        isUserCategoryOther(buildUser({ country: country as User['country'] })),
      ).toBe(true);
    },
  );

  it('returns false when the category is not "other"', () => {
    expect(isUserCategoryOther(buildUser({ legalform: 'corporation' }))).toBe(
      false,
    );
  });
});

describe('getOtherCategoryDescriptionKey', () => {
  it.each(['FR', 'fr', 'GP', 'MQ', 'GF', 'RE', 'YT'])(
    'gives %s the e-invoicing reform wording',
    (country) => {
      expect(getOtherCategoryDescriptionKey(country)).toBe(
        'other_category_modal_description',
      );
    },
  );

  it.each(['DE', 'TR', 'CA', 'US', null, undefined])(
    'gives %s the generic wording',
    (country) => {
      expect(getOtherCategoryDescriptionKey(country)).toBe(
        'other_category_modal_description_generic',
      );
    },
  );
});

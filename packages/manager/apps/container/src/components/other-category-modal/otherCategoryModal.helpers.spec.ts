import { User } from '@ovh-ux/manager-config';
import {
  isFrenchAccount,
  isUserCategoryOther,
  OTHER_CATEGORY_DISMISSED_KEY,
  setOtherCategoryDismissed,
  shouldRemindOtherCategory,
} from './otherCategoryModal.helpers';

const buildUser = (overrides: Partial<User>): User =>
  ({ legalform: 'other', country: 'FR', ...overrides } as User);

describe('isUserCategoryOther', () => {
  it('returns true for a FR customer whose category is "other"', () => {
    expect(isUserCategoryOther(buildUser({}))).toBe(true);
  });

  it('returns false when the category is not "other"', () => {
    expect(isUserCategoryOther(buildUser({ legalform: 'corporation' }))).toBe(
      false,
    );
  });

  it.each(['TR', 'DE', 'US'])('returns true for a %s customer whose category is "other"', (country) => {
    expect(isUserCategoryOther(buildUser({ country } as Partial<User>))).toBe(true);
  });
});

describe('isFrenchAccount', () => {
  it('is true for France and its overseas territories, in any case', () => {
    ['FR', 'GP', 'MQ', 'RE', 'GF', 'YT', 'BL', 'PM'].forEach((country) =>
      expect(isFrenchAccount({ country } as User)).toBe(true),
    );
    expect(isFrenchAccount({ country: 'fr' } as unknown as User)).toBe(true);
  });

  it('is false for other countries and a missing user', () => {
    ['TR', 'DE'].forEach((country) =>
      expect(isFrenchAccount({ country } as User)).toBe(false),
    );
    expect(isFrenchAccount(undefined)).toBe(false);
  });
});

describe('shouldRemindOtherCategory', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('reminds an "Autre" account until it is dismissed in this session', () => {
    expect(shouldRemindOtherCategory(buildUser({ country: 'TR' }))).toBe(true);
    setOtherCategoryDismissed();
    expect(window.sessionStorage.getItem(OTHER_CATEGORY_DISMISSED_KEY)).toBe(
      'true',
    );
    expect(shouldRemindOtherCategory(buildUser({ country: 'TR' }))).toBe(false);
  });

  it('reminds a DE "Autre" account until it is dismissed', () => {
    expect(shouldRemindOtherCategory(buildUser({ country: 'DE' }))).toBe(true);
    setOtherCategoryDismissed();
    expect(shouldRemindOtherCategory(buildUser({ country: 'DE' }))).toBe(false);
  });

  it('does not remind an account that is not concerned', () => {
    expect(
      shouldRemindOtherCategory(buildUser({ legalform: 'corporation' })),
    ).toBe(false);
  });
});

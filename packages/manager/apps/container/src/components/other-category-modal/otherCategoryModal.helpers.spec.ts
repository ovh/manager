import { User } from '@ovh-ux/manager-config';
import {
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

  it('returns true for a TR customer whose category is "other" (F1)', () => {
    expect(isUserCategoryOther(buildUser({ country: 'TR' }))).toBe(true);
  });

  it('returns false when the customer is not in France', () => {
    expect(isUserCategoryOther(buildUser({ country: 'DE' }))).toBe(false);
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

  it('does not remind an account that is not concerned', () => {
    expect(
      shouldRemindOtherCategory(buildUser({ legalform: 'corporation' })),
    ).toBe(false);
  });
});

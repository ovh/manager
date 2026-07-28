import { User } from '@ovh-ux/manager-config';
import { isUserCategoryOther } from './otherCategoryModal.helpers';

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

  it('returns false when the customer is not in France', () => {
    expect(isUserCategoryOther(buildUser({ country: 'DE' }))).toBe(false);
  });
});

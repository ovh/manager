import { User } from '@ovh-ux/manager-config';
import { isUserConcernedBySuggestion, isSuggestionRelevant, isAssociationOrOther } from '@/helpers/suggestions/suggestionsHelper';
import { Suggestion } from '@/types/suggestion';

describe('suggestionsHelpers', () => {

  describe('isUserConcernedBySuggestion', () => {
    it('should consider user not concerned by suggestions if they are not a corporation association or other', () => {
      const user: Partial<User> = {
        legalform: 'individual',
        country: 'FR',
      };
      expect(isUserConcernedBySuggestion(user as User)).toEqual(false);
    });

    it('should consider user not concerned by suggestions if they are not on FR subsidiary', () => {
      const user: Partial<User> = {
        legalform: 'corporation',
        country: 'GB',
      };
      expect(isUserConcernedBySuggestion(user as User)).toEqual(false);
    });

    it('should consider user concerned by suggestions if their SIRET is not filled', () => {
      const user: Partial<User> = {
        legalform: 'corporation',
        country: 'FR',
        vat: '123456789',
      };
      expect(isUserConcernedBySuggestion(user as User)).toEqual(true);
    });

    it('should consider user concerned by suggestions if their VAT number is not filled', () => {
      const user: Partial<User> = {
        legalform: 'corporation',
        country: 'FR',
        companyNationalIdentificationNumber: '12345678901234',
      };
      expect(isUserConcernedBySuggestion(user as User)).toEqual(true);
    });
  });

  describe('isSuggestionRelevant', () => {
    it('should consider suggestion irrelevant if its type is not managed', () => {
      const suggestion: Suggestion = { type: 'DUNS', id: '11111', isActive: true };
      const user = { companyNationalIdentificationNumber: '11111' };
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(false);
   });

    it('should consider suggestion irrelevant if its value is the same as the user\'s', () => {
      const suggestion: Suggestion = { type: 'SIRET', id: '11111', isActive: true };
      const user = { companyNationalIdentificationNumber: '11111' };
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(false);
    });

    it('should consider suggestion relevant if user doesn\'t filled the data', () => {
      const suggestion: Suggestion = { type: 'SIRET', id: '11111', isActive: true };
      const user = {};
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(true);
    });

    it('should consider suggestion relevant if its value is not the same as the user\'s', () => {
      const suggestion: Suggestion = { type: 'SIRET', id: '11111', isActive: true };
      const user = { companyNationalIdentificationNumber: '11112' };
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(true);
    });
  });

  describe('isAssociationOrOther', () => {
    it('should return false if the legalform is not association or other', () => {
      expect(isAssociationOrOther('individual')).toEqual(false);
    });

    it('should return false if the legalform is "corporation"', () => {
      expect(isAssociationOrOther('corporation')).toEqual(false);
    });

    it('should return true if the legalform is "association"', () => {
      expect(isAssociationOrOther('association')).toEqual(true);
    });

    it('should return true if the legalform is "other"', () => {
      expect(isAssociationOrOther('other')).toEqual(true);
    });
  });
});

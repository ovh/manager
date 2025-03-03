import { User } from '@ovh-ux/manager-config';
import { isSuggestionRelevant } from '@/helpers/suggestions/suggestionsHelper';
import { Suggestion } from '@/types/suggestion';

describe('suggestionsHelpers', () => {
  describe('isSuggestionRelevant', () => {
    it('should consider suggestion irrelevant if its type is not managed', () => {
      const suggestion: Suggestion = { type: 'NIN', id: '11111' };
      const user = { companyNationalIdentificationNumber: '11111' };
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(false);
    });

    it('should consider suggestion irrelevant if its value is the same as the user\'s', () => {
      const suggestion: Suggestion = { type: 'SIRET', id: '11111' };
      const user = { companyNationalIdentificationNumber: '11111' };
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(false);
    });

    it('should consider suggestion relevant if user doesn\'t filled the data', () => {
      const suggestion: Suggestion = { type: 'SIRET', id: '11111' };
      const user = {};
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(true);
    });

    it('should consider suggestion relevant if its value is not the same as the user\'s', () => {
      const suggestion: Suggestion = { type: 'SIRET', id: '11111' };
      const user = { companyNationalIdentificationNumber: '11112' };
      // TODO: remove unnecessary `as unknown` when User type is fixed
      expect(isSuggestionRelevant(suggestion, user as unknown as User)).toEqual(true);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { useSurveyLink } from '../useSurveyLink';

const SURVEY_LINK_BASE_URL = 'https://s.elq.fr/ovhsat';

describe('useSurveyLink', () => {
  it('should generate a survey link with just applicationKey (no lang)', () => {
    const result = useSurveyLink({ applicationKey: 'COM' });
    expect(result).toBe(`${SURVEY_LINK_BASE_URL}/COM_evaluation_survey`);
  });

  it('should generate a survey link without language suffix when lang is "fr"', () => {
    const result = useSurveyLink({ applicationKey: 'COM', languageCode: 'fr' });
    expect(result).toBe(`${SURVEY_LINK_BASE_URL}/COM_evaluation_survey`);
  });

  it('should generate a survey link with uppercase language suffix when lang is provided and not "fr"', () => {
    const result = useSurveyLink({ applicationKey: 'COM', languageCode: 'de' });
    expect(result).toBe(`${SURVEY_LINK_BASE_URL}/COM_evaluation_survey_DE`);
  });

  it('should handle different application keys', () => {
    const result = useSurveyLink({ applicationKey: 'PCI', languageCode: 'de' });
    expect(result).toBe(`${SURVEY_LINK_BASE_URL}/PCI_evaluation_survey_DE`);
  });
});

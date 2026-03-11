import { describe, expect, it } from 'vitest';

import { SURVEY_LINK_BASE_URL } from './links.constants';
import { generateSurveyLink } from './links.util';

describe('generateSurveyLink', () => {
  it('should generate a survey link with just applicationKey (no lang)', () => {
    const result = generateSurveyLink({
      applicationKey: 'COM',
      queryParams: { email: 'test@example.com' },
    });
    expect(result).toBe(`${SURVEY_LINK_BASE_URL}/COM_evaluation_survey?email=test%40example.com`);
  });

  it('should generate a survey link with productId', () => {
    const result = generateSurveyLink({
      applicationKey: 'COM',
      languageCode: 'fr',
      queryParams: { email: 'test@example.com', productId: '1234567890' },
    });
    expect(result).toBe(
      `${SURVEY_LINK_BASE_URL}/COM_evaluation_survey?email=test%40example.com&productId=1234567890`,
    );
  });

  it('should generate a survey link with uppercase language suffix when lang is provided and not "fr"', () => {
    const queryParams = {
      email: 'test@example.com',
    };
    const result = generateSurveyLink({ applicationKey: 'COM', languageCode: 'de', queryParams });
    expect(result).toBe(
      `${SURVEY_LINK_BASE_URL}/COM_evaluation_survey_DE?email=test%40example.com`,
    );
  });

  it('should handle different application keys', () => {
    const queryParams = {
      email: 'test@example.com',
      nichandle: 'test',
      productId: '1234567890',
    };
    const result = generateSurveyLink({ applicationKey: 'PCI', languageCode: 'de', queryParams });
    expect(result).toBe(
      `${SURVEY_LINK_BASE_URL}/PCI_evaluation_survey_DE?email=test%40example.com&nichandle=test&productId=1234567890`,
    );
  });
});

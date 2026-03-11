import { SURVEY_LINK_BASE_URL } from './links.constants';

export type SurveyLinkQueryParams = {
  email: string;
  nichandle?: string;
  productId?: string;
};
export type GenerateSurveyLinkProps = {
  applicationKey: string;
  languageCode?: string;
  queryParams: SurveyLinkQueryParams;
};

/**
 * Generate a survey link for a given application key and language
 * If the language is not provided or is 'fr', the link will be generated without the language suffix
 * @example
 * const surveyLink = generateSurveyLink({ applicationKey: 'COM', languageCode: 'de', queryParams: { email: 'test@example.com', nichandle: 'test', productId: '123' } });
 * console.log(surveyLink); // https://s.elq.fr/ovhsat/COM_evaluation_survey_DE?email=test@example.com&nichandle=test&productId=123
 * @param {GenerateSurveyLinkProps} { applicationKey, languageCode, queryParams }
 * @returns {string} The survey link
 */
export const generateSurveyLink = ({
  applicationKey,
  languageCode,
  queryParams,
}: GenerateSurveyLinkProps): string => {
  const languageSuffix =
    languageCode && languageCode.toLowerCase() !== 'fr' ? `_${languageCode.toUpperCase()}` : '';
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(([, value]) => value),
  );
  const queryParamsString = `?${new URLSearchParams(filteredParams).toString()}`;
  return `${SURVEY_LINK_BASE_URL}/${applicationKey}_evaluation_survey${languageSuffix}${queryParamsString}`;
};

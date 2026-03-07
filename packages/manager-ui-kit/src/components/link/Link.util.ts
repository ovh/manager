import { LINK_SURVEY_BASE_URL } from './Link.constants';
import { GenerateSurveyLinkProps } from './Link.props';

/**
 * Generate a survey link for a given application key and language
 * If the language is not provided or is 'fr', the link will be generated without the language suffix
 * @example
 * const surveyLink = generateSurveyLink({ applicationKey: 'COM', languageCode: 'de' });
 * console.log(surveyLink); // https://s.elq.fr/ovhsat/COM_evaluation_survey_DE
 * @param {SurveyLinkProps} { applicationKey, languageCode, queryParams }
 * @returns {string} The survey link
 */
export const generateSurveyLink = ({
  applicationKey,
  languageCode,
  queryParams,
}: GenerateSurveyLinkProps): string => {
  const languageSuffix =
    languageCode && languageCode.toLowerCase() !== 'fr' ? `_${languageCode.toUpperCase()}` : '';
  const queryParamsString = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : '';
  return `${LINK_SURVEY_BASE_URL}/${applicationKey}_evaluation_survey${languageSuffix}${queryParamsString}`;
};

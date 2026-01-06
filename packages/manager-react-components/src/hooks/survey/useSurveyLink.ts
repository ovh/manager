const SURVEY_LINK_BASE_URL = 'https://s.elq.fr/ovhsat';

type SurveyLinkProps = {
  applicationKey: string;
  languageCode?: string;
};

/**
 * Generate a survey link for a given application key and language
 * If the language is not provided or is 'fr', the link will be generated without the language suffix
 * @example
 * const surveyLink = useSurveyLink({ applicationKey: 'COM', languageCode: 'de' });
 * console.log(surveyLink); // https://s.elq.fr/ovhsat/COM_evaluation_survey_DE
 * @param {SurveyLinkProps} { applicationKey, languageCode }
 * @returns {string} The survey link
 */
export const useSurveyLink = ({
  applicationKey,
  languageCode,
}: SurveyLinkProps): string => {
  const languageSuffix =
    languageCode && languageCode.toLowerCase() !== 'fr'
      ? `_${languageCode.toUpperCase()}`
      : '';
  return `${SURVEY_LINK_BASE_URL}/${applicationKey}_evaluation_survey${languageSuffix}`;
};

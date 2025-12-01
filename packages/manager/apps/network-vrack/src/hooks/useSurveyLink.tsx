import { useEffect, useState } from 'react';

import { Region } from '@ovh-ux/manager-config';
import { useShell } from '@ovh-ux/manager-react-shell-client';

import { BASE_URL_SURVEY, SURVEY_LANGUAGES, US_SURVEY_LINK } from '@/utils/constants';

export const useSurveyLink = (): string | null => {
  const shell = useShell();
  const [surveyUrl, setSurveyUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyUrl = async () => {
      if (!shell?.environment) {
        return;
      }

      try {
        const environment = await shell.environment.getEnvironment();
        const user = environment.getUser();
        const region = environment.getRegion();

        if (!user || !region) {
          setSurveyUrl(null);
          return;
        }

        if (region === Region.US) {
          setSurveyUrl(US_SURVEY_LINK);
          return;
        }

        const userLanguage = environment.getUserLanguage();
        const languageToUse = SURVEY_LANGUAGES.ALLOWED.includes(userLanguage)
          ? userLanguage
          : SURVEY_LANGUAGES.DEFAULT;

        setSurveyUrl(`${BASE_URL_SURVEY}${languageToUse}&nic=${user.nichandle}`);
      } catch {
        setSurveyUrl(null);
      }
    };

    void fetchSurveyUrl();
  }, [shell?.environment]);

  return surveyUrl;
};

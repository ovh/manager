import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Icon,
  Link,
  Tooltip,
  ICON_NAME,
  TooltipTrigger,
  TooltipContent,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { TRANSLATION_NAMESPACES } from '@/utils';

export const SURVEY_BASE_URL = 'https://survey.ovh.com/index.php/933956';

/**
 * Component to display a survey link with user-specific parameters
 * @returns React Component
 */
export const SurveyLink: React.FC = () => {
  const { environment } = React.useContext(ShellContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);

  const nic = environment.user.nichandle;
  const subsidiary = environment.user.ovhSubsidiary;
  const targetLanguage = ['FR', 'MA', 'TU', 'SN', 'CA'].includes(subsidiary)
    ? 'fr'
    : 'en';
  const targetSurveyUrl = `${SURVEY_BASE_URL}?lang=${targetLanguage}&nic=${nic}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          id="survey-link-tooltip-trigger"
          href={targetSurveyUrl}
          referrer-policy="strict-origin-when-cross-origin"
          target="_blank"
        >
          <Icon name={ICON_NAME.emoticonSmile} className="mr-2" />
          {t('survey_link')}
        </Link>
      </TooltipTrigger>
      <TooltipContent withArrow>{t('survey_link_tooltip')}</TooltipContent>
    </Tooltip>
  );
};

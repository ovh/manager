import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { OdsLink, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

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
    <>
      <OdsLink
        id="survey-link-tooltip-trigger"
        href={targetSurveyUrl}
        referrerpolicy="strict-origin-when-cross-origin"
        target="_blank"
        color={ODS_LINK_COLOR.primary}
        label={t('survey_link')}
        icon={ODS_ICON_NAME.emoticonSmile}
        iconAlignment={ODS_LINK_ICON_ALIGNMENT.left}
      />
      <OdsTooltip triggerId="survey-link-tooltip-trigger" withArrow>
        <OdsText className="p-2">{t('survey_link_tooltip')}</OdsText>
      </OdsTooltip>
    </>
  );
};

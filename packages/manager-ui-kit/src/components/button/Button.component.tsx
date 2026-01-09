import { useTranslation } from 'react-i18next';

import {
  ButtonProp,
  Icon,
  Button as OdsButton,
  TOOLTIP_POSITION,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { ButtonProps } from '@/components/button/Button.props';
import { useAuthorizationIam } from '@/hooks';

import './translations';
import { BUTTON_PRESET } from './Button.constants';
import { Link } from 'react-router-dom';
import { useSurveyLink } from '@/hooks/survey/useSurveyLink';
import { extractLanguageCode } from '@/commons';

export const Button = ({
  children,
  iamActions,
  urn,
  displayTooltip = true,
  tooltipPosition = TOOLTIP_POSITION.bottom,
  preset,
  surveyApplicationKey,
  ...restProps
}: ButtonProps & ButtonProp) => {
  const { t, i18n } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions || [], urn || '');

  if (isAuthorized || !(iamActions && urn)) {

    if (preset === BUTTON_PRESET.survey && surveyApplicationKey) {
      return (
        <Link
          to={useSurveyLink({
            applicationKey: surveyApplicationKey,
            languageCode: extractLanguageCode(i18n.language)
            })
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <OdsButton data-testid="manager-button" {...restProps} color={restProps.color ?? 'information'}>
            <Icon name="emoticon-smile" />
            {t('button_survey_preset_label')}
          </OdsButton>
        </Link>
      );
    }

    return (
      <OdsButton data-testid="manager-button" {...restProps}>
        {children}
      </OdsButton>
    );
  }

  return displayTooltip ? (
    <Tooltip position={tooltipPosition}>
      <TooltipTrigger data-testid="manager-button-tooltip" asChild>
        <OdsButton data-testid="manager-button-tooltip" {...restProps} disabled={true}>
          {children}
        </OdsButton>
      </TooltipTrigger>
      <TooltipContent>{t('common_iam_actions_message')}</TooltipContent>
    </Tooltip>
  ) : (
    <OdsButton data-testid="manager-button-without-tooltip" {...restProps} disabled={true}>
      {children}
    </OdsButton>
  );
};

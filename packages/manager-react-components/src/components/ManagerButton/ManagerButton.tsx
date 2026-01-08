import React, { PropsWithChildren, RefAttributes, HTMLAttributes } from 'react';
import { OdsButton, OdsTooltip } from '@ovhcloud/ods-components/react';
import { JSX, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';
import { extractLanguageCode } from '../../utils/translation-helper';
import { useSurveyLink } from '../../hooks/survey/useSurveyLink';

export enum ManagerButtonPreset {
  survey = 'survey',
}

export type ManagerButtonProps = PropsWithChildren<{
  id: string;
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  preset?: ManagerButtonPreset;
  surveyApplicationKey?: string;
  label: string;
}>;

export const ManagerButton = ({
  id,
  children,
  label,
  iamActions,
  urn,
  displayTooltip = true,
  isIamTrigger = true,
  preset,
  surveyApplicationKey,
  ...restProps
}: ManagerButtonProps &
  Partial<
    JSX.OdsButton &
      Omit<HTMLAttributes<HTMLOdsButtonElement>, 'style' | 'id'> &
      StyleReactProps &
      RefAttributes<HTMLOdsButtonElement>
  >) => {
  const { t, i18n } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions, urn, isIamTrigger);

  if (isAuthorized || !(iamActions && urn)) {
    return (
      <OdsButton
        data-testid="manager-button"
        {...restProps}
        label={label}
        {...(preset === ManagerButtonPreset.survey &&
          surveyApplicationKey && {
            icon: ODS_ICON_NAME.emoticonSmile,
            label: t('button_survey_preset_label'),
            onClick: () => {
              window.open(
                useSurveyLink({
                  applicationKey: surveyApplicationKey,
                  languageCode: extractLanguageCode(i18n.language),
                }),
                '_blank',
              );
            },
          })}
      />
    );
  }
  return displayTooltip ? (
    <>
      <div id={id} className="w-fit">
        <OdsButton
          data-testid="manager-button-tooltip"
          {...restProps}
          isDisabled={true}
          label={label}
          onClick={null}
        />
      </div>
      <OdsTooltip triggerId={id} with-arrow>
        <div>{t('common_iam_actions_message')}</div>
      </OdsTooltip>
    </>
  ) : (
    <OdsButton
      data-testid="manager-button-without-tooltip"
      {...restProps}
      isDisabled={true}
      onClick={null}
      label={label}
    />
  );
};

import React from 'react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { extractLanguageCode } from '../../../utils/translation-helper'
import { useSurveyLink } from '../../../hooks/survey/useSurveyLink';
import './translations/translations';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
  survey = 'survey',
}

export interface LinksProps {
  className?: string;
  download?: string;
  label?: React.ReactNode;
  href?: string;
  rel?: OdsHTMLAnchorElementRel;
  target?: OdsHTMLAnchorElementTarget;
  type?: LinkType;
  surveyApplicationKey?: string;
  onClickReturn?: () => void;
}

export const Links: React.FC<LinksProps> = ({
  label,
  onClickReturn,
  type,
  surveyApplicationKey,
  ...props
}: LinksProps) => {
  const { t, i18n } = useTranslation('links');
  return (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={onClickReturn}
      {...props}
      {...(surveyApplicationKey && type === LinkType.survey && {
        label: t('link_survey_preset_label'),
        href: useSurveyLink({ applicationKey: surveyApplicationKey, languageCode: extractLanguageCode(i18n.language) }),
        target: OdsHTMLAnchorElementTarget._blank,
        rel: OdsHTMLAnchorElementRel.noopener,
      })}
    >
      <span slot="start">
        {type === LinkType.back && (
          <OsdsIcon
            className="mr-4"
            hoverable
            name={ODS_ICON_NAME.ARROW_LEFT}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        )}
        {type === LinkType.survey && (
          <OsdsIcon
            className="mr-4"
            hoverable
            name={ODS_ICON_NAME.SMILEY_HAPPY_CONCEPT}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        )}
      </span>

      {label}
      {[LinkType.next, LinkType.external].includes(type) && (
        <span slot="end">
          <OsdsIcon
            aria-hidden="true"
            className="ml-4"
            name={
              type === LinkType.external
                ? ODS_ICON_NAME.EXTERNAL_LINK
                : ODS_ICON_NAME.ARROW_RIGHT
            }
            hoverable
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </span>
      )}
    </OsdsLink>
  );
};

export default Links;

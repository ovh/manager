import React from 'react';
import {
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_LINK_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { extractLanguageCode } from '../../../utils/translation-helper';
import { useSurveyLink } from '../../../hooks/survey/useSurveyLink';
import './translations';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
  survey = 'survey',
}
export enum IconLinkAlignmentType {
  left = 'left',
  right = 'right',
}

export interface LinksProps {
  id?: string;
  className?: string;
  color?: ODS_LINK_COLOR;
  download?: string;
  label?: string;
  children?: string;
  href?: string;
  rel?: string;
  target?: string;
  iconAlignment?: IconLinkAlignmentType;
  type?: LinkType;
  onClickReturn?: () => void;
  isDisabled?: boolean;
  surveyApplicationKey?: string;
}

export const Links: React.FC<LinksProps> = ({
  children,
  label,
  onClickReturn,
  type,
  href,
  color = ODS_LINK_COLOR.primary,
  iconAlignment,
  className = '',
  surveyApplicationKey,
  ...props
}) => {
  const { t, i18n } = useTranslation('link');
  return (
    <OdsLink
      className={className}
      href={href}
      onClick={onClickReturn}
      color={color}
      {...(iconAlignment && {
        iconAlignment: ODS_LINK_ICON_ALIGNMENT[iconAlignment],
      })}
      {...props}
      {...(type === LinkType.back && {
        icon: ODS_ICON_NAME.arrowLeft,
        iconAlignment: ODS_LINK_ICON_ALIGNMENT.left,
      })}
      label={label ?? children}
      {...(type === LinkType.next && { icon: ODS_ICON_NAME.arrowRight })}
      {...(type === LinkType.external && { icon: ODS_ICON_NAME.externalLink })}
      {...(type === LinkType.survey && surveyApplicationKey && {
        icon: ODS_ICON_NAME.emoticonSmile,
        label: t('link_survey_preset_label'),
        href: useSurveyLink({
          applicationKey: surveyApplicationKey,
          languageCode: extractLanguageCode(i18n.language),
        }),
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
    />
  )
};

export default Links;

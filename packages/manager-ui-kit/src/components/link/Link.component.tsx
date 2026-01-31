import { ElementType } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Link as OdsLink,
  TOOLTIP_POSITION,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { extractLanguageCode } from '@/commons/utils/TranslationHelper';
import { LinkProps, LinkType } from '@/components/link/Link.props';
import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';
import { useSurveyLink } from '@/hooks/survey/useSurveyLink';

import { LinkIcons } from './LinkIcons.component';
import './translations';

export const Link = <T extends ElementType = 'a'>({
  children,
  type,
  iamActions,
  urn,
  disableIamCheck = false,
  displayTooltip = true,
  surveyApplicationKey,
  ...odsLinkProps
}: LinkProps<T>) => {
  const { t, i18n } = useTranslation([NAMESPACES.IAM, 'link']);
  const { isAuthorized } = useAuthorizationIam(iamActions || [], urn || '', !disableIamCheck);

  if (type === LinkType.survey && surveyApplicationKey) {
    return (
      <OdsLink
        {...odsLinkProps}
        /* eslint-disable-next-line react-hooks/rules-of-hooks */
        href={useSurveyLink({
          applicationKey: surveyApplicationKey,
          languageCode: extractLanguageCode(i18n.language),
        })}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkIcons type={type}>{t('link_survey_preset_label', { ns: 'link' })}</LinkIcons>
      </OdsLink>
    );
  }

  if (isAuthorized || iamActions === undefined) {
    return (
      <OdsLink {...odsLinkProps}>
        <LinkIcons type={type}>{children}</LinkIcons>
      </OdsLink>
    );
  }

  if (!displayTooltip) {
    return (
      <OdsLink {...odsLinkProps} disabled={true}>
        <LinkIcons type={type}>{children}</LinkIcons>
      </OdsLink>
    );
  }

  return (
    <Tooltip position={TOOLTIP_POSITION.bottom}>
      <TooltipTrigger asChild>
        <OdsLink {...odsLinkProps} disabled={true}>
          <LinkIcons type={type}>{children}</LinkIcons>
        </OdsLink>
      </TooltipTrigger>
      <TooltipContent>{t('iam_actions_message')}</TooltipContent>
    </Tooltip>
  );
};

export default Link;

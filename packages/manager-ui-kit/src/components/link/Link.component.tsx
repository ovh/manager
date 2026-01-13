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

import { useAuthorizationIam } from '@/hooks/iam/useOvhIam';

import { LinkProps } from './Link.props';
import { LinkIcons } from './LinkIcons.component';

export const Link = <T extends ElementType = 'a'>({
  children,
  type,
  iamActions,
  urn,
  disableIamCheck = false,
  displayTooltip = true,
  ...odsLinkProps
}: LinkProps<T>) => {
  const { t } = useTranslation(NAMESPACES.IAM);
  const { isAuthorized } = useAuthorizationIam(iamActions || [], urn || '', !disableIamCheck);

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

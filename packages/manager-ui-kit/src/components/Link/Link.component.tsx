import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Link as OdsLink,
  Icon,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TOOLTIP_POSITION,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { LinkType, LinkProps, LinkIconsProps } from './Link.props';
import { useAuthorizationIam } from '../../hooks';

const LinkIcons: React.FC<LinkIconsProps> = ({ type, children }) => (
  <>
    {type === LinkType.back && <Icon name="arrow-left" />}
    {children}
    {type === LinkType.external && <Icon name="external-link" />}
    {type === LinkType.next && <Icon name="arrow-right" />}
  </>
);

export const Link: React.FC<LinkProps> = ({
  children,
  type,
  href,
  className = '',
  iamActions,
  urn,
  disableIamCheck = false,
  displayTooltip = true,
  isIamTrigger = true,
  ...props
}) => {
  const { t } = useTranslation(NAMESPACES.IAM);
  const { isAuthorized } = useAuthorizationIam(
    iamActions || [],
    urn || '',
    !disableIamCheck,
  );

  const getLinkProps = (isDisabled = false) => ({
    className,
    href,
    disabled: isDisabled,
    ...props,
  });

  if (isAuthorized || iamActions === undefined) {
    return (
      <OdsLink {...getLinkProps()}>
        <LinkIcons type={type}>{children}</LinkIcons>
      </OdsLink>
    );
  }

  if (!displayTooltip) {
    return (
      <OdsLink {...getLinkProps(true)}>
        <LinkIcons type={type}>{children}</LinkIcons>
      </OdsLink>
    );
  }

  return (
    <Tooltip position={TOOLTIP_POSITION.bottom}>
      <TooltipTrigger asChild>
        <OdsLink {...getLinkProps(true)} disabled={true}>
          <LinkIcons type={type}>{children}</LinkIcons>
        </OdsLink>
      </TooltipTrigger>
      <TooltipContent>{t('iam_actions_message')}</TooltipContent>
    </Tooltip>
  );
};

export default Link;

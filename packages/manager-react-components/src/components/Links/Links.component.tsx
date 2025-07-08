import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Link,
  Icon,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TOOLTIP_POSITION,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { LinkType, LinksProps, LinkIconsProps } from './Links.props';
import { useAuthorizationIam } from '../../hooks';

const LinkIcons: React.FC<LinkIconsProps> = ({ type, children }) => (
  <>
    {type === LinkType.back && <Icon name="arrow-left" />}
    {children}
    {type === LinkType.external && <Icon name="external-link" />}
    {type === LinkType.next && <Icon name="arrow-right" />}
  </>
);

export const Links: React.FC<LinksProps> = ({
  children,
  onClickReturn,
  type,
  href,
  className = '',
  iamActions,
  urn,
  disabled = false,
  disabledIamCheck = false,
  displayTooltip = true,
  isIamTrigger = true,
  ...props
}) => {
  const { t } = useTranslation(NAMESPACES.IAM);
  const { isAuthorized } = useAuthorizationIam(
    iamActions,
    urn,
    !disabledIamCheck,
  );

  // Fonction utilitaire pour obtenir les props du lien
  const getLinkProps = (isDisabled = false) => ({
    className,
    href,
    onClick: onClickReturn,
    disabled: isDisabled,
    ...props,
  });

  // Fonction utilitaire pour rendre le contenu du lien
  const renderLinkContent = () => (
    <Link {...getLinkProps()}>
      <LinkIcons type={type}>{children}</LinkIcons>
    </Link>
  );

  // Fonction utilitaire pour rendre le lien désactivé
  const renderDisabledLink = () => (
    <Link {...getLinkProps(true)}>
      <LinkIcons type={type}>{children}</LinkIcons>
    </Link>
  );

  // Fonction utilitaire pour rendre le lien avec tooltip
  const renderLinkWithTooltip = () => (
    <Tooltip position={TOOLTIP_POSITION.bottom}>
      <TooltipTrigger asChild>
        <Link {...getLinkProps(true)}>
          <LinkIcons type={type}>{children}</LinkIcons>
        </Link>
      </TooltipTrigger>
      <TooltipContent>{t('iam_actions_message')}</TooltipContent>
    </Tooltip>
  );

  // Logique principale de rendu
  if (isAuthorized || iamActions === undefined) {
    return renderLinkContent();
  }

  if (!displayTooltip) {
    return renderDisabledLink();
  }

  return renderLinkWithTooltip();
};

export default Links;

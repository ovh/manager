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
import { LinkType, LinksProps } from './Links.props';
import { useAuthorizationIam } from '../../hooks';

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
  const renderLinkContent = () => (
    <>
      {type === LinkType.back && <Icon name="arrow-left" />}
      {children}
      {type === LinkType.external && <Icon name="external-link" />}
      {type === LinkType.next && <Icon name="arrow-right" />}
    </>
  );

  const getLinkProps = (isDisabled = false) => ({
    className,
    href,
    onClick: onClickReturn,
    disabled: isDisabled,
    ...props,
  });

  if (isAuthorized || iamActions === undefined) {
    return <Link {...getLinkProps()}>{renderLinkContent()}</Link>;
  }

  if (!displayTooltip) {
    return <Link {...getLinkProps(true)}>{renderLinkContent()}</Link>;
  }

  return (
    <Tooltip position={TOOLTIP_POSITION.bottom}>
      <TooltipTrigger asChild>
        <Link {...getLinkProps(true)}>{renderLinkContent()}</Link>
      </TooltipTrigger>
      <TooltipContent>{t('iam_actions_message')}</TooltipContent>
    </Tooltip>
  );
};

export default Links;

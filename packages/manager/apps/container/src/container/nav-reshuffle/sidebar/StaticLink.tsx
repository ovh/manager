import React from 'react';
import { useTranslation } from 'react-i18next';
import { Environment } from '@ovh-ux/manager-config';
import { useShell } from '@/context';
import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';

interface StaticLinkProps {
  count?: number | boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  handleClick?(): void;
  id?: string;
  isShortText?: boolean;
}

const StaticLink: React.FC<ComponentProps<StaticLinkProps>> = ({
  count = 0,
  node = {},
  linkParams = {},
  handleClick = () => {},
  id = '',
  isShortText = false,
}: StaticLinkProps): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  let url: string = null;

  if (node.url) {
    url =
      (node.url as Record<string, string>)[environment.getRegion()] ||
      (node.url as string);
  } else {
    url = navigation.getURL(
      node.routing.application,
      node.routing.hash || '#/',
    );
  }

  if (linkParams) {
    Object.keys(linkParams).forEach((paramName) => {
      url = url.replace(`{${paramName}}`, linkParams[paramName]);
    });
  }

  return (
    <a
      onClick={handleClick}
      href={url}
      target={node.isExternal ? '_blank' : '_top'}
      rel={node.isExternal ? 'noopener noreferrer' : ''}
      id={id}
    >
      {t(isShortText ? node.shortTranslation : node.translation)}
      {node.isExternal && (
        <span
          aria-hidden="true"
          className={`${style.sidebar_external} oui-icon oui-icon-external-link`}
        ></span>
      )}
      {!isShortText && <SidebarLinkTag node={node} />}
      {!isShortText && (count as number) > 0 && (
        <span
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
        >
          {count}
        </span>
      )}
    </a>
  );
};
export default StaticLink;

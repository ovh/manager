import React from 'react';

import { useTranslation } from 'react-i18next';
import { Environment } from '@ovh-ux/manager-config/types';

import { useShell } from '@/context';

import style from './style.module.scss';
import SidebarLinkTag from './SidebarLinkTag';
import { Node } from './navigation-tree/node';

interface StaticLinkProps {
  count?: number | boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  onClick?(): void;
  id?: string;
}

const StaticLink: React.FC<ComponentProps<StaticLinkProps>> = ({
  count = 0,
  node = {},
  linkParams = {},
  onClick = () => {},
  id = '',
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
      onClick={onClick}
      href={url}
      target={node.isExternal ? '_blank' : '_top'}
      rel={node.isExternal ? 'noopener noreferrer' : ''}
      id={id}
    >
      {t(node.translation)}
      {node.isExternal && (
        <span
          aria-hidden="true"
          className={`${style.sidebar_external} oui-icon oui-icon-external-link`}
        ></span>
      )}
      <SidebarLinkTag node={node} />
      {count > 0 && (
        <span
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
        >
          {count}
        </span>
      )}
    </a>
  );
};

type SidebarLinkProps = {
  count?: number | boolean;
  node?: Node;
  linkParams?: Record<string, string>;
  onClick?(): void;
  id?: string;
};

const SidebarLink: React.FC<ComponentProps<SidebarLinkProps>> = ({
  count = 0,
  node = {},
  linkParams = {},
  onClick = () => {},
  id = '',
}: SidebarLinkProps): JSX.Element => {
  const { t } = useTranslation('sidebar');

  return !node.children && (node.url || node.routing) ? (
    <StaticLink
      onClick={onClick}
      count={count}
      node={node}
      linkParams={linkParams}
      id={id}
    />
  ) : (
    <a onClick={onClick} id={id}>
      {t(node.translation)}
      {node.children ? (
        <span
          className={`oui-icon oui-icon-chevron-right ${style.sidebar_arrow}`}
          aria-hidden="true"
        ></span>
      ) : (
        ''
      )}
      <SidebarLinkTag node={node} />
      {count > 0 && (
        <span
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
        >
          {count}
        </span>
      )}
    </a>
  );
};

export default SidebarLink;

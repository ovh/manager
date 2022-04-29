import React from 'react';

import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import style from './style.module.scss';

type StaticLinkProps = {
  count?: number;
  node?: unknown;
  linkParams?: Record<string, string>;
  id?: string;
};

function StaticLink({
  count = 0,
  node = {},
  linkParams = {},
  id = '',
}: StaticLinkProps): JSX.Element {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');
  let url = null;

  if (node.url) {
    url =
      node.url[
        shell
          .getPlugin('environment')
          .getEnvironment()
          .getRegion()
      ] || node.url;
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
  const { betaVersion } = useProductNavReshuffle();

  if (betaVersion === 2 && !count && node.count !== false) {
    return <></>;
  }

  return (
    <a
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
      {count > 0 && (
        <span
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
        >
          {count}
        </span>
      )}
    </a>
  );
}

type SidebarLinkProps = {
  count?: number;
  node?: unknown;
  linkParams?: Record<string, string>;
  onClick?(): void;
  id?: string;
};

function SidebarLink({
  count = 0,
  node = {},
  linkParams = {},
  onClick = () => {},
  id = '',
}: SidebarLinkProps): JSX.Element {
  const { t } = useTranslation('sidebar');
  return node.url || node.routing ? (
    <StaticLink count={count} node={node} linkParams={linkParams} id={id} />
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
      {count > 0 && (
        <span
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
        >
          {count}
        </span>
      )}
    </a>
  );
}

export default SidebarLink;

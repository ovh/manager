import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';
import style from './style.module.scss';

function StaticLink({ node, linkParams }) {
  const { t } = useTranslation('sidebar');
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');
  let url =
    node.url ||
    navigation.getURL(node.routing.application, node.routing.hash || '');

  if (linkParams) {
    Object.keys(linkParams).forEach((paramName) => {
      url = url.replace(`{${paramName}}`, linkParams[paramName]);
    });
  }

  return (
    <a
      href={url}
      target={node.isExternal ? '_blank' : '_top'}
      rel={node.isExternal ? 'noopener noreferrer' : ''}
    >
      {t(node.translation)}
      {node.isExternal && (
        <span
          aria-hidden="true"
          className={`${style.sidebar_external} oui-icon oui-icon-external-link`}
        ></span>
      )}
    </a>
  );
}

StaticLink.propTypes = {
  linkParams: PropTypes.any,
  node: PropTypes.any,
};

function SidebarLink({ count, linkParams, node, onClick }) {
  const { t } = useTranslation('sidebar');
  return node.url || node.routing ? (
    <StaticLink node={node} linkParams={linkParams} />
  ) : (
    <a onClick={onClick}>
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

SidebarLink.propTypes = {
  count: PropTypes.number,
  linkParams: PropTypes.any,
  node: PropTypes.any,
  onClick: PropTypes.func,
};

export default SidebarLink;

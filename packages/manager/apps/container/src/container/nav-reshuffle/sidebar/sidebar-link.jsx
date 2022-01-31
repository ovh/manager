import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';

function SidebarLink(props) {
  const { t } = useTranslation('sidebar');
  const { node } = props;
  return (
    <a onClick={props.onClick}>
      {t(node.translation)}
      {node.children ? (
        <span
          className={`oui-icon oui-icon-chevron-right ${style.sidebar_arrow}`}
          aria-hidden="true"
        ></span>
      ) : (
        ''
      )}
      {props.count > 0 && (
        <span
          className={`oui-badge oui-badge_s oui-badge_new ml-1 ${style.sidebar_chip}`}
        >
          {props.count}
        </span>
      )}
    </a>
  );
}

SidebarLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  node: PropTypes.any,
  count: PropTypes.number,
};

export default SidebarLink;

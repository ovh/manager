import React from 'react';

import PropTypes from 'prop-types';

type Props = {
  level: string;
};

const NotificationIcon = ({ level }: Props): JSX.Element => {
  const getIconClassName = (notificationLevel) => {
    switch (notificationLevel) {
      case 'error':
      case 'warning':
      case 'success':
      case 'info':
        return `oui-icon-${notificationLevel}-circle`;
      case 'incident':
        return 'oui-icon-clock-wait';
      default:
        return 'oui-icon_bicolor';
    }
  };

  const iconClassName = getIconClassName(level);

  return (
    <span
      className={`oui-icon oui-navbar-notification__icon oui-icon_bicolor oui-icon-info-circle ${iconClassName}`}
      aria-hidden="true"
    ></span>
  );
};

NotificationIcon.propTypes = {
  level: PropTypes.string,
};

NotificationIcon.defaultProps = {
  level: '',
};

export default NotificationIcon;

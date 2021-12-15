import React from 'react';

import style from './notification.module.scss';

const NotificationIcon = ({ level }) => {
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

  let iconClassName = getIconClassName(level);

  return (
    <span
      className={`oui-icon oui-navbar-notification__icon oui-icon_bicolor oui-icon-info-circle ${iconClassName}`}
      aria-hidden="true"
    ></span>
  );
};

export default NotificationIcon;

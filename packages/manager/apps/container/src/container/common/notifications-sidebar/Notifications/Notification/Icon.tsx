import React from 'react';

type Props = {
  level?: string;
};

const NotificationIcon = ({ level = '' }: Props): JSX.Element => {
  const getIconClassName = (notificationLevel: string): string => {
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

  return (
    <span
      className={`oui-icon oui-navbar-notification__icon oui-icon_bicolor oui-icon-info-circle ${getIconClassName(
        level,
      )}`}
      aria-hidden="true"
    ></span>
  );
};

export default NotificationIcon;

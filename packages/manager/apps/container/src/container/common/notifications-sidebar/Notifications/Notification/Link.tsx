import React from 'react';

import PropTypes from 'prop-types';

import useNotifications from '@/core/notifications';

type Props = {
  children: JSX.Element;
  notificationId: string;
  url: string;
};

const NotificationIcon = ({
  children,
  notificationId,
  url,
}: Props): JSX.Element => {
  const { toggleNotificationReadStatus } = useNotifications();

  const onNotificationLinkClick = () => {
    return toggleNotificationReadStatus(notificationId, true);
  };

  return (
    <a href={url} onClick={onNotificationLinkClick}>
      {children}
    </a>
  );
};

NotificationIcon.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  notificationId: PropTypes.string,
  url: PropTypes.string,
};

NotificationIcon.defaultProps = {
  children: null,
  notificationId: '',
  url: '',
};

export default NotificationIcon;
